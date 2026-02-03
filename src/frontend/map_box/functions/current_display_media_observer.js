import LocalStorage from "../../../backend/storage/base/localStorage";
class CurrentDisplayTripMediaObserver extends(LocalStorage) {
    // watcher class for map box render logic
    constructor(){
        super()
        this.watchArray ={}
    }
    GENERATE_KEY(trip_id){
        return `media_array:${trip_id}`
    }
    setDefaultArray(trip_id,data_array){
        if(!this.watchArray[trip_id]){
            this.watchArray[trip_id] =[]
        }
        this.watchArray[trip_id] = data_array
        this.notify(this.GENERATE_KEY(trip_id),data_object)
        return
    }
    addAssetIntoArray(trip_id,data_object){
        if(!this.watchArray[trip_id]){
            this.watchArray[trip_id] = []
        }
        this.watchArray[trip_id].push(data_object)
        this.notify(this.GENERATE_KEY(trip_id),data_object)
    }

   
    
}
export default new CurrentDisplayTripMediaObserver()