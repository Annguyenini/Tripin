import { Alert } from 'react-native'
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
        
        //since this object can keep track of 2 states
        this.observers = {}
        this.item = {
            trip_object:null,
            status: null,
            set(prop,value){
                this[prop] = value
            },
            get(prop){
                return this[prop]
            }
        }
        this.allowance_key = ['trip_object','status']
    }


    attach (observer,item){
        // console.log("attach", observer,"with item", item)
        const itemi = this.allowance_key.find(i=>i === item)
        if (!itemi){
            Alert.alert("invalid item")
            return
        }
        if (!this.observers[item]){
            this.observers[item] = []
        }
        this.observers[item].push(observer)

    }

    detach(observer,item){
        const itemi = this.allowance_key.find(i=>i === item)

        if(!itemi){
            Alert.alert("invalid item")
            return 
        }
        this.observers[item] = this.observers[item].filter(obs => obs !== observer)

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
    async setTripData (tripdata){
        
        
        if(!tripdata||typeof(tripdata)!=='object'){
        }
        try{
            await SecureStore.setItemAsync(STORAGE_KEYS.TRIPDATA,JSON.stringify(tripdata))
        }
        catch(secureStoreError){
            console.error`Error at set key ${STORAGE_KEYS.TRIPDATA} ${secureStoreError}`
        }
        this.item.set("trip_object",tripdata)
        this.notify("trip_object")
    }
    /** getTripData
     * trip_data={
     *  "trip_name":trip_name,
        "trip_id":trip_id,
        "created_time":created_time
     * }
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
        this.item.set('status',value)
        this.notify('status')
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