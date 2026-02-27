import Trip from '../../backend/services/trip'
import TripService from '../../backend/gps_logic/gps_logic'
import TripDataService from '../../backend/storage/trips'
import TripDataStorage from '../../backend/trip_coordinates/current_trip_coordinate_service'
import CurrentTripDataService from '../../backend/storage/current_trip'
import UserDataService from '../../backend/storage/user'
import EtagService from '../../backend/services/etag/etag_service'
import { ETAG_KEY ,GENERATE_TRIP_ETAG_KEY} from '../../backend/services/etag/etag_keys'
import TripDatabaseService from '../../backend/database/TripDatabaseService'
import OfflineSyncManager from './sync/offline_sync_manager'
import TripDisplayObserver from '../../frontend/map_box/functions/trip_display_observer'
import GPSLogic from '../../backend/gps_logic/gps_logic'
import safeRun from '../helpers/safe_run'
class TripHandler{
    /**
     * 
     * @param {*} trip_name 
     * @param {*} imageUri 
     * process new trip and save it to the data service
     * @returns boolean of sucess or no
     */
    // current depend on the server
    async requestNewTripHandler(trip_name,imageUri =null){
        try{
            const respond = await Trip.requestNewTrip(trip_name,imageUri)
            if(respond.status!==200)return respond
            // if success fully send to server, process to store in the local 
            
            // data from server
            const data = respond.data
            const trip_id = data.trip_id
            // generate image path nad save to local
            
            const trip_image_uri = await safeRun(()=>CurrentTripDataService.setCurrentTripImageCoverToLocal(imageUri,trip_id) , 'trip_image_save_failed')
            // tripdata object
            const trip_data = CurrentTripDataService.getObjectReady(trip_name,trip_id,Date.now(),trip_image_uri)
            // save tripdata
            await safeRun(()=> CurrentTripDataService.saveCurrentTripDataToLocal(trip_data),'current_trip_save_failed')

            // set current trip app state to true
            // await CurrentTripDataService.setTripStatusToLocal('true')

            //create db sqlite for coordinates
            await safeRun (()=>TripDataStorage.init_new_trip(trip_id),'created_trip_coordinate_table_failed')

            const trip_object = TripDatabaseService.getObjectReady(UserDataService.getUserId(),trip_id,trip_name,imageUri)
            await safeRun (()=>TripDatabaseService.addTripToDatabase(trip_object),'add_trip_to_table_failed')
            GPSLogic.startGPSLogic()
            return respond
        }
        catch(err){
            console.error('Failed at request new trips',err)
            return null
        }
    }
    /**
     * request information of all trips and pass it to a handle class
     * @returns boolean of status
     */
    async requestAllTripHandler() {
        const respond = await safeRun(
            () => Trip.requestTripsData(),
            'fetch_trips_failed'
        )

        if (!respond.ok || respond.status === 304) {
            if (await safeRun(
                () => TripDataService.loadAllTripsListFromLocal(),
                'load_local_failed'
            )) return true

            await safeRun(
                () => EtagService.deleteEtagFromLocal(ETAG_KEY.ALL_TRIPS_LIST),
                'delete_etag_failed'
            )
            return await this.requestAllTripHandler()
        }

        if (respond.status !== 200) return false

        const data = respond.data
        if (!data.all_trip_data) return true

        await safeRun(
            () => TripDataService.handleAllTripsList(data.all_trip_data.trip_data_list),
            'save_trips_failed'
        )

        if (data.etag) {
            console.log('etag', data.etag)
            await safeRun(
                () => EtagService.saveEtagToLocal(ETAG_KEY.ALL_TRIPS_LIST, data.etag),
                'save_etag_failed'
            )
        }

        return true
    }
    /**
     * refresh all trips data, simply request again to server
     * @returns 
     */
    async refreshAllTripsData(){
        await EtagService.deleteEtagFromLocal(ETAG_KEY.ALL_TRIPS_LIST)
        return await this.requestAllTripHandler()
    } 

    /**
     * request current trip handler, fetch trip_id, current trip_data then save it to local
     * @returns 
     */
    async requestCurrentTripHandler() {
        const respond = await safeRun(
            () => Trip.requestCurrentTripId(),
            'fetch_current_trip_id_failed'
        )

        if (respond.status !== 200) return false

        const data = respond.data
        const trip_id = data.current_trip_id

        if (trip_id) {
            console.log(trip_id)
            const current_trip_respond = await safeRun(
                () => Trip.requestTripData(trip_id),
                'fetch_trip_data_failed'
            )

            const status = current_trip_respond.status

            if (status === 304) {
                if (!await safeRun(
                    () => CurrentTripDataService.loadCurrentTripDataFromLocal(UserDataService.getUserId(), trip_id),
                    'load_local_trip_failed'
                )) {
                    await safeRun(
                        () => EtagService.deleteEtagFromLocal(GENERATE_TRIP_ETAG_KEY(trip_id)),
                        'delete_etag_failed'
                    )
                    return await this.requestCurrentTripHandler()
                }
                return true
            }

            const current_trip_data = current_trip_respond.data
            const trip_data = current_trip_data.trip_data

            if (trip_data) {
                let trip_image_uri = null
                if (trip_data.image) {
                    trip_image_uri = await safeRun(
                        () => CurrentTripDataService.setCurrentTripImageCoverToLocal(trip_data.image, data.current_trip_id, 'aws'),
                        'save_image_failed'
                    )
                }

                const trip_data_object = CurrentTripDataService.getObjectReady(
                    trip_data.trip_name, trip_data.trip_id,
                    trip_data.created_time, trip_image_uri
                )

                await safeRun(
                    () => CurrentTripDataService.saveCurrentTripDataToLocal(trip_data_object),
                    'save_trip_data_failed'
                )
            }

            await safeRun(
                () => EtagService.saveEtagToLocal(GENERATE_TRIP_ETAG_KEY(trip_id), current_trip_data.etag),
                'save_etag_failed'
            )
        }

        return true
    } 
    /**
     * 
     * @param {*} trip_id 
     * request trip data base on trip_id
     * @returns 
     */
    async requestTripDataHandler(trip_id){
        // return the process status not the data status meaning if the data is none, it will also return true
        const user_id = UserDataService.getUserId()
        const respond = await Trip.requestTripData(trip_id)
        if(!respond.ok || respond.status ===304) {
            return await TripDataService.getTripDataFromLocal(user_id,trip_id)
        }
        if(respond.status!==200) return null
        const data = respond.data
        const trip_data = data.trip_data
        const etag = data.etag
        if (await TripDataService.saveTripDataToLocal(user_id,trip_id,trip_data)){
            const etag_key = GENERATE_TRIP_ETAG_KEY(trip_id)
            await EtagService.saveEtagToLocal(etag_key,etag)
        }
        return trip_data
    }
    /**
     * handle end trip
     * @returns 
     */
    // currently depend on server
    async endTripHandler(){
        try{
            const respond = await Trip.end_trip()
            if(!respond.ok || respond.status!==200){
                OfflineSyncManager.pushEventToQueue(
                    OfflineSyncManager.getSyncObjectReady(
                        OfflineSyncManager.EVENTS.END_TRIP,
                        {
                            trip_id:CurrentTripDataService.getCurrentTripId()
                        },
                        Date.now()
                    ))
            }

            await CurrentTripDataService.resetCurrentTripData()
            GPSLogic.endGPSLogic()
            return true
        }
        catch(err){
            console.error('Failed to end trip',err)
            return false
        }
    }   
    
}
export default new TripHandler()