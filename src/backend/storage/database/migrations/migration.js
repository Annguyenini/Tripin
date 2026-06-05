import SqliteService from "../sqlite/sqlite";
import UserDataService from "../../async_storage/user";
export default async function migration() {
  const DB = await SqliteService.connectDB();
  let { user_version } = (await DB.getFirstAsync("PRAGMA user_version")) ?? 0;

  let user_id = UserDataService.getUserId();
  try {
    if (user_version < 1) {
      // console.log("migration", 1);
      // await DB.execAsync(
      //   `ALTER TABLE "user_${user_id}_album" ADD COLUMN city TEXT DEFAULT NULL;`,
      // );
      // await DB.execAsync(
      //   `ALTER TABLE "user_${user_id}_album" ADD COLUMN region TEXT DEFAULT NULL;`,
      // );
      // await DB.execAsync(
      //   `ALTER TABLE "user_${user_id}_album" ADD COLUMN country TEXT DEFAULT NULL;`,
      // );
      // await DB.execAsync(
      //   `ALTER TABLE "user_${user_id}_album" ADD COLUMN iso_country_code TEXT DEFAULT NULL;`,
      // );
      await DB.execAsync("PRAGMA user_version = 1;");
      user_version = 1;
    }
    if (user_version < 2) {
      // console.log("migration", 2);
      await DB.execAsync(
        `ALTER TABLE "trips" ADD COLUMN modified_time TEXT DEFAULT NULL`,
      );
      await DB.execAsync(
        `ALTER TABLE "trips" ADD COLUMN content_modified_time TEXT DEFAULT NULL`,
      );
      await DB.execAsync("PRAGMA user_version = 2;");
      user_version = 2;
    }
    if (user_version < 3) {
      // console.log("migration", 3);
      await DB.execAsync(
        `ALTER TABLE "trips" ADD COLUMN event TEXT DEFAULT 'add'`,
      );
      await DB.execAsync("PRAGMA user_version = 3;");
      user_version = 3;
    }
    if (user_version < 4) {
      try {
        await DB.execAsync(`
          CREATE TABLE trips_new (
            user_id                  INTEGER NOT NULL,
            trip_id                  INTEGER PRIMARY KEY,
            trip_name                TEXT    NOT NULL,
            image                    TEXT    DEFAULT NULL,
            created_time             INTEGER NOT NULL,
            ended_time               INTEGER DEFAULT NULL,
            active                   BOOLEAN DEFAULT NULL,
            modified_time            INTEGER DEFAULT NULL,
            content_modified_time    INTEGER DEFAULT NULL,
            event                    TEXT    DEFAULT 'add'
          )
        `);
        await DB.execAsync(`
          INSERT INTO trips_new
          SELECT
            user_id, trip_id, trip_name, image,
            CAST(created_time AS INTEGER),
            CAST(ended_time AS INTEGER),
            active,
            CAST(modified_time AS INTEGER),
            CAST(content_modified_time AS INTEGER),
            event
          FROM trips
        `);
        await DB.execAsync(`DROP TABLE trips`);
        await DB.execAsync(`ALTER TABLE trips_new RENAME TO trips`);
        await DB.execAsync(`PRAGMA user_version = 4`);
        user_version = 4;
      } catch (err) {
        throw new Error(
          `failed to migrate database step ${user_version}+1: ${err}`,
        );
      }
    }

    if (user_version < 5) {
      try {
        await DB.execAsync(`
          CREATE TABLE content_cards_new (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            trip_id          INTEGER,
            media_type       TEXT,
            media_path       TEXT,
            time_stamp       INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
            modified_time    INTEGER DEFAULT (strftime('%s', 'now') * 1000),
            media_id         TEXT UNIQUE,
            uuid             TEXT NOT NULL,
            event            TEXT DEFAULT 'add',
            altitude         REAL,
            latitude         REAL,
            longitude        REAL,
            speed            REAL,
            heading          REAL,
            city             TEXT,
            region           TEXT,
            country          TEXT,
            iso_country_code TEXT,
            synced_event     TEXT DEFAULT NULL
          )
        `);
        await DB.execAsync(`
          INSERT INTO content_cards_new
          SELECT
            id, trip_id, media_type, media_path, time_stamp, modified_time,
            media_id, uuid, event, altitude, latitude, longitude, speed, heading,
            city, region, country, iso_country_code, synced_event
          FROM content_cards
          WHERE id IN (
            SELECT MAX(id) FROM content_cards GROUP BY media_id
          )
        `);
        await DB.execAsync(`DROP TABLE content_cards`);
        await DB.execAsync(
          `ALTER TABLE content_cards_new RENAME TO content_cards`,
        );
        await DB.execAsync(`PRAGMA user_version = 5`);
        user_version = 5;
      } catch (err) {
        throw new Error(`Fail to update table content_cards: ${err}`);
      }
    }
    console.log("finish migration");
  } catch (err) {
    throw new Error(`FAILED TO UPGRADE TABLE  ${(user_version, err.message)}`);
  }
}
