import SqliteService from "../sqlite/sqlite";
import BaseDatabase from "./database";
const GENERATE_MEDIA_ID = (media_type, id) => {
  // return `${trip_id ? `trip_${trip_id}`:''}:${media_type}:${time_stamp}`
  return `${media_type}:${id}`;
};
class TripContents extends BaseDatabase {
  constructor() {
    super();
  }
  tableName() {
    return "content_cards";
  }
  async initTable() {
    const DB = await SqliteService.connectDB();
    try {
      await DB.execAsync(`
        CREATE TABLE IF NOT EXISTS content_cards (
          id              INTEGER PRIMARY KEY AUTOINCREMENT,
          trip_id         INTEGER,
          media_type      TEXT,
          media_path      TEXT,
          time_stamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
          modified_time INTEGER DEFAULT (strftime('%s', 'now') * 1000),
          media_id        TEXT,
          uuid            TEXT NOT NULL,
          event           TEXT DEFAULT 'add',
          altitude        REAL,
          latitude        REAL,
          longitude       REAL,
          speed           REAL,
          heading         REAL,
          city            TEXT,
          region          TEXT,
          country         TEXT,
          iso_country_code TEXT,
          synced_event TEXT DEFAULT NULL
        );
      `);
    } catch (err) {
      console.error("faild to created album db", err);
    } finally {
      await DB.closeAsync();
    }
  }

  async addCardIntoDB(content_cards) {
    // const trip_id = CurrentTripDataService.getCurrentTripId();
    const DB = await SqliteService.connectDB();
    console.log("add", content_cards);
    try {
      await DB.execAsync("BEGIN");
      for (const card of content_cards) {
        await DB.runAsync(
          `INSERT INTO content_cards
            (trip_id, media_type, media_path, time_stamp, modified_time,
             media_id, uuid, event, altitude,latitude, longitude,speed,heading,
             city, region, country, iso_country_code)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            card.trip_id,
            card.media_type,
            card.media_path,
            card.time_stamp,
            card.time_stamp,
            card.media_id,
            card.uuid,
            "add",
            card.altitude,
            card.latitude,
            card.longitude,
            card.speed,
            card.heading,
            card.city,
            card.region,
            card.country,
            card.iso_country_code,
          ],
        );
      }
      await DB.execAsync(`COMMIT`);
      return;
    } catch (err) {
      console.error(err);
      await DB.execAsync(`ROLLBACK`);
      throw new Error("Failed to insert to db", err.message);
    }
  }
  async deleteCardFromDB(content_card) {
    // ghost delete in database for sync purposes
    try {
      const uuid = content_card.uuid;
      const modified_time = content_card.modified_time;
      return await this.updateItems(
        { modified_time: modified_time, event: "remove" },
        "uuid",
        uuid,
      );
    } catch (err) {
      console.error(err);
      throw new Error("Failed to delete from db");
    }
  }

  // async setSyncStatus(status, uuid) {
  //   const DB = await SqliteService.connectDB();

  //   try {
  //     await this.updateItem("synced_event", status, "uuid", uuid);
  //     return;
  //   } catch (err) {
  //     console.error(err);
  //     throw new Error("Failed to delete from db");
  //   }
  // }

  async getAssestsFromTripId(trip_id) {
    try {
      const result = await this.findItems("trip_id", trip_id);
      return result;
    } catch (err) {
      console.error("Failed to get all assets from album database: ", err);
      return null;
    }
  }
  async getTripContentsHash(trip_id) {
    try {
      const DB = await SqliteService.connectDB();
      const row = await DB.getFirstAsync(
        `SELECT COUNT(*), MAX(modified_time) FROM content_cards WHERE trip_id = ?`,
        [trip_id],
      );
      return `${row["COUNT(*)"]}:${row["MAX(modified_time)"]}`;
    } catch (err) {
      return null;
      // throw new Error('Failed to get all assets: ' + err.message)
    }
  }
  async getAllMediasFromDb() {
    const DB = await SqliteService.connectDB();
    let result;
    try {
      result = await DB.getAllAsync(
        `SELECT * FROM content_cards WHERE event = ? ORDER BY time_stamp DESC`,
        "add",
      );
      return result;
    } catch (err) {
      console.error(err);
    }
  }
  createContentCard = ({
    uuid,
    trip_id = null,
    media_type = null,
    media_path = null,
    time_stamp = Date.now(),
    media_id = null,
    event = "add",
    altitude = null,
    latitude = null,
    longitude = null,
    speed = null,
    heading = null,
    city = null,
    region = null,
    country = null,
    iso_country_code = null,
    filename = null,
    minetype = null,
  }) => ({
    uuid,
    trip_id,
    media_type,
    media_path,
    time_stamp,
    modified_time: Date.now(),
    media_id,
    event,
    altitude,
    latitude,
    longitude,
    speed,
    heading,
    city,
    region,
    country,
    iso_country_code,
    filename,
    minetype,
  });
}
const TripContentsDatabase = new TripContents();
export default TripContentsDatabase;
