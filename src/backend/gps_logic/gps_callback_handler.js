
import * as CoordinateCal from '../coordinates/coordinates_cal'
import CurrentTripCoordinateService from '../trip_coordinates/current_trip_coordinate_service' 
class GPSCallbackHandler{
    constructor(){
        this.lastPayload = null
        this.observers =[]
        this.currentMode =null
    }
    attach(observer){
        console.log('Instance ID check:', this)
        console.log('Observers before:', this.observers.length)
        this.observers.push(observer)
        console.log('Observers after:', this.observers.length)
    }

    notify(newMode){
        console.log('Instance ID check:', this)
        console.log('Observers count:', this.observers.length)
        for(const obs of this.observers){
            obs.update(newMode)
        }
    }
    detach(observer){
        this.observers = this.observers.filter( obs=> obs !== observer)
    }
    
    callBack(payload){
        if(this.lastPayload){
            const {latitude:lat1,longitude:lng1} = this.lastPayload.coordinates
            const {latitude:lat2,longitude:lng2} = payload.coordinates
            const distance = CoordinateCal.haversineDistance(lat1,lng1,lat2,lng2)
            console.log('call back distance',distance)
            this.lastPayload = payload
            if (distance <= 5)return
        }
        const {speed} = payload.coordinates
        console.log('call back speed', speed)
        if(speed < 0) return 
        else if(speed <= 3){
            this.currentMode = 'walk'
            this.notify('walk')
        }
        else if (speed >3){
            this.currentMode = 'auto'
            this.notify('auto')
        }
        payload['type'] = this.currentMode
        CurrentTripCoordinateService.push(payload)
        this.lastPayload = payload
        // process new coords
        return
    }
    
}
export default new GPSCallbackHandler()