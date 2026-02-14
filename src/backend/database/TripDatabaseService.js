import SqliteService from './sqlite/sqlite'
import UserDataService from '../storage/user'
class TripDataBaseService{
    constructor(){}
/**
 * init trip table
 */
    async initTripTable(){
        console.log('reset')
        try{
            const DB = await SqliteService.connectDB()
            await DB.execAsync(`CREATE TABLE IF NOT EXISTS trips
            (user_id INTEGER NOT NULL,
            trip_id INTEGER PRIMARY KEY,
            trip_name TEXT NOT NULL,
            image TEXT DEFAULT NULL,
            created_time TEXT NOT NULL,
            end_time TEXT DEFAULT NULL,
            infomation_version INTEGER DEFAULT 0,
            coordinate_version INTEGER DEFAULT 0,
            media_version INTEGER DEFAULT 0)`)
            }
        catch(err){
            console.error('Failed to create trips database',err)
        }
        }
        /**
         * 
         * @param {*} user_id 
         * @param {*} trip_id 
         * @param {*} trip_name 
         * @param {*} image_path 
         * @returns trip object for insert 
         */
    getObjectReady(user_id,trip_id,trip_name,image_path=null){
        return ({
            user_id:user_id,
            trip_id:trip_id,
            trip_name:trip_name,
            created_time:Date.now(),
            image:image_path
        })

    }
    async getAllTrip (){
        try{
            const DB = await SqliteService.connectDB()
            const data =await DB.getAllAsync(`SELECT * FROM trips`)
            console.log( data)  
        }
        catch(err){
            console.error(err)
            return null
        }
    }
    async getAllUserTripDataFromDB (user_id){
        try{
            const DB = await SqliteService.connectDB()
            const data =await DB.getAllAsync(`SELECT * FROM trips WHERE user_id = ? `,(user_id))
            return data  
        }
        catch(err){
            console.error(err)
            return null
        }
    }
    /**
     * insert into table
     * @param {*} data_object 
     * @returns status
     */
    async addTripToDatabase(data_object){
        // console.log('INSERT VALUES:', {
        // user_id: data_object.user_id,
        // trip_id: data_object.trip_id,
        // trip_name: data_object.trip_name,
        // image: data_object.image,
        // created_time: data_object.created_time
        // });        
        try{
            const DB = await SqliteService.connectDB()
            await DB.runAsync(`INSERT OR IGNORE INTO trips (user_id,trip_id,trip_name,
                image,created_time) VALUES (?,?,?,?,?)`,[data_object.user_id,data_object.trip_id,
                data_object.trip_name, data_object.image,data_object.created_time])
                return true
            }

            catch(err){
                console.error('Failed at insert new trip to database: ',err)
                return false
            }
    }
/**
 * update the table base on requirements
 * @param {*} column_to_update 
 * @param {*} value_to_update 
 * @param {*} column_condition 
 * @param {*} value_condition 
 * @returns status
 */
    async updateValueInDatabase(column_to_update,value_to_update,column_condition,value_condition){
        try{
            const DB = await SqliteService.connectDB()
            await DB.runAsync(`UPDATE trips SET ${column_to_update} = ? WHERE ${column_condition} = ?`,[value_to_update,value_condition])
            return true
        }
        catch(err){
            console.error('Failed to update value in trip database: ',err)
            return false
        }
    }
    /**
     * get the trip data object base on the provieded trip id
     * @param {*} trip_id 
     * @returns 
     */
    async getTripDataFromTripId(trip_id){
        try{
            const DB = await SqliteService.connectDB()
            const result = await DB.getFirstAsync(`SELECT *  FROM trips WHERE trip_id = ?`,(trip_id))
            return result
        }
        catch(err){
            console.error(`Failed at getting trip: ${trip_id}: `,err)
            return null
        } 
    }
    /**
     * get version base on version type
     * @param {*} version_type 
     * @param {*} trip_id 
     * @returns 
     */
    async getVersion(version_type,trip_id){
        try{
            console.log('version',version_type,trip_id)
            const DB = await SqliteService.connectDB()
            const version = await DB.getFirstAsync(`SELECT ${version_type} FROM trips WHERE trip_id =?`,[trip_id])
            console.log(version)
            return version[version_type]
        }
        catch(err){
            console.error(`Failed at the get version ${version_type}: `,err)
            return null
        }
    }
    /**
     * get coordiante version base on trip id 
     * @param {*} trip_id 
     * @returns 
     */
    async getTripCoordinateVersion(trip_id){
        return await this.getVersion('coordinate_version',trip_id)
    }
     /**
      * get media version based on trip id 
      * @param {*} trip_id 
      * @returns 
      */
    async getTripMediaVersion(trip_id){
        return await this.getVersion('media_version',trip_id)
    }

    /**
     * get information version base on trip id
     * @param {*} trip_id 
     * @returns 
     */
    async getTripInfomationVersion(trip_id){
        return await this.getVersion('information_version',trip_id)
    }
    /**
     * update coordinate version base on trip id
     * @param {*} trip_id 
     * @param {*} new_version 
     * @returns 
     */
    async updateTripCorrdinateVersion(trip_id,new_version){
        console.log('new version ',new_version)
        return await this.updateValueInDatabase('coordinate_version',new_version,'trip_id',trip_id)
    }
    /**
     * update media version base on trip id 
     * @param {*} trip_id 
     * @param {*} new_version 
     * @returns 
     */
    async updateTripMediaVersion(trip_id,new_version){
        console.log('update version',trip_id,new_version)
        return await this.updateValueInDatabase('media_version',new_version,'trip_id',trip_id)
    }
  
}
export default new TripDataBaseService()
