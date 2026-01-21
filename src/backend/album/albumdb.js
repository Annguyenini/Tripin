import SqliteService from '../database/sqlite/sqlite'
import UserDataService from '../storage/user'
import LocationData from '../../app-core/local_data/local_location_data'
import timestamp from '../addition_functions/get_current_time'
import * as MediaLibrary from 'expo-media-library';
import CurrentTripDataService from '../../backend/storage/current_trip'

import * as FileSystem from'expo-file-system/legacy'
import TripDatabase from '../database/TripDatabaseService'

class Album {
    constructor(){
        this.AlbumsArray =[]
        this.observers =[]
    }
    attach(observer){
        console.log('attach',observer)
        if(this.observers.find(obs => obs ===observer)) return 
        this.observers.push(observer)
    }
    detach(observer){
        console.log('dettach')
        this.observers = this.observers.filter(obs =>obs !==observer)
    }
    notify(){
        console.log('notify',this.observers)
        for(const obs of this.observers){
            obs.update(this.AlbumsArray)
        }
    }

    addToAlbumArray(object){
        // console.log(this.AlbumsArray)
        // if(typeof(object)!=='object'){
        //     console.error('Failed to add into Album array ')
        //     return
        // }
        try{
            console.log('is array frozen at add ',Object.isFrozen(this.AlbumsArray))
            this.AlbumsArray.unshift(object)
        }
        catch(err){
            console.error('Failed to add into Album array ',err)
        }
            this.notify()
    }

    async getAlbumAssetObjectReady(media_asset_object){
        if(typeof(media_asset_object) != 'object') {
            console.error('media_assest must be object')
            return null
        }
        const location = await LocationData.getCurrentCoor()
        const longitude = location ? location.coords.longitude : null
        const latitude = location ? location.coords.latitude : null
        const trip_name = CurrentTripDataService.getCurrentTripName()
        media_asset_object['longitude'] =longitude
        media_asset_object['latitude']=latitude
        media_asset_object['trip_name']=trip_name
        return media_asset_object
    }

    async initUserAlbum(){
        const DB = await SqliteService.connectDB()
        try{
            await DB.execAsync(`CREATE TABLE IF NOT EXISTS "user_${UserDataService.getUserId()}_album"( id INTEGER PRIMARY KEY AUTOINCREMENT, media_type TEXT NOT NULL,
                 media_path TEXT NOT NULL, 
                 latitude REAL DEFAULT NULL, 
                 longitude REAL DEFAULT NULL, 
                 trip_id INTEGER DEFAULT NULL,
                 trip_name TEXT DEFAULT NULL, 
                 time_stamp TEXT NOT NULL,
                 version INTEGER DEFAULT 0);`)
        }
        catch(err){
            console.error(err)
        }
        const mergedData = await this.getMergedMediasArray()
        this.AlbumsArray = [...mergedData] 
        console.log('is array frozen ',Object.isFrozen(this.AlbumsArray))
    }
    async addMediaIntoDB(media_type,media_path,time){
        const location = await LocationData.getCurrentCoor()
        const longitude = location ? location.coords.longitude : null
        const latitude = location ? location.coords.latitude : null
        const trip_id = CurrentTripDataService.getCurrentTripId()
        const trip_name = CurrentTripDataService.getCurrentTripName()
        const current_version = await TripDatabase.getTripMediaVersion(trip_id)
        const DB = await SqliteService.connectDB()
        try{
            await DB.runAsync(`INSERT INTO user_${UserDataService.getUserId()}_album (media_type,media_path,latitude,longitude,trip_id,trip_name,time_stamp,version) VALUES (?,?,?,?,?,?,?,?)`
                ,[media_type,media_path,latitude,longitude,trip_id,trip_name,time,current_version+1])        
            
            await TripDatabase.updateTripMediaVersion(trip_id,current_version+1)
            return current_version
        }
        catch(err){
            console.error(err)
            throw new Error('Failed to insert to db')
        }
    }
    async getAssestsFromTripId(trip_id){
        try{
            const DB = await SqliteService.connectDB()
            const result = await DB.getAllAsync(`SELECT * FROM user_${UserDataService.getUserId()}_album WHERE trip_id = ?`,[trip_id])
            return result
        }
        catch(err){
            console.error('Failed to get all assets from album database: ',err)
            return null
        }
    }
    async getAllMediasFromDb(){
        const DB = await SqliteService.connectDB()
        let result 
        try{
            result = await DB.getAllAsync(`SELECT * FROM user_${UserDataService.getUserId()}_album`)
            return result
        }
        catch(err){
            console.error(err)
        }
    }
    async getAllMediasFromAlbumn(media_type = null){
        // return an array of assets
        const album = await MediaLibrary.getAlbumAsync('Tripin_album') 
        const options = {
            album : album,
            sortBy : [MediaLibrary.SortBy.creationTime],
            first:100,
            mediaType:['video','photo']
            
        }
        if (media_type){
            options ['mediaType'] = media_type
        }
        let result =[]
        try{
            const assets = await MediaLibrary.getAssetsAsync(options)
            return assets.assets
        }
        catch(err){
            console.error('Error at getting asset from album',err)
        }
    }
    async mergeMediasFromAlbumAndDB(db_array,album_array){
        let hash_map ={}
        for(const object of album_array){
            hash_map[object.uri]=object
        }
        for(const object of db_array){
            if(hash_map[object.media_path]){
                hash_map[object.media_path]['latitude'] = object.latitude
                hash_map[object.media_path]['longitude'] = object.longitude
                hash_map[object.media_path]['trip_name']=object.trip_name
            }
        }
        return([...Object.values(hash_map)])
    }

    async getMergedMediasArray(){
        const db_medias = await this.getAllMediasFromDb()
        const album_medias = await this.getAllMediasFromAlbumn()
        const result = await this.mergeMediasFromAlbumAndDB(db_medias,album_medias)
        return result
    }
    // async handlerAllMediasFromAlbumn(data_array){
    //     if (!data_array) return null
    //     let result =[]
    //     for (let i =0; i< data_array.length ;i++){
    //             result.push({'id':data_array[i].id, })
    //     }
    // }
}
const Albumdb = new Album()
export default Albumdb