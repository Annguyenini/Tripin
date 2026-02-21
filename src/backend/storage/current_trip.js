import { Alert } from 'react-native'
import {STORAGE_KEYS,DATA_KEYS} from './keys/storage_keys'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { copyAsync, deleteAsync, documentDirectory, downloadAsync }  from 'expo-file-system/legacy';
import TripLocalDataStorage from './base/trip_base'
class CurrentTripDataService extends TripLocalDataStorage{
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
        super()

        this._init_values()
    }

    _init_values(){
        this.item = {
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA]:null,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID]:null,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_NAME]:null,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE]: null,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_CREATED_TIME]:null,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS]:false,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STORAGE_KEY]:null,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_COORDINATES_ARRAY]:[],
            set(prop,value){
                this[prop] = value
            },
            get(prop){
                return this[prop]
            }
        }
    }
    
// =====================GET==============
    getCurrentTripId (){ return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID) }
    getCurrentTripImageUri(){ return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE) }
    getCurrentCreatedTime(){ return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_CREATED_TIME) }
    getCurrentTripStatus(){ return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS) }
    getCurrentTripName(){ return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_NAME) }

    /** getTripData
     * trip_data={
     *  "trip_name":trip_name,
        "trip_id":trip_id,
        "created_time":created_time
     * }
     * @returns an object of trip data or null if it empty */ 
    

    async getCurrentTripDataFromLocal(){
        return await this.getTripDataObjectFromLocal(STORAGE_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA)
    }

    // ==========================================================

     /** Set user data 
     * @paran trip_id
     * @param {object}trip_data - must be an object 
     */
    
    async saveCurrentTripDataToLocal (trip_data){

        if(!trip_data||typeof(trip_data)!=='object'||Array.isArray(trip_data)){
            console.log('trip_data must be object')
        }
        console.log('trip data',trip_data)
        try{        
            await this.saveTripDataObjectToLocal(STORAGE_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA,trip_data)
        
            this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA,trip_data)
            this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID, trip_data.trip_id)
            this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_NAME,trip_data.trip_name)
            this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_CREATED_TIME,trip_data.created_time)
            this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS,true)
            this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE,trip_data.image)
            this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE,trip_data.image) 
            this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA,trip_data)
            this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID,trip_data.trip_id)
            return true
        }
        catch(err){
            console.error('Failed at save current trip data tp local',err)
            throw new Error ('Failed at save current trip data tp local',err)
            return false
        }
    }


    async loadCurrentTripDataFromLocal(){
        try{
            const trip_data = await this.getCurrentTripDataFromLocal()
            if(!trip_data) return false
            if(!await this.saveCurrentTripDataToLocal(trip_data))return false
            return true
    
        }
        catch(err){
            console.error('Failed at loading stored current trip data')
        }
    }
    /**
     * 
     * @param {string} imageUri 
     * @returns final image path inside documentDir
     */
    async setCurrentTripImageCoverToLocal(imageUri,trip_id,source='local'){
        try{        
            const filename = `${trip_id}_cover.jpg`;
            const local_trip_imageuri = await this.saveTripImageToLocal(imageUri,filename,source)
            // if (local_trip_imageuri){
            //     await this.saveTripDataToLocal(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE,local_trip_imageuri)

            // }
            const current_trip_data = await this.getCurrentTripDataFromLocal()
            if(current_trip_data){
                current_trip_data.image = local_trip_imageuri
                await this.saveCurrentTripDataToLocal(current_trip_data)
            }
            return local_trip_imageuri
        }
        catch(err){
            console.error('Failed to set trip image',err)
            throw new Error ('Failed to set trip image',err)
        }       
    }
   

    async setTripStatusToLocal(status){
        /**
         * status must be string
         */
        try{
            await this.saveTripDataToLocal(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS,status)
            const value = (status ==="true"?true:false);
            this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS,value)
            this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS,value)
        }
        catch(err){
            throw new Error('Failed to set current trip status')
        }
    }


    async deleteTripImageCoverFromLocal(){
        try{
            const file_path = this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE)
            await this.deleteDataFromLocal(file_path)
            await this.deleteImageFromLocal(file_path)

        }
        catch(err){
            console.error('Failed at delete trip image',err)
        }
    }

    /**
     * delete the trip data object
     */
    async deleteCurrentTripDataFromLocal(){
        try{
            await this.deleteDataFromLocal(STORAGE_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA)
        }
        catch(err){
            console.error('Failed at delete current trip data',err)
        }
    }

    /**
     * This function will delete trip data, trip image, and set the trip status back to false
     */
    async resetCurrentTripData(){
        try{
            await this.deleteTripImageCoverFromLocal()
            await this.deleteCurrentTripDataFromLocal()
            await this.setTripStatusToLocal('false')
        }
        catch(err){
            console.error('Failed at reset current trip data', err)
        }
        this._init_values()
        this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA,null)
    }


    getObjectReady(trip_name, trip_id, created_time,image_uri){
        const tripdata ={
            "trip_name":trip_name,
            "trip_id":trip_id,
            "created_time":created_time,
            'image':image_uri
        }
        return tripdata
    }
    generateCurrentTripIdKey(user_id){
        return `user_${user_id}:current_trip_id`
    }



}

export default new CurrentTripDataService()