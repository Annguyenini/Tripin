import LocalStorage from "../../../backend/storage/base/localStorage";
class CurrentDisplayCoordinateObserver extends(LocalStorage){
    constructor(){
        super()
        this.CoordsArray ={}
    }
    GENERATE_KEY(trip_id){
        return `coords_array:${trip_id}`
    }
    setDefaultCoordsArray(trip_id, coords_array){
        console.log('set default',coords_array)
        if(!this.CoordsArray[trip_id]){
            this.CoordsArray[trip_id]=coords_array
        }
        this.notify(this.GENERATE_KEY(trip_id),coords_array)
    }
    getCoordArray(trip_id){
        return this.CoordsArray[trip_id]
    }
    addCoorddinateToArray(trip_id,coords_object){
        console.log('before',this.CoordsArray[trip_id])
        if(!this.CoordsArray[trip_id]){
            this.CoordsArray[trip_id] = []
        }
        const new_object = {altitude:coords_object.coordinates.altitude,
            latitude:coords_object.coordinates.latitude,
            longitude:coords_object.coordinates.longitude,
            heading:coords_object.coordinates.heading,
            speed:coords_object.coordinates.speed,
            time_stamp:coords_object.time_stamp
        }
        this.CoordsArray[trip_id].push(new_object)
        console.log('after',this.CoordsArray[trip_id])
        this.notify(this.GENERATE_KEY(trip_id),this.CoordsArray[trip_id])
    }
}
export default new CurrentDisplayCoordinateObserver()