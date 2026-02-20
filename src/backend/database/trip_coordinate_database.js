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
                    altitude REAL NOT NULL,
                    latitude REAL NOT NULL,
                    longitude REAL NOT NULL,
                    heading REAL NOT NULL,
                    speed REAL NOT NULL,
                    time_stamp INTEGER PRIMARY KEY,
                    version INTEGER DEFAULT 0,
                    type TEXT DEFAULT NULL
                    );
                `);
            } catch (err) {
                console.error('Create table failed:', err);
            }
        }
    
    async handlerCoordinateFromServer(data_objects,trip_id){
        console.log('handler',data_objects,trip_id)

        const DB = await SqliteService.connectDB()
        await DB.execAsync(`DROP TABLE IF EXISTS trip_${trip_id}`)
        await this.create_trip(trip_id)
        await DB.withTransactionAsync(async()=>{
            for(const coord of data_objects){
                console.log('insert')
                try{
                    await DB.runAsync(`INSERT OR IGNORE INTO trip_${trip_id} (altitude, latitude, longitude,heading,speed,time_stamp,version) VALUES (?,?,?,?,?,?,?)`,
                        [coord.altitude,coord.latitude,coord.longitude,coord.heading,coord.speed,coord.time_stamp,coord.batch_version]
                    )
                }
                catch(err){
                    console.error('Failed at handle coodinates from server": ',err)
                    return false
                }
            }

        })
        return true

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
}
export default TripCoordinateDatabase
