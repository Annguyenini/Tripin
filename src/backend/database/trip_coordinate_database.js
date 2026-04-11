import { documentDirectory } from 'expo-file-system/legacy';
import { SQLITEDBNAME } from '../../config/config_db'
import SqliteService from './sqlite/sqlite';
import * as SQLite from 'expo-sqlite';
import * as DBCONFIG from '../../config/config_db'
import TripDatabaseService from './TripDatabaseService';

class TripCoordinateDatabase {

    async create_trip(trip_id) {
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
                event TEXT NOT NULL CHECK(event IN ('add', 'remove')),
                coordinate_id TEXT NOT NULL DEFAULT "empty",
                type TEXT DEFAULT NULL,
                modified_time INTEGER DEFAULT 0 NOT NULL
                );
            `);
        } catch (err) {
            console.error('Create table failed:', err);
            throw new Error('Failed to created new trip table')
        }
    }

    async handlerCoordinateFromServer(data_objects, trip_id) {
        const DB = await SqliteService.connectDB()
        await this.create_trip(trip_id)
        await DB.withTransactionAsync(async () => {
            for (const coord of data_objects) {
                try {
                    console.log(coord, trip_id)

                    await DB.runAsync(

                        `INSERT OR IGNORE INTO trip_${trip_id} (altitude, latitude, longitude, heading, speed, time_stamp, version, modified_time,event,coordinate_id) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                        [coord.altitude, coord.latitude, coord.longitude, coord.heading, coord.speed, coord.time_stamp, coord.batch_version, coord.modified_time, 'add', coord.coordinate_id]
                    )
                } catch (err) {
                    console.error('Failed at handle coodinates from server": ', err)
                    return false
                }
            }
        })
        return true
    }

    async getAllCoordinatesFromTripId(trip_id) {
        try {
            await this.create_trip(trip_id)
            const DB = await SqliteService.connectDB()
            const allRows = await DB.getAllAsync(`SELECT * FROM trip_${trip_id}`)
            return allRows
        } catch (err) {
            console.error(err)
            return null
        }
    }

    async getTripCoordinateHash(trip_id) {
        if (!trip_id) return null
        try {
            await this.create_trip(trip_id)
            const DB = await SqliteService.connectDB()
            const row = await DB.getFirstAsync(
                `SELECT COUNT(*) as count, MAX(modified_time) as max_modified FROM trip_${trip_id}`
            )
            return `${row.count}:${row.max_modified}`
        } catch (err) {
            console.error(`Failed at the get coordnatehash:`, err)
            return null
        }
    }

    async deleteCoordinateFromTripId(trip_id, coordinate_id, modified_time) {
        const DB = await SqliteService.connectDB()
        try {
            await DB.runAsync(
                `UPDATE trip_${trip_id} SET event = ?, modified_time = ? WHERE coordinate_id = ?`,
                ['remove', modified_time, coordinate_id]
            )
            return
        } catch (err) {
            console.error(err)
            return
        }
    }
}

export default TripCoordinateDatabase