

import * as SQLite from 'expo-sqlite';
import * as DBCONFIG from '../../config/config_db'
import { TripDataService } from '../userdatas/trip';
export class TripDataStorage{
    constructor(){
        if (TripDataStorage.instance) return TripDataStorage.instance;
        TripDataStorage.instance = this;
        this.storage = []
        this.trip_service= new TripDataService()
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
        const trip_data = this.trip_service.getTripData()
        this.trip_name = trip_data.trip_name
        this.trip_id = trip_data.trip_id
        this.created_time = trip_data.created_time
        await this.db.execAsync(`INSERT INTO trips (trip_id,trip_name,created_time) VALUES (${this.trip_id},${this.trip_name},${this.created_time})`)    
        await this.db.execAsync`CREATE TABLE IF NOT EXISTS ${this.trip_name} (time_stamp INTEGER PRIMARY KEY,altitude TEXT NOT NULL, latitude TEXT NOT NULL, longtitude TEXT NOT NULL, heading TEXT NOT NULL);`
        await this.db.execAsync("COMMIT")

    }


    async insert_into_DB(){
        this.db.execAsync(`BEGIN`)
       
        for(item of this.storage){
            await this.db.execAsync(`INSERT INTO ${this.trip_name} (time_stamp, altitude, latitude, longtitude,heading) VALUES (${item.time_stamp},${item.data.altitude},${item.data.latitude},${item.data.longtitude},${item.data.heading} )`)
        }
        this.db.execAsync("COMMIT")
    }



    /**
     * 
     * @param {*} time - timestamp of an object
     * @param {*} trip_data_object - the object it self
     */
    async push (trip_data_object){
        console.assert(typeof(trip_data_object)==='object', 'trip data must be an object')
        this.storage.push(trip_data_object);
        if(this.storage.size >=20){
            await this.insert_into_DB()

            /// IMPORTANT need to implement store data to sql
            ///maybe implement buffer 
            /// send to server
            this.storage.clear()
        }

    }

    delete(key){
        this.map.delete(key);
    }
    
    clear(){
        this.map.clear();
    }



}



