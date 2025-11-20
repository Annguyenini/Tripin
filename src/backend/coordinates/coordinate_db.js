import * as SQLite from 'expo-sqlite';
import * as DBConfig from'../../config/config_db.js'
class CoordinatesDB{
    constructor(){
        if(CoordinatesDB.instance) return CoordinatesDB.instance;
        CoordinatesDB.instance = this;
    }

    openConnection(trip_id){
       this.DB = SQLite.openDatabaseAsync(DBConfig.BASE_SQLITE3_BASE_FILE_NAME+trip_id+'.db');  
    }

    initTripFile(trip_id){
        this.DB.transaction(tx =>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS trip_id (time TEXT PRIMARY KEY, latitude REAL, longtitude REAL, heading REAL, speed REAL;')
            tx.executeSql('PRAGMA journal_mode = WAL;')
        })
        
    }
    insertToDB(datas){
        this.DB.transaction(tx=>{})
    }

}