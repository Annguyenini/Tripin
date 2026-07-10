import SqliteService from "../sqlite/sqlite";
import BaseDatabase from "./database";
import UserDataService from "../../async_storage/user";
type EventTypes = "content_add" | "content_remove";
class EventsSync extends BaseDatabase {
  tableName(): string {
    return `events_sync_${UserDataService.getUserId()}`;
  }
  async initTable() {
    const DB = await SqliteService.connectDB();
    try {
      await DB.execAsync(`
        CREATE TABLE IF NOT EXISTS ${this.tableName()} (
          id              INTEGER PRIMARY KEY AUTOINCREMENT,
          event           TEXT,
          data            TEXT,
          update_at       INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
          is_sync         BOOLEAN DEFAULT false,
        );
      `);
    } catch (err) {
      throw new Error("fail to create trip contents table ", err);
    }
  }
  async insertIntoDatabase(event: EventTypes, data: any) {
    try {
      const DB = await SqliteService.connectDB();
      const blobed_data = JSON.stringify(data);
      await DB.runAsync(
        `
        INSERT OR IGNORE INTO events_sync_${UserDataService.getUserId()}(event,data) VALUES (?,?)`,
        [event, blobed_data],
      );
    } catch (err) {
      throw new Error("fail to insert into event table ", err);
    }
  }

  async getUnsyncedEvents(event: EventTypes) {
    try {
      const DB = await SqliteService.connectDB();
      const result = await DB.getAllAsync(
        `SELECT * FROM ${this.tableName()} WHERE event =? AND is_sync = ?`,
        [event, false],
      );
      return result;
    } catch (err) {
      console.error(`Failed to get events: ${err}`);
      return null;
    }
  }

  async getEvents(event: EventTypes) {
    try {
      const result = await this.findItems("event", event);
      return result;
    } catch (err) {
      console.error(`Failed to get events: ${err}`);
      return null;
    }
  }
}
export default new EventsSync();
