import { DATA_KEYS } from "./storage_keys";
import Subject from "./subject";

class TripContentsDataService extends Subject{
    constructor(){
        super()
        this.item={
            [DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_COORDINATES] : [],
            [DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_MEDIA] :[],
            get(prop){
                return this[prop]
            },
            set(prop,value){
                this[prop] =value
            },
        }
    }

    async SetCurrentCoordinates(data_object){
        for (const obs of data_object){
            this.item[DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_COORDINATES].push([obs.longitude,obs.latitude])
        }
        this.notify(DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_COORDINATES,this.item.get(DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_COORDINATES))
    }
}
export default new TripContentsDataService()