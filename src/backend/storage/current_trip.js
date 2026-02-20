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

    getCurrentTripId (){ return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID) }
    getCurrentTripImageUri(){ return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE) }
    getCurrentCreatedTime(){ return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_CREATED_TIME) }
    getCurrentTripStatus(){ return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS) }
    getCurrentTripName(){ return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_NAME) }


     /** Set user data 
     * @param user_id
     * @paran trip_id
     * @param {object}trip_data - must be an object 
     */
    
    async saveCurrentTripDataToLocal (user_id, trip_id,trip_data){
        // if(!trip_data||typeof(trip_data)!=='object'){
        //     console.log('trip_data must be object')
        // }
        console.log('tripidata',trip_data)
        const key = this.getTripKeyReady(user_id,trip_id)
        await this.saveTripDataObjectToLocal(key,trip_data)
        this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA,trip_data)
        this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID, trip_id)
        this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_NAME,trip_data.trip_name)
        this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_CREATED_TIME,trip_data.created_time)
        this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS,true)
        this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STORAGE_KEY,key)
        this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE,trip_data.image)
        this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE,trip_data.image) 
        await this.setTripStatusToLocal('true')
        this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA,trip_data)
        this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID,trip_id)
        return true
    }


    async loadCurrentTripDataFromLocal(user_id,trip_id){
        const trip_data = await this.getCurrentTripDataFromLocal(user_id,trip_id)
        if(!trip_data) return false
        if(!await this.saveCurrentTripDataToLocal(user_id,trip_id,trip_data))return false
        this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE,trip_data.image)
        await this.setTripStatusToLocal('true')
        this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE,trip_data.image) 
        this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA,trip_data)
        this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID,trip_id)
        return true
    }
    /** getTripData
     * trip_data={
     *  "trip_name":trip_name,
        "trip_id":trip_id,
        "created_time":created_time
     * }
     * @returns an object of trip data or null if it empty */ 
    
    getCurrentTripData(){        
        return this.getTripDataObjectFromLocal(this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STORAGE_KEY))
    }

    async getCurrentTripDataFromLocal(user_id,trip_id){
        const key = this.getTripKeyReady(user_id,trip_id)
        return await this.getTripDataObjectFromLocal(key)
    }


    /**
     * 
     * @returns trip status 
     */
    async getTripStatusFromLocal(){
        const status = await this.getTripDataFromLocal(STORAGE_KEYS.SETTINGS.TRIP_STATUS)
        return status

    }
    /**
     * 
     * @param {string} imageUri 
     * @returns final image path inside documentDir
     */
    async setCurrentTripImageCoverToLocal(imageUri,trip_id,source='local'){
        const filename = `${trip_id}_cover.jpg`;
        const local_trip_imageuri = await this.saveTripImageToLocal(imageUri,filename,source)
        if (local_trip_imageuri){
            await this.saveTripDataToLocal(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE,local_trip_imageuri)

        }
        this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE,local_trip_imageuri)
        this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE,local_trip_imageuri) 
        return local_trip_imageuri       
    }
    /**
     * 
     * @returns trip Image uri
     */
    async getCurrentTripImageCoverUriFromLocal(){
        const image = await this.getTripDataFromLocal(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE)
        console.log('image',image)
        return image
    }

    async deleteTripImageCoverFromLocal(){
        const file_path = this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE)
        await this.deleteDataFromLocal(file_path)
        await this.deleteImageFromLocal(file_path)
    }

    async setTripStatusToLocal(status){
        /**
         * status must be string
         */
        await this.saveTripDataToLocal(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS,status)
        const value = (status ==="true"?true:false);
        this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS,value)
        this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS,value)
    }




    /**
     * delete the trip data object
     */
    async deleteCurrentTripDataFromLocal(){
        await this.deleteDataFromLocal(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA)
       
    }

    /**
     * This function will delete trip data, trip image, and set the trip status back to false
     */
    async resetCurrentTripData(){
        await this.deleteTripImageCoverFromLocal()
        await this.deleteCurrentTripDataFromLocal()
        await this.setTripStatusToLocal('false')
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


    async initCurrentCoordinatesArray (){

    }



}

export default new CurrentTripDataService()