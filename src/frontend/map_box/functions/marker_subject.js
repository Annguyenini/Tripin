class MarkerSubject{
    constructor(){
        this.observers =[]
        this.currentMarkerTrip = null
    }
    attach(observer){
        this.observers.push(observer)
    }
    dettach(observer){
        this.observers = this.observers.filter(obs => obs !==observer)
    }
    notify(newItem){
        if(this.observers.length <=0) return
        for(const obs of this.observers){
            obs.update(newItem)
        }
    }
    setTripId(trip_id){
        this.currentMarkerTrip = trip_id
        this.notify(trip_id)
    }
}
export default new MarkerSubject()