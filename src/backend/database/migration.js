import SqliteService from "../database/sqlite/sqlite";
import UserDataService from "../storage/user";
export default async function migration() {
  const DB = await SqliteService.connectDB();
  let { user_version } = (await DB.getFirstAsync("PRAGMA user_version")) ?? 0;
  let user_id = UserDataService.getUserId();
  try {
    if (user_version < 1) {
      console.log("migration", 1);
      await DB.execAsync(
        `ALTER TABLE "user_${user_id}_album" ADD COLUMN city TEXT DEFAULT NULL;`,
      );
      await DB.execAsync(
        `ALTER TABLE "user_${user_id}_album" ADD COLUMN region TEXT DEFAULT NULL;`,
      );
      await DB.execAsync(
        `ALTER TABLE "user_${user_id}_album" ADD COLUMN country TEXT DEFAULT NULL;`,
      );
      await DB.execAsync(
        `ALTER TABLE "user_${user_id}_album" ADD COLUMN iso_country_code TEXT DEFAULT NULL;`,
      );
      await DB.execAsync("PRAGMA user_version = 1;");
      user_version = 1;
    }
    if (user_version < 2) {
      console.log("migration", 2);
      await DB.execAsync(
        `ALTER TABLE "trips" ADD COLUMN modified_time TEXT DEFAULT NULL`,
      );
      await DB.execAsync(
        `ALTER TABLE "trips" ADD COLUMN content_modified_time TEXT DEFAULT NULL`,
      );
      await DB.execAsync("PRAGMA user_version = 2;");
      user_version = 2;
    }
  } catch (err) {
    throw new Error(`FAILED TO UPGRADE TABLE  ${err.message}`);
  }
}
