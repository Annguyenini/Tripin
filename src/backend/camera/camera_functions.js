import { CameraView, useCameraPermissions, FlashMode } from 'expo-camera';
import { act,useState } from 'react';
import * as MediaLibrary from 'expo-media-library';

export class CameraService{
    
    constructor(){
        
        if(CameraService.instance) return CameraService.instance;
        CameraService.instance = this;
        this.album_name = "Tripin_album";
        this.video = null;
    }

    async takePicture (cameraRef){
    if (cameraRef.current){
        try{
            const options = {quality: 1, base64 :true}; // control option for picture
            const photo =await cameraRef.current.takePictureAsync(options) // return a photo
            console.log(photo.uri)
            this.saveMediaToAlbum(photo.uri)
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
        await this.saveMediaToAlbum(this.video.uri);
    } else {
        console.warn("No video URI found yet!");
    }
  }
  async saveMediaToAlbum(uri){
    
    console.log (this.album_name)    
    const album = await MediaLibrary.getAlbumAsync(this.album_name);
    const asset = await MediaLibrary.createAssetAsync(uri)
    try{
        if(album){
            await MediaLibrary.addAssetsToAlbumAsync([asset],album,false)
        }
        else{
            await MediaLibrary.createAlbumAsync(this.album_name,asset);
        }
    }
    catch(error){
        console.error("Error at save media to album: ",error);
    }
    console.log("save successfully")

  }
}


