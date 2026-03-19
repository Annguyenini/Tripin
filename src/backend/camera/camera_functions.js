
import * as MediaLibrary from 'expo-media-library';
// import TripData from '../../app-core/local_data/local_trip_data'
import CurrentTripDataService from '../../backend/storage/current_trip'
import TripContentHandler from '../../app-core/flow/trip_contents_handler';
import TripDataStorage from '../trip_coordinates/current_trip_coordinate_service'
import * as VideoThumbnails from 'expo-video-thumbnails';
import Albumdb from '../album/albumdb';
import trip_album_subject from '../trip_album/trip_album_subject';
// import TripDatabaseService from '../database/TripDatabaseService';
import CurrentDisplayTripMediaObserver from '../../frontend/map_box/functions/current_display_media_observer';
import MediaService from '../media/media_service'
class CameraService{
    constructor(){
        this.album_name = "Tripin_album";
        this.video = null;
    }

    async takePicture (cameraRef,options){
        if (cameraRef.current){
        try{
            // const options = {quality: 1, base64 :true}; // control option for picture
            const photo =await cameraRef.current.takePhoto(options) // return a photo
            await MediaService.saveImagehandler(photo.path)
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
        try{
            await cameraRef.current.startRecording({
                onRecordingFinished: (video) => this.video = video,
                onRecordingError: (error) => console.error(error)})
        }
        catch(err){
            console.error("Failed to record Video",err);
            return null;
        }
    }
  }
  async stopRecording(cameraRef){
    if(cameraRef.current){
        cameraRef.current.stopRecording();
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(this.video)
    if (this.video?.path) {
        try{
            await MediaService.sendVideoHandler(this.video.path)}
            catch(err){
                console.error("failed to save video!",err)
            }
        return this.video
    } else {
        console.warn("No video URI found yet!");
    }
  }
  
    
}

const camera = new CameraService()
export default camera
