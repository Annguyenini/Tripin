import LocalStorage from "../../../backend/storage/base/localStorage";
/**
 * Observer class use to keep track of current display trip
 */
class TripDisplayObserver extends(LocalStorage){
    constructor(){
        super()
        this.tripState ={
            IS_SELECTED:null,
            IS_CURRENT_TRIP:null,
            TRIP_DATA:null,
            TRIP_ID:null
        }
        
        this.EVENTS = 'trip_display'    
    }
    /**
     * set the next trip states, it will notify the subcribers
     * @param {*} is_selected 
     * @param {*} is_current_trip 
     * @param {*} trip_data 
     * @param {*} trip_id 
     */
    setTripState(is_selected,is_current_trip,trip_data,trip_id){
        this.tripState.IS_SELECTED =is_selected
        this.tripState.IS_CURRENT_TRIP = is_current_trip
        this.tripState.TRIP_DATA =trip_data
        this.tripState.TRIP_ID =trip_id
        this.notify(this.EVENTS,this.tripState)
    }
    

}
/**
 * instance of TripDisplayObserver
 */
export default new  TripDisplayObserver()