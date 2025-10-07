import { CameraView, useCameraPermissions, FlashMode } from 'expo-camera';
import { act } from 'react';

export class CameraService{
    async takePicture (cameraRef){
    if (cameraRef.current){
        try{
            const options = {quality: 1, base64 :true}; // control option for picture
            const photo =await cameraRef.current.takePictureAsync(options) // return a photo
            console.log(photo.uri)
            return photo;
        }    
        catch(err){
            console.error("Faild to take picture");
            return null;
        }
    }

  }

  async recordVideo(cameraRef){
    if(cameraRef.current){
        try{
            const video =await cameraRef.current.recordAsync()
        }
        catch(err){
            console.error("Failed to record Video");
            return null;
        }
        return video;
    }
  }
  async stopRecording(cameraRef){
    if(cameraRef.curent){
        cameraRef.current.stopRecording();
    }
  }
}


