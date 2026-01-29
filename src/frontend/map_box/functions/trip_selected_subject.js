import LocalStorage from "../../../backend/storage/base/localStorage";

class TripSelectedSubject extends(LocalStorage){
    constructor(){
        super()
        this.EVENTS={
            IS_SELECTED:'is_selected',
            TRIP_ID :'trip_id',
            TRIP_DATA:'trip_data'
        }
        this.items ={
            [this.EVENTS.IS_SELECTED] : null,
            [this.EVENTS.TRIP_ID] : null,
            [this.EVENTS.TRIP_DATA]:{},
            get(item){
                return this[item]
            },
            set(item,value){
                this[item] = value
            }
        }
    }
    set(key,value){
        console.log('set',key,value)
        this.items.set(key,value)
        this.notify(key,value)
    }
    get(key){
        return this.items.get(key)
    }
    

}
export default new TripSelectedSubject()