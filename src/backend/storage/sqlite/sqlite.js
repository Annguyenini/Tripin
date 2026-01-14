import * as SQLite from 'expo-sqlite';
import {SQLITEDBNAME} from '../../../config/config_db'
class SqliteService {
    constructor(){
    }
    async connectDB(){
        const DB = await SQLite.openDatabaseAsync(SQLITEDBNAME)
        DB.execAsync('PRAGMA journal_mode = WAL;')
        return DB
    }    
}


export default new SqliteService()