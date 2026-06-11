import { Trip_Data } from "../../../../types/trip_data.types";
import SqliteService from "../sqlite/sqlite";

class TripDataBaseService {
  // -------------------------
  // Init
  // -------------------------

  async initTripTable() {
    const DB = await SqliteService.connectDB();
    try {
      await DB.execAsync(`
                CREATE TABLE IF NOT EXISTS trips (
                    user_id             INTEGER NOT NULL,
                    trip_id             INTEGER PRIMARY KEY,
                    trip_name           TEXT    NOT NULL,
                    image               TEXT    DEFAULT NULL,
                    created_time        TEXT    NOT NULL,
                    ended_time          TEXT    DEFAULT NULL,
                    information_version INTEGER DEFAULT 0,
                    coordinate_version  INTEGER DEFAULT 0,
                    media_version       INTEGER DEFAULT 0,
                    active              BOOLEAN DEFAULT NULL
                )
            `);
    } catch (err) {
      throw new Error(`failed to init trip table : ${err}`);
    }
  }
  // -------------------------
  // Helpers
  // -------------------------

  // -------------------------
  // Read
  // -------------------------

  async getAllUserTripDataFromDB(
    user_id: number,
  ): Promise<Array<Trip_Data> | null> {
    try {
      const DB = await SqliteService.connectDB();
      return await DB.getAllAsync(
        `SELECT * FROM trips WHERE user_id = ? ORDER BY created_time DESC`,
        [user_id],
      );
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getCurrentTripData(): Promise<Trip_Data> {
    try {
      const DB = await SqliteService.connectDB();
      const current_trip_data: Trip_Data = await DB.getFirstAsync(
        `SELECT * FROM trips WHERE active = 1`,
      );
      return current_trip_data || null;
    } catch (err) {
      return null;
    }
  }

  async getTripDataFromTripId(trip_id: number): Promise<Trip_Data> {
    try {
      const DB = await SqliteService.connectDB();
      return await DB.getFirstAsync(`SELECT * FROM trips WHERE trip_id = ?`, [
        trip_id,
      ]);
    } catch (err) {
      console.error(`Failed at getting trip: ${trip_id}:`, err);
      return null;
    }
  }

  // -------------------------
  // Write
  // -------------------------

  async addTripToDatabase(data_object: Trip_Data): Promise<boolean> {
    try {
      // console.log("trip", data_object);
      const DB = await SqliteService.connectDB();
      await DB.runAsync(
        `INSERT OR IGNORE INTO trips
                    (user_id, trip_id, trip_name, image, created_time, active,ended_time,modified_time,content_modified_time)
                 VALUES (?, ?, ?, ?, ?, ?,?,?,?)`,
        [
          data_object.user_id,
          data_object.trip_id,
          data_object.trip_name,
          data_object.image,
          data_object.created_time,
          data_object.active,
          data_object.ended_time,
          data_object.modified_time,
          data_object.content_modified_time,
        ],
      );
      return true;
    } catch (err) {
      console.error("Failed at insert new trip to database:", err);
      return false;
    }
  }

  async updateValueInDatabase(
    column_to_update,
    value_to_update,
    column_condition,
    value_condition,
  ) {
    try {
      const DB = await SqliteService.connectDB();
      await DB.runAsync(
        `UPDATE trips SET ${column_to_update} = ? WHERE ${column_condition} = ?`,
        [value_to_update, value_condition],
      );
      return true;
    } catch (err) {
      console.error("Failed to update value in trip database:", err);
      return false;
    }
  }
}

export default new TripDataBaseService();
