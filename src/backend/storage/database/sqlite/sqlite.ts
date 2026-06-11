import * as SQLite from "expo-sqlite";
import { SQLITEDBNAME } from "../../../../config/config_db";
class SqliteService {
  private DB: SQLiteDatabase | null = null;
  async connectDB() {
    if (!this.DB) {
      this.DB = await SQLite.openDatabaseAsync(SQLITEDBNAME);
      await this.DB.execAsync("PRAGMA journal_mode = WAL;");
    }
    return this.DB;
  }
}

export default new SqliteService();
