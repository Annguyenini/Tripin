import Trip from '../../backend/trip/trip'
import TripService from '../../backend/trip/trip_service'
import TripDataService from '../../backend/storage/trip'
class TripHandler{
    async requestNewTripHandler(trip_name,imageUri =null){
        const respond = await Trip.requestNewTrip(trip_name,imageUri)
        if(respond.status!==200)return false
        const data = respond.data
        const trip_id = data.trip_id
        const trip_data =TripDataService.getObjectReady(trip_name, trip_id,Date.now())
        await TripDataService.setTripStatus('true')

        await TripDataService.setCurrentTripData(trip_data)
        TripDataService.setTripsData(data.all_trip_data)
        return true
    }

    async requestAllTripHandler (){
        const respond = await Trip.requestTripsData()
        if(respond.status!==200)return false
        const data = respond.data
        if(data.all_trip_data){
            TripDataService.setTripsData(data.all_trip_data)
        }
        return true
    }

    async requestCurrentTripDataHandler(){
        const respond = await Trip.requestCurrentTripData()
        if (respond.status!==200) return false
        const data = respond.data
        if (data.current_trip_data){
            const trip_data = TripDataService.getObjectReady(data.current_trip_data.trip_name,data.current_trip_data.trip_id,data.current_trip_data.created_time)
            await TripDataService.setCurrentTripData(trip_data)
            if(data.current_trip_data.trip_image){
                await TripDataService.setTripImageCover(data.current_trip_data.trip_image,'aws')
            }
            await TripDataService.setTripStatus('true')
        }
        return true
    } 
    async endTripHandler(){
        const respond = await Trip.end_trip()
        if(!respond || respond.status!==200)return
        await TripDataService.deleteCurrentTripData()
        await TripDataService.setTripStatus('false')
        stop_task = await TripService.stopGPSWatch()
        console.assert(stop_task,'Task not stop')
        return true
    }   
    
}
export default new TripHandler()