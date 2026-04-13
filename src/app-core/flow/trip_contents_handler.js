import TripContents from '../../backend/services/trip_contents'
import LocationService from '../local_data/local_location_data'
import locationDataService from '../../backend/storage/current_location_data_service'
import TripSync from './sync/trip_contents_sync'
import TripDatabaseService from '../../backend/database/TripDatabaseService'
import TripCoordinateDatabase from '../../backend/database/trip_coordinate_database'
import Albumdb from '../../backend/album/albumdb'
import safeRun from '../helpers/safe_run'
import CurrentDisplayTripMediaObserver from '../../frontend/map_box/functions/current_display_media_observer'
import HashService from '../../backend/services/hash_service/hash_service'
import TripContentSyncManager from './sync/trip_contents_sync_manager'
import MediaService from '../../backend/media/media_service'
import CurrentTripDataService from '../../backend/storage/current_trip'
import CurrentDisplayCoordinateObserver from '../../frontend/map_box/functions/current_display_coordinates_observer'
class TripContentHandler {
    constructor() {
        this.TripCoordinateDatabaseService = new TripCoordinateDatabase()
        this._uploadPending = 0;
    }

    async sendCoordinatesHandler(coors_object, version = null) {
        const respond = await TripContents.send_coordinates(coors_object, version)
        ///

        return respond.ok
    }




    async requestLocationConditionsHandler() {
        const coors = await LocationService.getCurrentCoor()
        if (!coors) {
            return false
        }
        const longitude = coors.coords.longitude
        const latitude = coors.coords.latitude
        const respond = await TripContents.request_location_conditions(longitude, latitude)
        if (!respond.ok || respond.status !== 200) return false
        const data = respond.data
        if (data.geo_data) {
            await locationDataService.setCurrentLocationConditionToLocal(data.geo_data)
            return true
        }
        return false

    }

    async getTripCoordinatesHandler(trip_id) {
        let coordinates = null
        let version = null
        const coordinateHash = await safeRun(() => this.TripCoordinateDatabaseService.getTripCoordinateHash(trip_id))
        coordinates = await this.TripCoordinateDatabaseService.getAllCoordinatesFromTripId(trip_id)
        if (coordinates?.length) {
            version = await TripDatabaseService.getTripCoordinateVersion(trip_id)
        }

        const respond = await safeRun(
            () => TripContents.requestTripCoordinates(trip_id, coordinateHash),
            'fetch_coordinates_failed'
        )
        console.log(respond)
        if (!respond.ok || respond.status !== 200) {

            return coordinates ? coordinates : null
        }

        const data = respond.data
        if (!data.coordinates) return null

        coordinates = data.coordinates
        console.log('coordinate', coordinates)
        // if (data.user_id === UserDataService.getUserId()) {

        // skip save not save trip to local
        // if (await safeRun(
        //     () => this.TripCoordinateDatabaseService.handlerCoordinateFromServer(coordinates, trip_id),
        //     'save_coordinates_failed'
        // )) {
        //     await safeRun(
        //         () => TripDatabaseService.updateTripCorrdinateVersion(trip_id, data.newest_version),
        //         'update_version_failed'
        //     )
        // }
        // }

        return coordinates
    }
    async requestTripMediasHandler(trip_id) {
        const current_trip_id = CurrentTripDataService.getCurrentTripId()
        const trip_media_hash = await safeRun(() => Albumdb.getMediaHash(trip_id))
        const respond = await TripContents.requestTripMedias(trip_id, trip_media_hash)
        let assests = []
        if (!respond.ok || respond.status !== 200) {
            console.log(respond)
            assests = await Albumdb.getAssestsFromTripId(trip_id)
            return assests
        }
        // else if (respond.status !== 200) return []
        const hash = respond.data.hash
        if (hash && current_trip_id === trip_id) {
            const sync = await safeRun(() => TripContentSyncManager.checkTripMediaHash(hash, trip_id), 'failed_at_sync_trip_merdia')
            // return await this.requestTripMediasHandler(trip_id)
            if (sync.ok && sync.code === 'sync_complete') {
                assests = await Albumdb.getAssestsFromTripId(trip_id)
                return assests
            }
            else if (sync.ok && sync.code === 'fresh') {

            }
        }
        else return respond.data.medias

    }
    async uploadTripMediaHandler(media_id, trip_id, media_uri, longitude, latitude, coordinate_id, type, time_stamp) {
        if (!media_uri) return
        this._uploadPending = (this._uploadPending || 0) + 1
        try {
            // pending count to prevent spam lead to loop sync
            // send to server
            const respond = await safeRun(() => TripContents.sendTripMedia(media_id, trip_id, media_uri, longitude, latitude, type, coordinate_id, time_stamp), 'failed_at_send_media_to_server')

            if (!respond.ok || respond.status !== 200) return

            const data = respond.data

            // sync leave for later
            const hash = data.hash
            // after process all request, check hash and sync
            if (hash && this._uploadPending === 1) {
                TripContentSyncManager.checkTripMediaHash(hash, trip_id)
            }
            return respond
        }
        catch (err) {
            console.error(err)
        }
        finally {
            this._uploadPending--
        }
    }

    async deleteMediaHandler(trip_id, media_id, media_path) {
        const modified_time = Date.now()
        // delete in database
        await safeRun(() => Albumdb.deleteMediaFromDB(media_id, trip_id, modified_time), 'failed_delete_media_from_db')
        console.log('delete from database!')

        await safeRun(() => MediaService.deleteMediaToLocalAlbum(media_id), 'failed at delete media from album')
        console.log('delete from local!')
        // delete in album 
        Albumdb.deleteFromAlbumArray(media_id)

        CurrentDisplayTripMediaObserver.deleteAssestFromArrayByUri(trip_id, media_path)
        console.log('delete from observer!')

        let respond = null
        if (trip_id) {
            respond = await TripContents.deleteMedias(trip_id, media_id, modified_time)
        }
        if (respond.status == 200) {
            const data = respond.data
            const hash = data.hash
            if (hash) {
                TripContentSyncManager.checkTripMediaHash(hash, trip_id)
            }
        }

        return

    }
    async deleteCoordinateHandler(trip_id, coordinate_id) {
        let modified_time = Date.now()
        await safeRun(() => this.TripCoordinateDatabaseService.deleteCoordinateFromTripId(trip_id, coordinate_id, modified_time))
        CurrentDisplayCoordinateObserver.deleteCoordinateFromArray(trip_id, coordinate_id)
        let respond = null
        if (trip_id) {
            respond = await TripContents.deleteCoordinate(trip_id, coordinate_id, modified_time)

        }
        return
    }
    // async requestSTripMedias (){
    //     console.log(CurrentTripDataService.getCurrentTripId())
    //     const respond = await TripContents.requestTripMedias(CurrentTripDataService.getCurrentTripId())
    //     if(!respond.ok || respond.status !==200) return
    //     const data = respond.data
    //     await TripContentsDataService.setCurrentMedias(data.medias)
    // }
}

export default new TripContentHandler()