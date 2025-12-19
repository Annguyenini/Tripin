import {STORAGE_KEYS} from './storage_keys'
import * as SecureStore from 'expo-secure-store'

export class TripDataService{
    /**
     * trip data service, use to store trip_name...
     * struct of data object {
     * "trip_name":trip_name,
            "trip_id":trip_id,
            "created_time":created_time
     * }
     * @returns
     */
    static instance
    constructor(){
        if (TripDataService.instance){
            return TripDataService.instance
        }
        TripDataService.instance = this
    }


    /** Set user data 
     * @param {object}Tripdata - must be an object 
    */
    async setTripData (tripdata){
        
        
        if(!tripdata||typeof(tripdata)!=='object'){
        }
        try{
            await SecureStore.setItemAsync(STORAGE_KEYS.TRIPDATA,JSON.stringify(tripdata))
        }
        catch(secureStoreError){
            console.error`Error at set key ${STORAGE_KEYS.TRIPDATA} ${secureStoreError}`
        }
        
    }
    /** getTripData
     * @returns an object of trip data or null if it empty */ 
    async getTripData(){
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
    async setTripStatus(status){
        try{
            await SecureStore.setItemAsync(STORAGE_KEYS.SETTINGS.TRIP_STATUS,status)
        }
        catch(secureStoreError){
            console.error(`ERROR at set trip status ${secureStoreError}`)
        }
    }

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
     */
    async deleteTripData(){
        try{
            await SecureStore.deleteItemAsync(STORAGE_KEYS.TRIPDATA)
        }
        catch(secureStoreError){
            console.error(`Error at deleting ${STORAGE_KEYS.TRIPDATA}`)
        }
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