import SqliteService from '../../../backend/database/sqlite/sqlite'
import CurrentTripDataService from '../../../backend/storage/current_trip'
import TripContentsService from '../../../backend/services/trip_contents'
import TripDatabaseService from '../../../backend/database/TripDatabaseService'
import UserDataService from '../../../backend/storage/user'
import { _registerNetworkCallback } from './network_observer'
import safeRun from '../../helpers/safe_run'
import TripCoordinateDatabase from '../../../backend/database/trip_coordinate_database'
class TripSync {
    constructor() {
        this.pennding = []
        this.syncing = false
        this.coordinatesSyncing = false
        this.mediasSyncing = false
        this.TripCoordinateDatabase = new TripCoordinateDatabase()
        _registerNetworkCallback(this.networkCallback.bind(this))
    }
    addIntoQueue(itemType, version = null, data) {
        this.pennding.push({
            'version': version,
            'itemType': itemType,
            'data': data
        })
    }
    networkCallback(state) {
        if (state) this.process()
    }
    /**
     * process syncing for trip contents including coords and medias
     * @returns 
     */
    async process() {
        if (this.syncing) return
        this.syncing = true
        while (this.pennding.length !== 0) {
            const item = this.pennding[0]
            console.log(item)

            switch (item.itemType) {
                case 'coordinate':
                    await TripContentsService.send_coordinates([item.data], item.version)
                    break;
                case 'delete_coordinate':
                    await TripContentsService.deleteCoordinate(item.data.trip_id, item.data.coordinate_id, item.data.modified_time)
                    break;
                case 'media':
                    await TripContentsService.sendTripMedia(item.data.media_id, CurrentTripDataService.getCurrentTripId(), item.data.media_path, item.data.longitude, item.data.latitude, item.data.media_type, item.data.coordinate_id, item.data.time_stamp)
                    break;

                case 'delete_media':
                    await TripContentsService.deleteMedias(item.data.trip_id, item.data.media_id, item.data.modified_time)
                    break;
            }
            this.pennding.shift()

        }
        this.syncing = false
    }

    async processTripCoordinatesSync(trip_id) {

        // delete array defined as local marked as 'remove' but server marked as 'add'
        // upload array defined as item that local has but server dont
        // download array defined as item server has but local dont
        const response = await safeRun(() => TripContentsService.requestTripCoordinates(trip_id))
        const server_coordinate = response.data.coordinates
        const local_coordinate = await safeRun(() => this.TripCoordinateDatabase.getAllCoordinatesFromTripId(trip_id))
        console.log('arrayserver_coordinate', server_coordinate, local_coordinate)

        const delete_array = server_coordinate?.filter((server) => {
            return local_coordinate?.find((local) => local.coordinate_id === server.coordinate_id && local.event === 'remove' && server.event !== 'remove')
        }) || []
        const upload_array = local_coordinate?.filter((local) => {
            return !server_coordinate?.find((server) => server.coordinate_id === local.coordinate_id)
        }) || []
        const download_array = server_coordinate?.filter((server) => {
            return !local_coordinate?.find((local) => local.coordinate_id === server.coordinate_id)
        }) || []
        console.log('array', server_coordinate, local_coordinate, delete_array, upload_array, download_array)
        this.coordinatesSyncing = true
        if (download_array) await this._processDownloadCoordinate(download_array, trip_id)

        if (delete_array) delete_array.forEach(element => {
            this.addIntoQueue('delete_coordinate', null, element)
        });
        if (upload_array) upload_array.forEach(element => {
            this.addIntoQueue('coordinate', null, element)
        });
        await safeRun(() => this.process(), 'failed_at_process_sync_trip_coordinate')
        console.log('after process')
    }
    async _processDownloadCoordinate(localArray, trip_id) {
        await safeRun(() => this.TripCoordinateDatabase.handlerCoordinateFromServer(localArray, trip_id))
    }
}
export default TripSync = new TripSync()