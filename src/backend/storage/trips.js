import { Alert } from 'react-native'
import {STORAGE_KEYS,DATA_KEYS} from './keys/storage_keys'
import TripDatabaseService from '../database/TripDatabaseService'
import TripLocalDataStorage from './base/trip_base'
import UserDataService from '../../backend/storage/user'
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
    }/**
     * function use to handle all trips from user
     * @param {*} trips_list 
     * @returns 
     */
    async handleAllTripsList (trips_list,local=false){
        let status =true
        // save detail data for each trip 
        // we use batch so we can update to ui by 10
        let batches = []
        console.log('triplist',trips_list)
        for(const trip of trips_list){
            // generate key for each trip 
            // const key = this.getTripKeyReady(trip.user_id,trip.id)
            // store image if exist
            if(trip.image && !local){
                // console.log(trip.image)
                trip.image = await this.saveTripImageToLocal(trip.image,`${trip.id}_cover.jpg`,'aws')
            }
            // save to async storage
            // status = await this.saveDataObjectToLocal(key,trip)
            // add to bd
            status = await TripDatabaseService.addTripToDatabase(trip)
            batches.push(trip)
            if(batches.length  % 10 ===0){
                this.notify(DATA_KEYS.TRIP.ALL_TRIP_LIST,batches)
            }
        }
        // save array to local 
        // status = await this.saveArrayToLocal(DATA_KEYS.TRIP.ALL_TRIP_LIST,trips_list)
        this.item.set(DATA_KEYS.TRIP.ALL_TRIP_LIST,batches)
        this.notify(DATA_KEYS.TRIP.ALL_TRIP_LIST,batches)

        return status
    }


    async getTripDataFromLocal(user_id,trip_id){
        const trip_data = await TripDatabaseService.getTripDataFromTripId(trip_id)
        if (trip_data.user_id !== user_id) return null
        return trip_data
    }
    async saveTripDataToLocal(data){
        const status = await TripDatabaseService.addTripToDatabase(data)
        return status

    }
    async loadAllTripsListFromLocal(){
        const user_id = UserDataService.getUserId()
        const trips_list = await TripDatabaseService.getAllUserTripDataFromDB(user_id) 
        // const trips_list = await this.getArrayFromLocal(DATA_KEYS.TRIP.ALL_TRIP_LIST)
        console.log('trip list ', trips_list,user_id)
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