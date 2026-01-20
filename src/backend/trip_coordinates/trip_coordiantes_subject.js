class CoordinatesSubject {
    // watcher class for map box render logic
    constructor(){
        this.watchArray =[]
        this.observers =[]
    }
    attach(observer){
        if (!this.observers) this.observers =[];
        if(this.observers.find(obs => obs ===observer)) return 
        this.observers.push(observer)
    }
    detach(observer){
        this.observers = this.observers.filter(obs =>obs !==observer)
    }
    notify(){
        for(const obs of this.observers){
            obs.update(this.watchArray)
        }
    }
    initCoordinatesArray(array){
        this.watchArray = array
    }
    addCoordinateToArray(coords_object){
        if (!this.watchArray) this.watchArray =[];
        const new_object = {altitude:coords_object.coordinates.altitude,
            latitude:coords_object.coordinates.latitude,
            longitude:coords_object.coordinates.longitude,
            heading:coords_object.coordinates.heading,
            speed:coords_object.coordinates.speed,
            time_stamp:coords_object.time_stamp
        }
        console.assert(this.watchArray !== undefined,"Watch array is undefined")        
        this.watchArray.push(new_object)
        this.notify()
    }

}
export default new CoordinatesSubject()