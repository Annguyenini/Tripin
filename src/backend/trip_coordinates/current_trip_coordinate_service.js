

import * as SQLite from 'expo-sqlite';
import * as DBCONFIG from '../../config/config_db'
import CurrentTripDataService from '../storage/current_trip'
import * as Location from 'expo-location'
import SqliteService from '../database/sqlite/sqlite';
import TripContentsHandler from '../../app-core/flow/trip_contents_handler';
import CoordinatesSubject from './trip_coordiantes_subject'
import TripCoordinateDatabase from '../database/trip_coordinate_database';
import TripDatabase from '../database/TripDatabaseService'
class CurrentTripCoordinateService extends TripCoordinateDatabase{
// storing trip coordinate to db

    constructor(){
        super()
        this.storage = []
    }

    async init_new_trip(){
        return await this.create_trip(CurrentTripDataService.getCurrentTripId())
    }
    async insert_into_DB(temp_storage){
        const DB = await SqliteService.connectDB()

        const current_version = await TripDatabase.getTripCoordinateVersion(CurrentTripDataService.getCurrentTripId())+1 
        await DB.withTransactionAsync(async()=>{
            
        for(const item of temp_storage){

            try{
                await DB.runAsync(`INSERT INTO trip_${CurrentTripDataService.getCurrentTripId()} (altitude, latitude, longitude,heading,speed,time_stamp,version) VALUES (?,?,?,?,?,?,?)`,[item.coordinates.altitude,item.coordinates.latitude,
                    item.coordinates.longitude,item.coordinates.heading,item.coordinates.speed,item.time_stamp,current_version])
                }
                catch(err){
                    console.error(err)
                }
        } 
        })
        return current_version
    }
 

    async getAllCoordinatesFromTripId(trip_id){
        const DB = await SqliteService.connectDB()
        try{
            const allRows = await DB.getAllAsync(`SELECT * FROM trip_${trip_id};`)
            return allRows
        }
        catch(err){
            console.error (err)
        }
    }

    /**
     * 
     * @param {*} time - timestamp of an object
     * @param {*} trip_data_object - the object it self
     */
    async push (trip_data_object = null){
        if (trip_data_object === null){
            const temp = await Location.getCurrentPositionAsync()
            const payload = {
                time_stamp: Date.now(),
                coordinates: {
                latitude: temp.coords.latitude,
                longitude: temp.coords.longitude,
                altitude: temp.coords.altitude,
                speed: temp.coords.speed,
                heading: temp.coords.heading,
                },
            };
            trip_data_object = payload
        }

        console.assert(typeof(trip_data_object)==='object', 'trip data must be an object')
        console.assert(this.storage,"storage undefined")
        this.storage.push(trip_data_object);
        CoordinatesSubject.addCoordinateToArray(trip_data_object)
        if(this.storage.length >=2){
            //using an temp 
            const temp_storage = [...this.storage] 
            this.storage.length = 0

            const version =  await this.insert_into_DB(temp_storage)
            
            await TripDatabase.updateTripCorrdinateVersion(CurrentTripDataService.getCurrentTripId(),version)
            
            const send_coor = await TripContentsHandler.sendCoordinatesHandler(temp_storage,version)
            // const request_con = await Trip.request_location_conditions()
        }

    }

   

}



const trip_storage = new CurrentTripCoordinateService()
export default trip_storage