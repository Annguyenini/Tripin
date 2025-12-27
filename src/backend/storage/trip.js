import { Alert } from 'react-native'
import {STORAGE_KEYS,DATA_KEYS} from './storage_keys'
import * as SecureStore from 'expo-secure-store'
import { copyAsync, deleteAsync, documentDirectory, downloadAsync }  from 'expo-file-system/legacy';
class TripDataService{
    /**
     * trip data service, use to store trip_name...
     * struct of data object {
     * "trip_name":trip_name,
            "trip_id":trip_id,
            "created_time":created_time
     * }
     * @returns
     */
    constructor(){
        //since this object can keep track of 2 states
        this.observers = {}
        this.item = {
            [DATA_KEYS.TRIP.TRIP_DATA]:null,
            [DATA_KEYS.TRIP.TRIP_STATUS]: null,
            [DATA_KEYS.TRIP.TRIP_STATUS]: null,
            [DATA_KEYS.TRIP.ALL_TRIP]:[],

            set(prop,value){
                this[prop] = value
            },
            get(prop){
                return this[prop]
            }
        }
    }


    attach (observer,key){
        // console.log("attach", observer,"with key", key)
        if (!Object.values(DATA_KEYS.TRIP).includes(key)){
            console.warn('Key not allow')
            return
        }
        if (!this.observers[key]){
            this.observers[key] = []
        }
        this.observers[key].push(observer)

    }

    detach(observer,key){
        if (!Object.values(DATA_KEYS.TRIP).includes(key)){
            console.warn('Key not allow')
            return
        }
        this.observers[key] = this.observers[key].filter(obs => obs !== observer)

    }

    notify(item){
        // console.log("notifing","observers",this.observers[item],"value",this.item.get(item) )
        if (!this.observers[item]){
            // console.log("return")
            return;}
        this.observers[item].forEach(obs => {
            // console.log("object",obs,"update",this.item.get(item))
            obs.update(this.item.get(item))
        });
    }


    /** Set user data 
     * @param {object}Tripdata - must be an object 
    */
    async setCurrentTripData (tripdata){
        
        
        if(!tripdata||typeof(tripdata)!=='object'){
        }
        try{
            await SecureStore.setItemAsync(STORAGE_KEYS.TRIPDATA,JSON.stringify(tripdata))
        }
        catch(secureStoreError){
            console.error`Error at set key ${STORAGE_KEYS.TRIPDATA} ${secureStoreError}`
        }
        this.item.set(DATA_KEYS.TRIP.TRIP_DATA,tripdata)
        this.notify(DATA_KEYS.TRIP.TRIP_DATA)
    }
    /** getTripData
     * trip_data={
     *  "trip_name":trip_name,
        "trip_id":trip_id,
        "created_time":created_time
     * }
     * @returns an object of trip data or null if it empty */ 
    async getCurrentTripData(){
        try{
            const tripdata = await SecureStore.getItemAsync(STORAGE_KEYS.TRIPDATA)
            if(tripdata){
                return JSON.parse(tripdata)
            }
            else{
                return null
            }
        }
        catch(secureStoreError){
            console.error`Error at getting${STORAGE_KEYS.TRIPDATA} ${secureStoreError}`
            return null
        }
    }

    setTripsData(tripsList){
        try{
            this.item.set(DATA_KEYS.TRIP.ALL_TRIP,tripsList)
            this.notify(DATA_KEYS.TRIP.ALL_TRIP)
            
        }
        catch(err){
            console.error(err)
        }
    }
    getTripsData(){
        try{
            const trip_data =this.item.get(DATA_KEYS.TRIP.ALL_TRIP)
            return trip_data
        }
        catch(err){
            console.error(err)
            return null
        }
    }

    async setTripStatus(status){
        /**
         * status must be string
         */
        // console.log("set calling with value",status)

        if(typeof(status) !== 'string'){
            console.alert("Status must be string due to rule of Secure Store")
            return 
        }
        try{
            await SecureStore.setItemAsync(STORAGE_KEYS.SETTINGS.TRIP_STATUS,status)
        }
        catch(secureStoreError){
            console.error(`ERROR at set trip status ${secureStoreError}`)
        }

        const value = status ==="true"?true:false;
        this.item.set(DATA_KEYS.TRIP.TRIP_STATUS,value)
        this.notify(DATA_KEYS.TRIP.TRIP_STATUS)
    }
    /**
     * 
     * @returns trip status 
     */
    async getTripStatus(){
        try{
            const status = await SecureStore.getItemAsync(STORAGE_KEYS.SETTINGS.TRIP_STATUS)
            return status
        }
        catch(secureStoreError){
            console.error(`ERROR at get trip status ${secureStoreError}`)
        }
    }

    /**
     * 
     * @param {string} imageUri 
     * @returns final image path inside documentDir
     */
    async setTripImageCover(imageUri,source='local'){
        try {
            const trip_id = this.item.get(DATA_KEYS.TRIP.TRIP_DATA).trip_id
            const filename = `${trip_id}_cover.jpg`;
            const destination = documentDirectory + filename;
            if (source !=='local'){
                console.log('callwed')
                const result = await downloadAsync(imageUri,destination)
                console.log(result)
            } 
            else{
                await copyAsync({
                from: imageUri,      // source URI (camera / image picker)
                to: destination,     // app private folder
                });
            }

            console.log('Image saved at:', destination);
            await SecureStore.setItemAsync(STORAGE_KEYS.TRIP_IMAGE,destination)
            this.item.set(DATA_KEYS.TRIP.TRIP_IMAGE,destination)
            this.notify(DATA_KEYS.TRIP.TRIP_IMAGE)
            return destination;
        } 
        catch (err) {
            console.error('Failed to save image:', err);
    }

    }
    /**
     * 
     * @returns trip Image uri
     */
    async getTripImageCover(){
        try{
            const imageUri = await SecureStore.getItemAsync(STORAGE_KEYS.TRIP_IMAGE)
            if(!imageUri){
                return null
            }
            return imageUri
        }
        catch(secureStoreError){
            console.error(secureStoreError)
        }
    }

    /**
     * delete the trip image
     */
    async deleteTripImageCover(){
        try{
            await SecureStore.deleteItemAsync(STORAGE_KEYS.TRIP_IMAGE) 
        }
        catch(secureStoreError){
            console.error('fail to delete key',secureStoreError)
        }
        try{
            const path = this.item.get(DATA_KEYS.TRIP.TRIP_IMAGE)
            console.log(path)
            await deleteAsync(path)
        }
        catch(err){
            console.error('failed to delete trip image',err)
        }
    }

    /**
     * delete the trip data object
     */
    async deleteCurrentTripData(){
        try{ 
            await SecureStore.deleteItemAsync(STORAGE_KEYS.TRIPDATA)

        }
        catch(secureStoreError){
            console.error(`Error at deleting ${STORAGE_KEYS.TRIPDATA}`)
        }
       
    }

    /**
     * This function will delete trip data, trip image, and set the trip status back to false
     */
    async resetCurrentTripData(){
        await this.deleteCurrentTripData()
        await this.deleteTripImageCover()
        await this.setTripStatus('false')
    }

    getObjectReady(trip_name, trip_id, created_time){
        const tripdata ={
            "trip_name":trip_name,
            "trip_id":trip_id,
            "created_time":created_time
        }
        return tripdata
    }

    

}

const trip = new TripDataService()
export default trip