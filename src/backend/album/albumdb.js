import SqliteService from '../storage/sqlite/sqlite'
import UserDataService from '../storage/user'
import LocationData from '../../app-core/local_data/local_location_data'
import timestamp from '../addition_functions/get_current_time'
import * as MediaLibrary from 'expo-media-library';
import CurrentTripDataService from '../../backend/storage/current_trip'

import * as FileSystem from'expo-file-system/legacy'

class Album {
    constuctor(){
        
    }

    async initUserAlbum(){
        const DB = await SqliteService.connectDB()
        try{
        
            await DB.execAsync(`CREATE TABLE IF NOT EXISTS "user_${UserDataService.getUserId()}"( id INTEGER PRIMARY KEY AUTOINCREMENT, media_type TEXT NOT NULL,
                 media_path TEXT NOT NULL, latitude REAL DEFAULT NULL, longitude REAL DEFAULT NULL, trip_name TEXT DEFAULT NULL, time_stamp TEXT NOT NULL);`)
        }
        catch(err){
            console.error(err)
        }
    }
    async addMediaIntoDB(media_type,media_path,time){
        const location = await LocationData.getCurrentCoor()
        const longitude = location ? location.coords.longitude : null
        const latitude = location ? location.coords.latitude : null
        const trip_name = CurrentTripDataService.getCurrentTripName()
        const DB = await SqliteService.connectDB()
        try{
            await DB.runAsync(`INSERT INTO user_${UserDataService.getUserId()} (media_type,media_path,latitude,longitude,trip_name,time_stamp) VALUES (?,?,?,?,?,?)`
                ,[media_type,media_path,latitude,longitude,trip_name,time])        
            console.log(time)
            }
        catch(err){
            console.error(err)
        }
    }
    async printDbtoconsole(){
        const DB = await SqliteService.connectDB()
        let result 
        try{
            result = await DB.getAllAsync(`SELECT * FROM user_${UserDataService.getUserId()}`)
            console.log(result)
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
            first:100
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
    // async handlerAllMediasFromAlbumn(data_array){
    //     if (!data_array) return null
    //     let result =[]
    //     for (let i =0; i< data_array.length ;i++){
    //             result.push({'id':data_array[i].id, })
    //     }
    // }
}

export default new Album 