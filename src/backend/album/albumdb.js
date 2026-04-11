import SqliteService from '../database/sqlite/sqlite'
import UserDataService from '../storage/user'
import LocationData from '../../app-core/local_data/local_location_data'
import timestamp from '../addition_functions/get_current_time'
import * as MediaLibrary from 'expo-media-library';
import CurrentTripDataService from '../../backend/storage/current_trip'
import * as MediaPermission from './album_permission'
import * as FileSystem from 'expo-file-system/legacy'
import TripDatabase from '../database/TripDatabaseService'
import { RectButton } from 'react-native-gesture-handler';
const GENERATE_MEDIA_ID = (media_type, id) => {
    // return `${trip_id ? `trip_${trip_id}`:''}:${media_type}:${time_stamp}`
    return `${media_type}:${id}`

}
class Album {
    constructor() {
        this.AlbumsArray = []
        this.observers = []
    }
    attach(observer) {
        if (this.observers.find(obs => obs === observer)) return
        this.observers.push(observer)
    }
    detach(observer) {
        this.observers = this.observers.filter(obs => obs !== observer)
    }
    notify() {
        for (const obs of this.observers) {
            obs.update(this.AlbumsArray)
        }
    }

    addToAlbumArray(object) {
        // if(typeof(object)!=='object'){
        //     console.error('Failed to add into Album array ')
        //     return
        // }
        try {

            this.AlbumsArray = [object, ...this.AlbumsArray]
        }
        catch (err) {
            console.error('Failed to add into Album array ', err)
            throw new Error('Error at add to watch')
        }
        this.notify()
    }
    deleteFromAlbumArray(media_id) {
        try {
            this.AlbumsArray = this.AlbumsArray.filter(item => {
                return item.media_id !== media_id
            })
        } catch (err) {
            console.error('Failed to delete from Album array ', err)
            throw new Error('Error at delete from Album')
        }
        this.notify()
    }
    getAlbumAssetObjectReady(Uri, media_id, media_type, latitude, longitude, coordinate_id) {

        const trip_name = CurrentTripDataService.getCurrentTripName()
        const trip_id = CurrentTripDataService.getCurrentTripId()
        let media_asset_object = {}
        media_asset_object['longitude'] = longitude
        media_asset_object['latitude'] = latitude
        media_asset_object['trip_name'] = trip_name
        media_asset_object['trip_id'] = trip_id
        media_asset_object['media_path'] = Uri
        media_asset_object['media_type'] = media_type
        media_asset_object['media_id'] = media_id
        media_asset_object['coordinate_id'] = coordinate_id
        media_asset_object['event'] = 'add'
        return media_asset_object
    }

    async initUserAlbum() {
        const DB = await SqliteService.connectDB()
        try {
            // await DB.execAsync(`DROP TABLE IF EXISTS "user_${UserDataService.getUserId()}_album";`)
            await DB.execAsync(`
                CREATE TABLE IF NOT EXISTS 
                "user_${UserDataService.getUserId()}_album"( 
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                media_type TEXT NOT NULL,
                media_path TEXT NOT NULL, 
                latitude REAL DEFAULT NULL, 
                longitude REAL DEFAULT NULL, 
                trip_id INTEGER DEFAULT NULL,
                trip_name TEXT DEFAULT NULL, 
                time_stamp TEXT NOT NULL,
                version INTEGER DEFAULT 0,
                media_id TEXT NOT NULL,
                coordinate_id TEXT NOT NULL,
                event TEXT NOT NULL DEFAULT 'add',
                modified_time TEXT NOT NULL
                );`)
        }
        catch (err) {
            console.error('faild to created album db', err)
        }
        finally {
            await DB.closeAsync()
            const mergedData = await this.getMergedMediasArray()
            this.AlbumsArray = [...mergedData]
        }

    }
    async addMediaIntoDB(media_type, media_path, time, media_id, longitude, latitude, coordinate_id) {

        const trip_id = CurrentTripDataService.getCurrentTripId()
        const trip_name = CurrentTripDataService.getCurrentTripName()
        // const current_version = await TripDatabase.getTripMediaVersion(trip_id)
        const DB = await SqliteService.connectDB()
        try {
            await this.initUserAlbum()
            await DB.runAsync(`

                INSERT INTO user_${UserDataService.getUserId()}_album 
            (media_type,
            media_path,
            latitude,
            longitude,
            trip_id,
            trip_name,
            time_stamp,
            modified_time,
            media_id,
            coordinate_id,
            event) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?)`
                , [media_type, media_path, latitude, longitude, trip_id, trip_name, time, time, media_id, coordinate_id, 'add'])

            // await TripDatabase.updateTripMediaVersion(trip_id)
            return
        }
        catch (err) {
            console.error(err)
            throw new Error('Failed to insert to db')
        }
    }
    async deleteMediaFromDB(media_id, trip_id, modified_time) {
        // ghost delete in database for sync purposes
        const DB = await SqliteService.connectDB()

        try {
            await DB.runAsync(`UPDATE user_${UserDataService.getUserId()}_album SET event = ? , modified_time =? WHERE media_id = ?`
                , 'remove', modified_time, media_id)

            if (trip_id) {
                const current_version = await TripDatabase.getTripMediaVersion(trip_id)
                await TripDatabase.updateTripMediaVersion(trip_id, current_version + 1)

            }
            return
        }
        catch (err) {
            console.error(err)
            throw new Error('Failed to delete from db')
        }
    }
    async getAssestsFromTripId(trip_id) {
        try {
            const DB = await SqliteService.connectDB()
            const result = await DB.getAllAsync(`SELECT * FROM user_${UserDataService.getUserId()}_album WHERE trip_id = ?`, [trip_id])
            return result
        }
        catch (err) {
            console.error('Failed to get all assets from album database: ', err)
            return null
        }
    }
    async getMediaHash(trip_id) {
        try {
            const DB = await SqliteService.connectDB()
            const row = await DB.getFirstAsync(
                `SELECT COUNT(*), MAX(modified_time) FROM user_${UserDataService.getUserId()}_album WHERE trip_id = ?`,
                [trip_id]
            )
            return `${row['COUNT(*)']}:${row['MAX(modified_time)']}`
        } catch (err) {
            return null
            // throw new Error('Failed to get all assets: ' + err.message)
        }
    }
    async getAllMediasFromDbTest() {
        const DB = await SqliteService.connectDB()
        let result
        try {
            result = await DB.getAllAsync(`SELECT * FROM user_${UserDataService.getUserId()}_album ORDER BY time_stamp DESC`)
            return result
        }
        catch (err) {
            console.error(err)
        }
    }
    async getAllMediasFromDb() {
        const DB = await SqliteService.connectDB()
        let result
        try {
            result = await DB.getAllAsync(`SELECT * FROM user_${UserDataService.getUserId()}_album WHERE event = ? ORDER BY time_stamp DESC`, ('add'))
            return result
        }
        catch (err) {
            console.error(err)
        }
    }
    async getAllMediasFromAlbumn(media_type = null) {
        // return an array of assets
        try {
            const permission = await MediaPermission.getAlbumPermission()
            if (permission.accessPrivileges !== 'all') return null
            const album = await MediaLibrary.getAlbumAsync('Tripin_album')
            const options = {
                album: album,
                sortBy: [MediaLibrary.SortBy.creationTime],
                first: 100,
                mediaType: ['video', 'photo']

            }
            if (media_type) {
                options['mediaType'] = media_type
            }
            const assets = await MediaLibrary.getAssetsAsync(options)
            console.log('merge album', assets)
            return assets.assets
        }
        catch (err) {
            console.error('Error at getting asset from album', err)
        }
    }
    async mergeMediasFromAlbumAndDB(db_array, album_array) {
        console.log('merge1 ', db_array)
        console.log('merge2 ', album_array)

        let hash_map = {}
        for (const object of album_array) {
            // create media_id, 
            object.media_id = GENERATE_MEDIA_ID(object.mediaType, object.uri)

            hash_map[object.media_id] = object
        }
        const merge = album_array.filter((album) => {
            !db_array.find((db) => db.media_id == album.id)
        })
        const result = [...db_array, ...merge]
        console.log('test', result)
        // for(const object of db_array){
        //     if(hash_map[object.media_id]){
        //         hash_map[object.media_id] = {
        //         ...hash_map[object.media_id], 
        //         latitude: object.latitude,
        //         longitude: object.longitude,
        //         trip_name: object.trip_name,
        //         media_path: object.media_path
        //     }
        //     }
        // }
        console.log('merge', result)
        return (result)
    }

    async getMergedMediasArray() {
        const db_medias = await this.getAllMediasFromDb()
        const album_medias = await this.getAllMediasFromAlbumn()
        if (!album_medias || album_medias.length === 0) {
            console.log('db_medias', db_medias)
            return db_medias
        }
        const result = await this.mergeMediasFromAlbumAndDB(db_medias, album_medias)
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