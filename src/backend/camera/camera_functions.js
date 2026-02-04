
import * as MediaLibrary from 'expo-media-library';
// import TripData from '../../app-core/local_data/local_trip_data'
import CurrentTripDataService from '../../backend/storage/current_trip'
import TripContentHandler from '../../app-core/flow/trip_contents_handler';
import TripDataStorage from '../trip_coordinates/current_trip_coordinate_service'
import * as VideoThumbnails from 'expo-video-thumbnails';
import Albumdb from '../album/albumdb';
// import trip_album_subject from '../trip_album/trip_album_subject';
// import TripDatabaseService from '../database/TripDatabaseService';
import CurrentDisplayTripMediaObserver from '../../frontend/map_box/functions/current_display_media_observer';
class CameraService{
    constructor(){
        this.album_name = "Tripin_album";
        this.video = null;
    }

    async takePicture (cameraRef){
        if (cameraRef.current){
        try{
            const options = {quality: 1, base64 :true}; // control option for picture
            const photo =await cameraRef.current.takePictureAsync(options) // return a photo
            await this.saveImagehandler(photo.uri)
            return photo;
        }    
        catch(err){
            console.error("Failed to take picture",err);
            return null;
        }
     }

    }


  async recordVideo(cameraRef){
    if(cameraRef.current){
        let video;
        try{
            video =await cameraRef.current.recordAsync({mute:false, maxDuration:30})
        }
        catch(err){
            console.error("Failed to record Video",err);
            return null;
        }
        this.video = video;
        return video;
    }
  }
  async stopRecording(cameraRef){
    if(cameraRef.current){
        cameraRef.current.stopRecording();
    }
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (this.video?.uri) {
        try{
            await this.sendVideoHandler(this.video.uri)}
            catch(err){
                console.error("failed to save video!",err)
            }
        return asset
    } else {
        console.warn("No video URI found yet!");
    }
  }
  
    async saveImagehandler(photoUri){
        let asset
        let version
        let asset_object
        try{
            asset = await this.saveMediaToLocalAlbum(photoUri)
            version = await Albumdb.addMediaIntoDB(asset.mediaType,photoUri,asset.uri,asset.creationTime)
            asset_object = await Albumdb.getAlbumAssetObjectReady(asset)
            Albumdb.addToAlbumArray(asset_object)
            // trip_album_subject.addAssetIntoArray(asset_object)

        }
        catch(err){
            console.error('Failed to save iamge to local db')
        }
        const trip_id = CurrentTripDataService.getCurrentTripId()
        if(trip_id){
            try{
                TripContentHandler.uploadTripImageHandler(version,trip_id,photoUri)
                TripDataStorage.push()
                CurrentDisplayTripMediaObserver.addAssetIntoArray(trip_id,asset_object)
            }
            catch(err){
                console.error(err)
            }
        }
        return
    }
    async sendVideoHandler(videoUri){        
        let video_asset
        let video_version
        let asset_object
        try{
            video_asset = await this.saveMediaToLocalAlbum(videoUri)
            video_version = await Albumdb.addMediaIntoDB(video_asset.mediaType,videoUri,video_asset.uri,video_asset.creationTime)
            asset_object = await Albumdb.getAlbumAssetObjectReady(video_asset)
            Albumdb.addToAlbumArray(asset_object)
            // trip_album_subject.addAssetIntoArray(asset_object)
        }
        catch(err){
            console.error('Failed to save video to local db',err)
        }

        if(CurrentTripDataService.getCurrentTripId()){
            try{
                const trip_id = CurrentTripDataService.getCurrentTripId()
                TripContentHandler.uploadTripVideoHandler(video_version,trip_id,videoUri)
                TripDataStorage.push()
                CurrentDisplayTripMediaObserver.addAssetIntoArray(trip_id,asset_object)
            }
            catch(err){
                console.log('Failed to send video',err)
            }
        }
        return
    }

  async saveMediaToLocalAlbum(uri){
    // console.log (this.album_name)    
    const album = await MediaLibrary.getAlbumAsync(this.album_name);
    const asset = await MediaLibrary.createAssetAsync(uri)
    console.log(asset)
    try{
        if(album){
            await MediaLibrary.addAssetsToAlbumAsync([asset],album,false)            
            return asset
        }
        else{
            await MediaLibrary.createAlbumAsync(this.album_name,asset);
            return await this.saveMediaToLocalAlbum(uri)
        }
    }
    catch(error){
        console.error("Error at save media to album: ",error);
    }
    // console.log("save successfully")

  }
}

const camera = new CameraService()
export default camera
