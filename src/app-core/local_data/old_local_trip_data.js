import LocalData from './local_data'
import TripDataService from '../../backend/storage/old_trip'
import { DATA_KEYS } from '../../backend/storage/storage_keys';
class LocalTripData extends LocalData{
    constructor(){
        super()
        this.trip_name = null;
        this.trip_id = null;
        this.created_time = null;
        this.initialize()
        TripDataService.attach(this,DATA_KEYS.TRIP.TRIP_DATA)
    }   

    async initialize (){
        const trip_data = await TripDataService.getCurrentTripData()
        if (!trip_data) return
        this.trip_name = trip_data.trip_name
        this.trip_id = trip_data.trip_id
        this.created_time = trip_data.created_time
    }

    update(new_trip_data_object){
        if(!new_trip_data_object){
            this.trip_name = null
            this.trip_id = null
            this.created_time = null
            return
        }
        this.trip_name = new_trip_data_object.trip_name
        this.trip_id = new_trip_data_object.trip_id
        this.created_time = new_trip_data_object.created_time
    }

    destroy(){
        TripDataService.detach(this,DATA_KEYS.TRIP.TRIP_DATA)
    }
}
const TripData = new LocalTripData()
export default TripData 