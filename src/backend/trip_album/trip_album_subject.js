
class TripAlbumSubject {
    // watcher class for map box render logic
    constructor(){
        this.watchArray =[]
        this.observers =[]
    }
    attach(observer){
        console.log('attach111')
        if (!this.observers) this.observers =[];
        if(this.observers.find(obs => obs ===observer)) return 
        this.observers.push(observer)
    }
    detach(observer){
        console.log('detach111')
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
        console.log('add',data_object)
        this.watchArray.push(data_object)
        this.notify()
    }

}
export default new TripAlbumSubject()