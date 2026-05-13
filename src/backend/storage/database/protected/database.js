import SqliteService from "../sqlite/sqlite";
class BaseDatabase {
  constructor() {
    if (new.target === BaseDatabase) {
      throw new Error("Cannot instantiate abstract class");
    }
  }

  // ── Override in subclass ──────────────────────────────
  tableName() {
    throw new Error("tableName() must be implemented");
  }

  async initTable() {
    throw new Error("initTable() must be implemented");
  }

  // ── Shared helpers ────────────────────────────────────
  async findItem(column, value) {
    try {
      const DB = await SqliteService.connectDB();
      return await DB.getFirstAsync(
        `SELECT * FROM ${this.tableName()} WHERE ${column} = ?`,
        [value],
      );
    } catch (err) {
      console.error(`Failed at findItem ${this.tableName()}:`, err);
      return null;
    }
  }

  async findItems(column, value) {
    try {
      const DB = await SqliteService.connectDB();
      return await DB.getAllAsync(
        `SELECT * FROM ${this.tableName()} WHERE ${column} = ?`,
        [value],
      );
    } catch (err) {
      console.error(`Failed at findItems ${this.tableName()}:`, err);
      return null;
    }
  }

  async updateItem(
    column_to_update,
    value_to_update,
    column_condition,
    value_condition,
  ) {
    try {
      const DB = await SqliteService.connectDB();
      await DB.runAsync(
        `UPDATE ${this.tableName()} SET ${column_to_update} = ? WHERE ${column_condition} = ?`,
        [value_to_update, value_condition],
      );
      return true;
    } catch (err) {
      console.error(`Failed at updateItem ${this.tableName()}:`, err);
      return false;
    }
  }

  async updateItems(updates, column_condition, value_condition) {
    // updates = { sync: 1, modified_time: Date.now() }
    const sets = Object.keys(updates)
      .map((k) => `${k} = ?`)
      .join(", ");
    const values = [...Object.values(updates), value_condition];
    try {
      const DB = await SqliteService.connectDB();
      await DB.runAsync(
        `UPDATE ${this.tableName()} SET ${sets} WHERE ${column_condition} = ?`,
        values,
      );
      return true;
    } catch (err) {
      console.error(`Failed at updateItems ${this.tableName()}:`, err);
      return false;
    }
  }
}

export default BaseDatabase;
