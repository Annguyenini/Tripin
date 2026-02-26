import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import CurrentTripDataService from '../storage/current_trip'
import permission from '../storage/settings/permissions';
const TASK_NAME = "background-location-task";
let _onLocationUpdate = null
export const _registerLocationCallback =(callback)=>{
    _onLocationUpdate = callback
}
TaskManager.defineTask(TASK_NAME,async ({data,error})=>{
    
    try{
        if(error){
            console.error('Failed to start GPS task at: ',error)
        }
      
    
        const {trip_id} = await CurrentTripDataService.getCurrentTripDataFromLocal()
        console.log('lala',trip_id)
        if(!trip_id){
            console.warn('No trip id')
        }
        console.log(data)
        const {locations} = data
        const location = locations[0]
        const payload = {
            time_stamp: Date.now(),
            trip_id,
            coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude,
            speed: location.coords.speed,
            heading: location.coords.heading,
            },
        };
        // 
        console.log('location: ',location)
        if(_onLocationUpdate){
            _onLocationUpdate(payload)
        }
        else{
            console.warn('there are no location callback register')
        }
        // GPSCallBack.callBack(payload)

    }
    catch(error){
        console.error('Failed to start GPS task at: ',error)
    }
}) 


class GPSTask { 
    
    constructor(){
        this.GpsTaskOption={
            showsBackgroundLocationIndicator: true, // iOS - shows blue bar
            foregroundService: { // Android
                notificationTitle: 'Trip Tracking',
                notificationBody: 'Your trip is being tracked',
            },
        }
    }
    setAccuracy(accuracy){
        if(accuracy) this.GpsTaskOption.accuracy = accuracy
        return this
    }
    setTimeInterval(time){
        if(time) this.GpsTaskOption.timeInterval = time 
        return this
    }
    setDistance(distance){
        if(distance) this.GpsTaskOption.distanceInterval = distance
        return this

    }
    setActivityType(activity_type){
        this.GpsTaskOption.activityType = activity_type
        return this

        
    }
    async StartTask(){
        console.log('task start : ', this.GpsTaskOption)
        try {
            // Check if task is already running
            const hasStarted = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
            if(await permission.getBackGroundPer() !=='true') {
                console.error('Failed  to get the back ground permission! ')
                return
            }
            if (hasStarted) {
            // console.log('Stopping existing task...');
            await Location.stopLocationUpdatesAsync(TASK_NAME);
            // Wait a bit after stopping
            await new Promise(resolve => setTimeout(resolve, 500));
            }
    
            // Check if task is registered
            const isTaskDefined = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    
            await Location.startLocationUpdatesAsync(TASK_NAME, this.GpsTaskOption);
            return true;
        } catch (e) {
        console.error('Error starting GPS task:', e);
            throw new Error ('Failed to start GPS task')
        }
    }
    async endTask(){
        console.log('end task')
        try{
            const hasStarted = await Location.hasStartedLocationUpdatesAsync(TASK_NAME)
            if(hasStarted){
                try{
                    const end = await Location.stopLocationUpdatesAsync(TASK_NAME)
                    }    
                catch(stopError){
                    console.warn('task already stop in native')
                }
            }
        }
        catch(error){
            console.error('Faild to end test: ',error)
            throw new Error ('FAILED TO END TASK')
        }
    }
    isTaskRunning(){
        return Location.hasStartedLocationUpdatesAsync(TASK_NAME);
    }
}


export default new GPSTask