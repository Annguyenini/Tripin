
class TripAlbumSubject {
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
    initAlbumArray(array){
        this.watchArray = array
    }
    addAssetIntoArray(data_object){
        this.watchArray.push(data_object)
        this.notify()
    }

    
    
}
export default new TripAlbumSubject()