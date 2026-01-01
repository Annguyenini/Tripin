

import * as SQLite from 'expo-sqlite';
import * as DBCONFIG from '../../config/config_db'
import TripData from '../../app-core/local_data/local_trip_data';
import * as Location from 'expo-location'

import TripContentsHandler from '../../app-core/flow/trip_contents_handler';
class TripDataStorage{

    constructor(){

        this.storage = []
    }

    async initDB(){
        this.db = await SQLite.openDatabaseAsync(DBCONFIG.BASE_SQLITE3_BASE_FILE_NAME);
        await this.db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS trips (trip_id INTEGER PRIMARY KEY NOT NULL, trip_name NOT NULL, created_time INTEGER NOT NULL, ended_time INTERGER NOT NULL DEFAULT 0);

`);
        await this.db.execAsync("COMMIT")
    }

    async init_new_trip(){
        this.trip_name = TripData.trip_name
        this.trip_id = TripData.trip_id
        this.created_time = TripData.created_time
        await this.db.execAsync(`INSERT INTO trips (trip_id,trip_name,created_time) VALUES (${this.trip_id},${this.trip_name},${this.created_time})`)    
        await this.db.execAsync`CREATE TABLE IF NOT EXISTS ${this.trip_name} (time_stamp INTEGER PRIMARY KEY,altitude TEXT NOT NULL, latitude TEXT NOT NULL, longitude TEXT NOT NULL, heading TEXT NOT NULL,speed TEXT NOT NULL);`
        await this.db.execAsync("COMMIT")

    }


    async insert_into_DB(){
        this.db.execAsync(`BEGIN`)
       
        for(item of this.storage){
            await this.db.execAsync(`INSERT INTO ${this.trip_name} (time_stamp, altitude, latitude, longitude,heading,speed) VALUES (${item.time_stamp},${item.data.altitude},${item.data.latitude},${item.data.longtitude},${item.data.heading},${item.data.speed} )`)
        }
        this.db.execAsync("COMMIT")
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
        if(this.storage.length >=5){
           
            const send_coor = await TripContentsHandler.sendCoordinatesHandler(this.storage)
            // const request_con = await Trip.request_location_conditions()
            this.storage.length = 0
        }

    }

    delete(key){
        this.map.delete(key);
    }
    
    clear(){
        this.map.clear();
    }



}



const trip_storage = new TripDataStorage()
export default trip_storage