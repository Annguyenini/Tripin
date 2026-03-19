import Albumdb from "../album/albumdb"
import TripContentHandler from "../../app-core/flow/trip_contents_handler"
import CurrentTripCoordinateService from '../trip_coordinates/current_trip_coordinate_service'
import CurrentTripDataService from '../storage/current_trip'
import CurrentDisplayTripMediaObserver from "../../frontend/map_box/functions/current_display_media_observer"
import LocationData from "../../app-core/local_data/local_location_data"
import safeRun from "../../app-core/helpers/safe_run"
import * as MediaLibrary from 'expo-media-library';
const ALBUM_NAME ="Tripin_album";

class MediaService {
    GENERATE_MEDIA_ID(trip_id,media_type,time_stamp){
        return `${trip_id ? `trip_${trip_id}`:''}:${media_type}:${time_stamp}`
    }
    async saveImagehandler(photoUri){
        let asset
        let asset_object
        let media_id
        const trip_id = CurrentTripDataService.getCurrentTripId()
        const location_data = (await LocationData.getCurrentCoor())?.coords
        console.log('trip_id',trip_id)
        if (!location_data) {
            return
        }
        const longitude = location_data.longitude
        const latitude = location_data.latitude
        try{
            // save to camera roll, gallery
            asset = await safeRun(()=>this.saveMediaToLocalAlbum(photoUri),'failed_at_save_image_to_gallery')
            // generate media an unique media id 
            media_id =  this.GENERATE_MEDIA_ID(trip_id,asset.mediaType,asset.creationTime)

            // add media into sqlite 3
            await safeRun(()=>Albumdb.addMediaIntoDB(asset.mediaType,photoUri,asset.uri,asset.creationTime,media_id,longitude,latitude),'failed_at_save_image_to_sqlite3')
            
            // get object ready to insert into album 
            asset_object = await safeRun(()=>Albumdb.getAlbumAssetObjectReady(asset,photoUri,media_id,latitude,longitude),'failed_at_add_to_display_array')
            // insert into album 

            Albumdb.addToAlbumArray(asset_object)
            console.log('assetObject',asset_object)
            // trip_album_subject.addAssetIntoArray(asset_object)

        }
        catch(err){
            console.error('Failed to save image to local db',err)
        }
        // if in a active trip 
        if(trip_id){
            try{

                TripContentHandler.uploadTripImageHandler(media_id,trip_id,photoUri,longitude,latitude)
                // generate a location object
                const coordinate_object = CurrentTripCoordinateService.generateCoordinatePayload(location_data)
                // add the coordinate obejct to service
                console.log('coordinate obect',coordinate_object) 
                CurrentTripCoordinateService.push(coordinate_object)
                // display to map
                CurrentDisplayTripMediaObserver.addAssetIntoArray(trip_id,asset_object)
            }
            catch(err){
                console.error(err)
            }
        }
        return
    }
    async sendVideoHandler(videoUri){        
        let asset
        let media_id
        let data
        let asset_object
        const trip_id = CurrentTripDataService.getCurrentTripId()
        const location_data = (await LocationData.getCurrentCoor())?.coords
        console.log('local',location_data)
        if (!location_data) {
            return
        }
        const longitude = location_data.longitude
        const latitude = location_data.latitude
        try{
            asset = await safeRun(()=>this.saveMediaToLocalAlbum(videoUri),'failed_at_save_video_to_gallery')
            // generate media id
            media_id =  this.GENERATE_MEDIA_ID(trip_id,asset.mediaType,asset.creationTime)
            // insert into sqlite3
            data = await safeRun(()=>Albumdb.addMediaIntoDB(asset.mediaType,videoUri,asset.uri,asset.creationTime,media_id,longitude,latitude),'failed_at_save_video_to_sql')
            // get object for album
            asset_object = await safeRun(()=>Albumdb.getAlbumAssetObjectReady(asset,videoUri,media_id,latitude,longitude),'failed_at_get_object')
            // insert into album
            Albumdb.addToAlbumArray(asset_object)
            // trip_album_subject.addAssetIntoArray(asset_object)
        }
        catch(err){
            console.error('Failed to save video to local db',err)
        }

        if(trip_id){
            try{
                TripContentHandler.uploadTripVideoHandler(media_id,trip_id,videoUri,longitude,latitude)
                // generate a location object
                const coordinate_object = CurrentTripCoordinateService.generateCoordinatePayload(location_data)
                // add the coordinate obejct to service 
                CurrentTripCoordinateService.push(coordinate_object)   
                // display to map
   
                CurrentDisplayTripMediaObserver.addAssetIntoArray(trip_id,asset_object)
            }
            catch(err){
                console.log('Failed to send video',err)
            }
        }
        return
    }

  async saveMediaToLocalAlbum(uri){
    // console.log (ALBUM_NAME)    
    const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
    const asset = await MediaLibrary.createAssetAsync(uri)
    console.log(asset)
    try{
        if(album){
            await MediaLibrary.addAssetsToAlbumAsync([asset],album,false)            
            return asset
        }
        else{
            await MediaLibrary.createAlbumAsync(ALBUM_NAME,asset);
            return await this.saveMediaToLocalAlbum(uri)
        }
    }
    catch(error){
        console.error("Error at save media to album: ",error);
    }
    // console.log("save successfully")

  }
  async deleteMediaToLocalAlbum(path){
    const id = path.replace(/^ph:\/\//, '');
    if (id.length<10) return
    // console.log (ALBUM_NAME)    
    console.log(id)
    try{
       await MediaLibrary.deleteAssetsAsync([id])            
    }
    catch(error){
        console.error("Error at delete from album: ",error);
    }
    // console.log("save successfully")

  }
}
export default new MediaService