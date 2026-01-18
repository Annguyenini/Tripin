

import * as SQLite from 'expo-sqlite';
import * as DBCONFIG from '../../config/config_db'
import CurrentTripDataService from '../storage/current_trip'
import * as Location from 'expo-location'
import SqliteService from '../storage/sqlite/sqlite';
import TripContentsHandler from '../../app-core/flow/trip_contents_handler';
import { documentDirectory } from 'expo-file-system/legacy';
import {SQLITEDBNAME} from '../../config/config_db'
import CoordinatesSubject from '../../backend/trip/trip_coordiantes_subject'
class CurrentTripCoordinateService {

    constructor(){
        this.storage = []
    }

    async init_new_trip(){

        const DB = await SqliteService.connectDB()
        try {
            await DB.execAsync(`
                CREATE TABLE IF NOT EXISTS "trip_${CurrentTripDataService.getCurrentTripId()}" (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                altitude REAL NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                heading REAL NOT NULL,
                speed REAL NOT NULL,
                time_stamp TEXT NOT NULL,
                version INTEGER DEFAULT 0
                );
            `);
            await DB.execAsync(`PRAGMA user_version = 0;`)
        } catch (err) {
            console.error('Create table failed:', err);
        }
        console.log('created')
    }


    async insert_into_DB(){
        const DB = await SqliteService.connectDB()

        let current_version
        await DB.withTransactionAsync(async()=>{
            const result = await DB.getFirstAsync(`PRAGMA user_version;`)
            current_version = (result.user_version ?? 0) +1
        for(const item of this.storage){

            try{
                await DB.runAsync(`INSERT INTO trip_${CurrentTripDataService.getCurrentTripId()} (altitude, latitude, longitude,heading,speed,time_stamp,version) VALUES (?,?,?,?,?,?,?)`,[item.coordinates.altitude,item.coordinates.latitude,
                    item.coordinates.longitude,item.coordinates.heading,item.coordinates.speed,item.time_stamp,current_version])
                }
                catch(err){
                    console.error(err)
                }
        } 
        DB.execAsync(`PRAGMA user_version = ${current_version};`)
        })
        console.log('curernt version ',current_version)
        return current_version
    }


    async getAllCoordinatesFromTripId(trip_id){
        const DB = await SqliteService.connectDB()
        try{
            const allRows = await DB.getAllAsync(`SELECT * FROM trip_${trip_id}`)
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
        this.storage.push(trip_data_object);
        CoordinatesSubject.addCoordinateToArray(trip_data_object)
        if(this.storage.length >=5){
            const version =  await this.insert_into_DB()
            const send_coor = await TripContentsHandler.sendCoordinatesHandler(this.storage,version)
            // const request_con = await Trip.request_location_conditions()
            this.storage.length = 0
        }

    }

   

}



const trip_storage = new CurrentTripCoordinateService()
export default trip_storage