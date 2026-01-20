import { documentDirectory } from 'expo-file-system/legacy';
import {SQLITEDBNAME} from '../../config/config_db'
import SqliteService from './sqlite/sqlite';
import * as SQLite from 'expo-sqlite';
import * as DBCONFIG from '../../config/config_db'
import TripDatabaseService from './TripDatabaseService';

class TripCoordinateDatabase {

    async create_trip(trip_id){
            const DB = await SqliteService.connectDB()
            try {
                await DB.execAsync(`
                    CREATE TABLE IF NOT EXISTS "trip_${trip_id}" (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    altitude REAL NOT NULL,
                    latitude REAL NOT NULL,
                    longitude REAL NOT NULL,
                    heading REAL NOT NULL,
                    speed REAL NOT NULL,
                    time_stamp INTEGER NOT NULL,
                    version INTEGER DEFAULT 0
                    );
                `);
            } catch (err) {
                console.error('Create table failed:', err);
            }
            console.log('created',trip_id)
        }
    
    async handlerCoordinateFromServer(data_objects,trip_id){
        const DB = await SqliteService.connectDB()
        await DB.withTransactionAsync(async()=>{
            for(const coord of data_objects){
                try{
                    await DB.runAsync(`INSERT INTO trip_${trip_id} (altitude, latitude, longitude,heading,speed,time_stamp,version) VALUES (?,?,?,?,?,?,?)`,
                        [coord.altitude,coord.latitude,coord.longitude,coord.heading,coord.speed,coord.time_stamp,coord.batch_version]
                    )
                    return true
                }
                catch(err){
                    console.error('Failed at handle coodinates from server": ',err)
                    return false
                }
            }
        })
    }
}
export default TripCoordinateDatabase