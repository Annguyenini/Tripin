import Albumdb from "../album/albumdb"
import TripContentHandler from "../../app-core/flow/trip_contents_handler"
import CurrentTripCoordinateService from '../trip_coordinates/current_trip_coordinate_service'
import CurrentTripDataService from '../storage/current_trip'
import CurrentDisplayTripMediaObserver from "../../frontend/map_box/functions/current_display_media_observer"
import LocationData from "../../app-core/local_data/local_location_data"
import safeRun from "../../app-core/helpers/safe_run"
import * as MediaLibrary from 'expo-media-library';
import * as Crypto from 'expo-crypto';
const ALBUM_NAME ="Tripin_album";

class MediaService {
    GENERATE_MEDIA_ID(media_type,id){
        // return `${trip_id ? `trip_${trip_id}`:''}:${media_type}:${time_stamp}`
        return `${media_type}:${id}`

    }
    async saveMediaHandler(media_uri){
        let asset
        let asset_object
        let media_id
        let coordinate_id
        const trip_id = CurrentTripDataService.getCurrentTripId()
        const location_data = (await LocationData.getCurrentCoor())?.coords
        if (!location_data) {
            return
        }
        const longitude = location_data.longitude
        const latitude = location_data.latitude
        try{
            // save to camera roll, gallery
            asset = await safeRun(()=>this.saveMediaToLocalAlbum(media_uri),'failed_at_save_media_to_gallery')
            if (!asset){
                throw new Error('Failed to generate asset!')
            }
            // generate media an unique media id 
            media_id =  this.GENERATE_MEDIA_ID(asset.mediaType,asset.id)
            coordinate_id = Crypto.randomUUID() 
            // get object ready to insert into album 
            asset_object = Albumdb.getAlbumAssetObjectReady(asset,media_uri,media_id,latitude,longitude)
            // insert into album 

            Albumdb.addToAlbumArray(asset_object)
            // trip_album_subject.addAssetIntoArray(asset_object)
            
            // add media into sqlite 3
            await safeRun(()=>Albumdb.addMediaIntoDB(asset.mediaType,media_uri,asset.uri,asset.creationTime,media_id,longitude,latitude,coordinate_id),'failed_at_save_image_to_sqlite3')
            
        }
        catch(err){
            console.error('Failed to save media to local db',err)
            throw new ('Failed to save image to local')
        }
        // if in a active trip 
        if(trip_id){
            try{

                TripContentHandler.uploadTripMediaHandler(media_id,trip_id,media_uri,longitude,latitude,coordinate_id)
                // generate a location object
                const coordinate_object = CurrentTripCoordinateService.generateCoordinatePayload(location_data,coordinate_id)
                // add the coordinate obejct to service
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
        throw new Error('failed to save image to gallery')
    }
    // console.log("save successfully")

  }
  async deleteMediaToLocalAlbum(path){
    const id = path.replace(/^(photo|video):/, '').replace(/^ph:\/\//, '');    if (id.length<10) return
    // console.log (ALBUM_NAME)    
    try{
       await MediaLibrary.deleteAssetsAsync([id])            
    }
    catch(error){
        console.error("Error at delete from album: ",error);
        throw new Error('Failed to delete from gallery')
    }
    // console.log("save successfully")

  }
}
export default new MediaService