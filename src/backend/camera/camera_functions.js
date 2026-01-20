
import * as MediaLibrary from 'expo-media-library';
// import TripData from '../../app-core/local_data/local_trip_data'
import CurrentTripDataService from '../../backend/storage/current_trip'
import TripContentHandler from '../../app-core/flow/trip_contents_handler';
import TripDataStorage from '../trip_coordinates/current_trip_coordinate_service'
import * as VideoThumbnails from 'expo-video-thumbnails';
import Albumdb from '../album/albumdb';
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
            await this.saveMediaToAlbum(photo.uri)
            await this.sendImageToServer(photo.uri)
            return photo;
        }    
        catch(err){
            console.error("Failed to take picture",err);
            return null;
        }
     }

    }

    async sendImageToServer(photoUri){
        if(CurrentTripDataService.getCurrentTripId()){
            await TripContentHandler.uploadTripImageHandler(photoUri)
            await TripDataStorage.push()
        }
        return
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
        const asset = await this.saveMediaToAlbum(this.video.uri);
        await this.sendVideoToServer(this.video.uri)
        return asset
    } else {
        console.warn("No video URI found yet!");
    }
  }
  async sendVideoToServer(videoUri){
        if(CurrentTripDataService.getCurrentTripId()){
                const {thumpnailUri} = await VideoThumbnails.getThumbnailAsync(videoUri)
                await TripContentHandler.uploadTripVideoHandler(videoUri,thumpnailUri)
                await TripDataStorage.push()
            }
        return
  }
  async saveMediaToAlbum(uri){
    // console.log (this.album_name)    
    const album = await MediaLibrary.getAlbumAsync(this.album_name);
    const asset = await MediaLibrary.createAssetAsync(uri)
    try{
        if(album){
            await MediaLibrary.addAssetsToAlbumAsync([asset],album,false)
            await Albumdb.addMediaIntoDB(asset.mediaType,asset.uri,asset.creationTime)
            const asset_object = await Albumdb.getAlbumAssetObjectReady(asset)
            // console.log(asset)
            Albumdb.addToAlbumArray(asset_object)
            return asset
        }
        else{
            await MediaLibrary.createAlbumAsync(this.album_name,asset);
            await this.saveMediaToAlbum(uri)
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
