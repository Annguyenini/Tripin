import GPSTask from "./gps_task"
import GPSCallbackHandler from "./gps_callback_handler"
import * as TrackingState from './gps_states'
export default class GPSLocgic {
    constructor (){
        this.islogicRuning = false
        this.currentMode=null
        GPSCallbackHandler.attach(this)
    }
    async update(new_mode){
        console.log('got it', new_mode)

        await this.startGPSLogic(new_mode)
        return
    }
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
    isAnyTask(){
        return this.islogicRuning
    }
    destroy(){
        GPSCallbackHandler.detach(this)
    }
    
}







