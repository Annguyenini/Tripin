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
            const trip_image_uri = await CurrentTripDataService.setCurrentTripImageCoverToLocal(imageUri,trip_id)
            // tripdata object
            const trip_data = CurrentTripDataService.getObjectReady(trip_name,trip_id,Date.now(),trip_image_uri)
            // save tripdata
            await CurrentTripDataService.saveCurrentTripDataToLocal(trip_data)

            // set current trip app state to true
            await CurrentTripDataService.setTripStatusToLocal('true')

            //create db sqlite
            await TripDataStorage.init_new_trip(trip_id)

            const trip_object = TripDatabaseService.getObjectReady(UserDataService.getUserId(),trip_id,trip_name,imageUri)
            console.log('re',trip_object)
            await TripDatabaseService.addTripToDatabase(trip_object)
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
    async requestAllTripHandler (){
        const respond = await Trip.requestTripsData()
        // if match 
        if(!respond.ok ||respond.status ===304){
            if (await TripDataService.loadAllTripsListFromLocal()){
                return true
            }
            await EtagService.deleteEtagFromLocal(ETAG_KEY.ALL_TRIPS_LIST)
            // return await this.requestAllTripHandler()
        }
        // if the backend fail
        if(respond.status!==200)return false
        const data = respond.data
        if(!data.all_trip_data) return true
        const save_status = await TripDataService.handleAllTripsList(data.all_trip_data.trip_data_list)
        if(data.etag){
            console.log('etag',data.etag)
            await EtagService.saveEtagToLocal(ETAG_KEY.ALL_TRIPS_LIST,data.etag)
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
    async requestCurrentTripHandler(){
        const respond = await Trip.requestCurrentTripId()
        if (respond.status!==200) return false
        const data = respond.data
        const trip_id = data.current_trip_id
        console.log('current trip id', trip_id)
        if (trip_id){
            await CurrentTripDataService.setTripStatusToLocal('true')
            console.log(trip_id)
            const current_trip_respond = await Trip.requestTripData(trip_id)
            const status = current_trip_respond.status
            if (status===304){
                if (!await CurrentTripDataService.loadCurrentTripDataFromLocal(UserDataService.getUserId(),trip_id)){
                    await EtagService.deleteEtagFromLocal(GENERATE_TRIP_ETAG_KEY(trip_id))
                    return await this.requestCurrentTripHandler()
                }
                return true
            }
            

            const current_trip_data = current_trip_respond.data
            const trip_data = current_trip_data.trip_data 
            if(trip_data){
                // const trip_data = TripDataService.getObjectReady(data.trip_data.trip_name,data.trip_data.trip_id,data.trip_data.created_time)
                let trip_image_uri = null
                if(trip_data.image){
                    trip_image_uri = await CurrentTripDataService.setCurrentTripImageCoverToLocal(trip_data.image,data.current_trip_id,'aws')
                }
                const trip_data_object = CurrentTripDataService.getObjectReady(trip_data.trip_name, trip_data.trip_id, 
                trip_data.created_time,trip_image_uri)
                await CurrentTripDataService.saveCurrentTripDataToLocal(trip_data_object)
                
            }

            const trip_etag = current_trip_data.etag

            await EtagService.saveEtagToLocal(GENERATE_TRIP_ETAG_KEY(trip_id),trip_etag)

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
            const etag_key = EtagService.GENERATE_TRIP_ETAG_KEY(trip_id)
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
        return true
    }   
    
}
export default new TripHandler()