import SqliteService from './sqlite/sqlite'
import UserDataService from '../storage/user'

const VERSION_TYPES = {
    COORDINATE: 'coordinate_version',
    MEDIA: 'media_version',
    INFORMATION: 'information_version',
}

class TripDataBaseService {

    // -------------------------
    // Init
    // -------------------------

    async initTripTable() {
        const DB = await SqliteService.connectDB()
        try {
            await DB.execAsync(`
                CREATE TABLE IF NOT EXISTS trips (
                    user_id             INTEGER NOT NULL,
                    trip_id             INTEGER PRIMARY KEY,
                    trip_name           TEXT    NOT NULL,
                    image               TEXT    DEFAULT NULL,
                    created_time        TEXT    NOT NULL,
                    end_time            TEXT    DEFAULT NULL,
                    information_version INTEGER DEFAULT 0,
                    coordinate_version  INTEGER DEFAULT 0,
                    media_version       INTEGER DEFAULT 0,
                    active              BOOLEAN DEFAULT NULL
                )
            `)
        } catch (err) {
            console.error('Failed to create trips database', err)
        } finally {
            await DB.closeAsync()
        }
    }

    // -------------------------
    // Helpers
    // -------------------------

   

    // -------------------------
    // Read
    // -------------------------

    async getAllTrip() {
        try {
            const DB = await SqliteService.connectDB()
            return await DB.getAllAsync(`SELECT * FROM trips`)
        } catch (err) {
            console.error(err)
            return null
        }
    }

    async getAllUserTripDataFromDB(user_id) {
        try {
            const DB = await SqliteService.connectDB()
            return await DB.getAllAsync(
                `SELECT * FROM trips WHERE user_id = ? ORDER BY created_time DESC`,
                [user_id]
            )
        } catch (err) {
            console.error(err)
            return null
        }
    }

    async getCurrentTripData(){
        try{
            const DB = await SqliteService.connectDB()
            const current_trip_data = await DB.getFirstAsync(`SELECT * FROM trips WHERE active = 1`)
            return current_trip_data||null
        }
        catch(err){
            return null
        }
    }

    async getTripDataFromTripId(trip_id) {
        try {
            const DB = await SqliteService.connectDB()
            return await DB.getFirstAsync(
                `SELECT * FROM trips WHERE trip_id = ?`,
                [trip_id]
            )
        } catch (err) {
            console.error(`Failed at getting trip: ${trip_id}:`, err)
            return null
        }
    }

    async getVersion(version_type, trip_id) {
        if (!trip_id) return null
        try {
            const DB = await SqliteService.connectDB()
            const version = await DB.getFirstAsync(
                `SELECT ${version_type} FROM trips WHERE trip_id = ?`,
                [trip_id]
            )
            return version?.[version_type] ?? null
        } catch (err) {
            console.error(`Failed at the get version ${version_type}:`, err)
            return null
        }
    }

    async getTripCoordinateVersion(trip_id) {
        return this.getVersion(VERSION_TYPES.COORDINATE, trip_id)
    }

    async getTripMediaVersion(trip_id) {
        return this.getVersion(VERSION_TYPES.MEDIA, trip_id)
    }

    async getTripInfomationVersion(trip_id) {
        return this.getVersion(VERSION_TYPES.INFORMATION, trip_id)
    }

    // -------------------------
    // Write
    // -------------------------

    async addTripToDatabase(data_object) {
        try {
            const DB = await SqliteService.connectDB()
            await DB.runAsync(
                `INSERT OR IGNORE INTO trips
                    (user_id, trip_id, trip_name, image, created_time, active)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    data_object.user_id,
                    data_object.trip_id,
                    data_object.trip_name,
                    data_object.image,
                    data_object.created_time,
                    data_object.active,
                ]
            )
            return true
        } catch (err) {
            console.error('Failed at insert new trip to database:', err)
            return false
        }
    }

    async updateValueInDatabase(column_to_update, value_to_update, column_condition, value_condition) {
        try {
            const DB = await SqliteService.connectDB()
            await DB.runAsync(
                `UPDATE trips SET ${column_to_update} = ? WHERE ${column_condition} = ?`,
                [value_to_update, value_condition]
            )
            return true
        } catch (err) {
            console.error('Failed to update value in trip database:', err)
            return false
        }
    }

    async updateTripCorrdinateVersion(trip_id, new_version) {
        return this.updateValueInDatabase(VERSION_TYPES.COORDINATE, new_version, 'trip_id', trip_id)
    }

    async updateTripMediaVersion(trip_id, new_version) {
        return this.updateValueInDatabase(VERSION_TYPES.MEDIA, new_version, 'trip_id', trip_id)
    }

    async updateTripInformationVersion(trip_id, new_version) {
        return this.updateValueInDatabase(VERSION_TYPES.INFORMATION, new_version, 'trip_id', trip_id)
    }
}

export default new TripDataBaseService()