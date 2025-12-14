import * as SQLite from 'expo-sqlite';
import * as TRIPCONFIG from '../../config/config_db'
export class TripService{
    constructor(){
        if (TripService.instance){
            return TripService.instance
            TripService.instance =this
        }
        this.db = SQLite.openDatabaseAsync(TRIPCONFIG.SQLITE3_TRIPS_DB_DIRECTORY)
    }
    create_new_trip_local_db(trip_name){

    }

    
}