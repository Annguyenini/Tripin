import { DATA_KEYS } from "./storage_keys";
import Subject from "./localStorage";

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
    async setCurrentMedias(data_object){
        for (const obs of data_object){
            if (obs.type==='video'){
                continue
            }
            this.item[DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_MEDIA].push({
                filename:obs.key,
                type:obs.media_type,
                coordinate:[obs.longitude,obs.latitude]
            })
        }
        this.notify(DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_MEDIA,this.item.get(DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_MEDIA))
        // console.log(this.item[DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_MEDIA])
    }
}
export default new TripContentsDataService()