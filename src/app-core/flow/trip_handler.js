import Trip from '../../backend/trip/trip'
import TripService from '../../backend/trip/trip_service'
import TripDataService from '../../backend/storage/trips'
import CurrentTripDataService from '../../backend/storage/current_trip'
import UserDataService from '../../backend/storage/user'
class TripHandler{
    async requestNewTripHandler(trip_name,imageUri =null){
        const respond = await Trip.requestNewTrip(trip_name,imageUri)
        if(respond.status!==200)return false
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

        return true
    }

    async requestAllTripHandler (){
        const respond = await Trip.requestTripsData()
        if(respond.status!==200)return false
        const data = respond.data
        if(data.all_trip_data){
            // TripDataService.setTripsData(data.all_trip_data)
            await TripDataService.handleAllTripsList(data.all_trip_data.trip_data_list)
        }
        return true
    }

    async requestCurrentTripHandler(){
        const respond = await Trip.requestCurrentTripId()
        if (respond.status!==200) return false
        const data = respond.data
        const trip_id = data.current_trip_id
        if (trip_id){
            const current_trip_data = await this.requestTripDataHandler(trip_id)
            const trip_data = current_trip_data.trip_data 
            if(trip_data!==null){
                // const trip_data = TripDataService.getObjectReady(data.trip_data.trip_name,data.trip_data.trip_id,data.trip_data.created_time)
                let trip_image_uri = null
                if(trip_data.trip_image){
                    trip_image_uri = await CurrentTripDataService.setCurrentTripImageCoverToLocal(trip_data.trip_image,data.current_trip_id)
                }
                const trip_data_object = CurrentTripDataService.getObjectReady(trip_data.trip_name, trip_data.trip_id, 
                trip_data.created_time,trip_image_uri)
                await CurrentTripDataService.saveCurrentTripDataToLocal(UserDataService.getUserId(),trip_id,trip_data_object)
                
            }
            await CurrentTripDataService.setTripStatusToLocal('true')
        }
        return true
    } 

    async requestTripDataHandler(trip_id){
        // return the process status not the data status meaning if the data is none, it will also return true
        const respond = await Trip.requestTripData(trip_id)
        if(respond.status!==200) return false
        const data = respond.data
        return data ? data : null
    }

    async endTripHandler(){
        const respond = await Trip.end_trip()
        if(!respond || respond.status!==200)return
        await CurrentTripDataService.resetCurrentTripData()
        stop_task = await TripService.stopGPSWatch()
        console.assert(stop_task,'Task not stop')
        return true
    }   
    
}
export default new TripHandler()