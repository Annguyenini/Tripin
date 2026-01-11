import { Alert } from 'react-native'
import {STORAGE_KEYS,DATA_KEYS} from './storage_keys'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { copyAsync, deleteAsync, documentDirectory, downloadAsync }  from 'expo-file-system/legacy';
import TripLocalDataStorage from './trip_v2'
class TripDataService extends TripLocalDataStorage{
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
        this.item = {
            [DATA_KEYS.TRIP.ALL_TRIP_LIST]:[],
            set(prop,value){
                this[prop] = value
            },
            get(prop){
                return this[prop]
            }
        }
    }
    async handleAllTripsList (trips_list){
        // save detail data for each trip 
        for(const trip of trips_list){
            trip.image = await this.saveTripImageToLocal(trip.image,`${trip.id}_cover.jpg`,'aws')
            const key = this.getTripKeyReady(trip.user_id,trip.id)
            await this.saveDataObjectToLocal(key,trip)

        }
        // save array to local 
        const trip_list_to_local = await this.saveArrayToLocal(DATA_KEYS.TRIP.ALL_TRIP_LIST,trips_list)
        this.notify(DATA_KEYS.TRIP.ALL_TRIP_LIST,trips_list)

        if(!trip_list_to_local){
            return false
        }
        return true
    }


    async getTripDataFromLocal(user_id,trip_id){
        const key = this.getTripKeyReady(user_id,trip_id) 
        return await this.getDataObjectFromLocal(key)
    }

    async loadAllTripsListFromLocal(){
        const trips_list = await this.getArrayFromLocal(DATA_KEYS.TRIP.ALL_TRIP_LIST)
        if(trips_list){
            this.item.set(DATA_KEYS.TRIP.ALL_TRIP_LIST,trips_list)
            this.notify(DATA_KEYS.TRIP.ALL_TRIP_LIST,trips_list)
        }

        return true
    }
    getAllTripsList(){
        return this.item.get(DATA_KEYS.TRIP.ALL_TRIP_LIST)
    }

}


 export default new TripDataService()