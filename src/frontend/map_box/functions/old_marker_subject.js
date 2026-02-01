import LocalStorage from "../../../backend/storage/base/localStorage"
import CurrentTripDataService from'../../../backend/storage/current_trip'
class MarkerSubject extends(LocalStorage){
    constructor(){
        super()
        this.currentMarkerTrip = null
        this.EVENTS ={
            TRIP_ID:'trip_id'
        }
    }
    
   
    setTripId(trip_id){
        this.currentMarkerTrip = trip_id
        this.notify(this.EVENTS.TRIP_ID,trip_id)
        return
    }
    getTripId(){
        return this.currentMarkerTrip
    }
    setTripIdDefault(){
        this.currentMarkerTrip = CurrentTripDataService.getCurrentTripId()
        this.notify(this.EVENTS.TRIP_ID,CurrentTripDataService.getCurrentTripId())
        return
    }
}
export default new MarkerSubject()