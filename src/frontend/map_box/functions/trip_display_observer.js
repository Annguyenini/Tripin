import LocalStorage from "../../../backend/storage/base/localStorage";
import CurrentTripDataService from '../../../backend/storage/current_trip'
import { DATA_KEYS } from "../../../backend/storage/keys/storage_keys";
/**
 * Observer class use to keep track of current display trip
 */
class TripDisplayObserver extends(LocalStorage){
    constructor(){
        super()
        this.SeletecedTripData =null
        this.CurrentActiveTripData =CurrentTripDataService.getCurrentTripId()
        this.EVENTS = 'trip_display'  
        CurrentTripDataService.attach(this,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA)  
    }
  /**
   * set the selected trip
   * @param {*} trip_data_object 
   */
    setTripSelected(trip_data_object){
        this.SeletecedTripData = trip_data_object
        this.notify(this.EVENTS,this.getTripNeedRender())
    }
    /**
     * delete the selected trip, then notify the current active trip if exist
     * @returns 
     */
    deleteTripSelected(){
        this.SeletecedTripData =null
        if(this.CurrentActiveTripData){
            this.notify(this.EVENTS,this.getTripNeedRender())
        }        
        return
    }
    /**
     * decide which trip need to be render
     * @returns 
     */
    getTripNeedRender(){

        let trip_render
        if(this.SeletecedTripData){
            trip_render = this.SeletecedTripData
        }
        else if(this.CurrentActiveTripData){
            trip_render =this.CurrentActiveTripData
        }
        else {
            trip_render =null
        }
        return trip_render
    }
    /**
     * call back for any change in the current trip
     */
    update(newTripData){
        this.CurrentActiveTripData =newTripData
        this.notify(this.EVENTS,this.getTripNeedRender())
    }
    
    destroy(){
        CurrentTripDataService.detach(this,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA)
    }
}
/**
 * instance of TripDisplayObserver
 */
export default new  TripDisplayObserver()