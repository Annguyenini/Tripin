import GPSTask, {_registerLocationCallback}from "./gps_task"
// import GPSCallbackHandler from "./gps_callback_handler"
import * as TrackingState from './gps_states'
import * as CoordinateCal from '../coordinates/coordinates_cal'
import CurrentTripCoordinateService from '../trip_coordinates/current_trip_coordinate_service' 
import CurrentTripDataService from '../storage/current_trip'
class GPSLogic {
    constructor (){
        this.islogicRuning = false
        this.currentMode=null
        this.lastPayload = null
        _registerLocationCallback(this.callBack.bind(this))// else it will loat connection with the class
        // GPSCallbackHandler.attach(this)
    }
    // async update(new_mode){
    //     await this.startGPSLogic(new_mode)
    //     return
    // }
    async startGPSLogic(tracking_type= 'walk'){
        // cache

        if(this.currentMode === tracking_type) return 
        this.islogicRuning = true
        this.currentMode = tracking_type
        
        try{
            await GPSTask.setAccuracy(TrackingState.GPSSTATE[tracking_type].accuracy)
                .setDistance(TrackingState.GPSSTATE[tracking_type].distanceInterval)
                .setActivityType(TrackingState.GPSSTATE[tracking_type].ActivityType)
                .StartTask()
        }
        catch(err){
            console.error('Failed to start GPS logic: ',err)
            return false
        }       
        return true
}

    async endGPSLogic(){
        try{
            await GPSTask.endTask()
        }
        catch(err){
            console.error('Failed to end task: ',err)
            return false
        }
        this.islogicRuning = false
        this.currentMode = null
        return true
    }

    async callBack(payload){
        let distance 
        let mode 
        if(this.lastPayload){
            const {latitude:lat1,longitude:lng1} = this.lastPayload.coordinates
            const {latitude:lat2,longitude:lng2} = payload.coordinates
            distance = CoordinateCal.haversineDistance(lat1,lng1,lat2,lng2)
            console.log('call back distance',distance)
            this.lastPayload = payload
        }
        const {speed} = payload.coordinates
        console.log('call back speed', speed)
        if(speed < 0) return 
        else if (speed < 1){
            mode = 'stationary'
        }
        else if(1<= speed && speed <= 3){
            mode = 'walk'
        }
        else if (speed >3){
            mode = 'auto'
        }
        await this.startGPSLogic(mode)
        payload['type'] = this.currentMode
        if (distance <= 5)return

        CurrentTripCoordinateService.push(payload)
        this.lastPayload = payload
        // process new coords
        return
    }


    isAnyTask(){
        return this.islogicRuning
    }

    async syncGPSTask(){
        const trip_status = await CurrentTripDataService.getCurrentTripDataFromLocal()
        const gpsTask = await GPSTask.isTaskRunning()
        if(trip_status && ! gpsTask){
            console.warn('Trip active but task not running, restarting...')
            await this.startGPSLogic()
        }
        else if(!trip_status&& gpsTask){
            console.warn('No active trip but task is running, stopping...')
            await this.startGPSLogic()
        }
    }
    // destroy(){
    //     GPSCallbackHandler.detach(this)
    // }
    
}

export default new GPSLogic()





