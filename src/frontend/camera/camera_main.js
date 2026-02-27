import React, { useState, useRef, useMemo,useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image ,PanResponder} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { cameraStyle } from '../../styles/camera_style.js';
import CameraService from '../../backend/camera/camera_functions.js'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { navigate } from '../custom_function/navigationService.js';
import { Platform } from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBarCamera from './layout/top_bar.js'
import PermissionLayout from './layout/permission.js';
import CameraZoomLayout from './layout/zoom_bar.js';
import BotBarControl from './layout/bot_bar.js';
import ZoomText from './layout/zoom_text.js';
import CatureOption from './layout/capture_option.js';
import { runOnJS } from 'react-native-worklets';
import { scheduleOnRN } from 'react-native-worklets';
import AlbumService from '../../backend/album/albumdb.js';
const { width, height } = Dimensions.get('window');

const exitCamera = () => {
  navigate('Main');
}





export const CameraApp = () => {
  const cameraRef = useRef(null);
  const [cameraPermission, requestcameraPermission] = useCameraPermissions();
  const [albumPermission, requestAlbumPermission] = MediaLibrary.usePermissions();

  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [currentMode, setCurrentMode] = useState("picture")
  const [recording, setRecording] = useState(false);
  const [facing, setFacing] = useState('back');
  const [zoom, setZoom] = useState(0); // Back to useState
  const lastZoom = useRef(0)
  // const [lastZoom, setLastZoom] = useState(null);
  const [flash, setFlash] = useState('off');
  const [showFlash, setShowFlash] = useState(false);
  const [image_icon, setImage_icon] = useState(null);
  const [imageIconType,setImageIconType]=useState(null)
  const [image_flash_icon, setFlashIcon] = useState(require('../../../assets/image/camera_flash_off.png'));
  const [isCameraReady,setCameraReady] = useState(false);
  const zoomInterval = useRef(null);
  const baseZoom = useRef(0.16);
  const leftZoomModeList =[0,1,1.6]
  const rightZoomModeList =[3,5,10];

  useEffect(()=>{
    const fetchImages = async()=>{
      setImage_icon(AlbumService.AlbumsArray[0].uri)
      setImageIconType(AlbumService.AlbumsArray[0].mediaType)
    }
    const updateImages={
      update(newArray){
        setImage_icon(newArray[0].uri)
        setImageIconType(newArray[0].mediaType)
      }
    }
    AlbumService.attach(updateImages)
    fetchImages()
    return ()=>AlbumService.detach(updateImages)
  },[])



  const toggleFlash = () => {
    setFlashIcon(prev => prev === require("../../../assets/image/camera_flash_off.png") ? require('../../../assets/image/camera_flash_on.png') : require('../../../assets/image/camera_flash_off.png'));
  }
  const toggleCameraMode = () =>{
    setCurrentMode(prev => prev ==="picture"? "video":"picture")
  }
  const shutterButtonAction =()=>{
    if(!isCameraReady)return;
    currentMode ==="picture"? takePicture() : (!recording? recordVideo(): stopRecording())
  }
  const onCameraReady = useCallback(() => {
    setCameraReady(true);
  }, []);
  // Take picture
  const takePicture = async () => {
    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
    }, 150);
    const photo = await CameraService.takePicture(cameraRef);
    if (photo) {
      setPhoto(photo);
      setImage_icon(photo.uri);
      setImageIconType('photo')
    }
  }
  const recordVideo = async () => {
    
    // Check if camera is ready
    if (!isCameraReady) {
      console.log("Camera not ready");
      return;
    }
    
    if (!recording && cameraRef.current) {
      try {
        setRecording(true); // Set recording BEFORE starting
        const video = await CameraService.recordVideo(cameraRef);
      } catch (err) {
        console.error("Recording error:", err);
        setRecording(false); // Reset if error occurs
      }
    }
};
  const stopRecording = async()=>{
    
    let asset
    try{
      if(recording){
        asset = await CameraService.stopRecording(cameraRef);
      }
    }
    catch(err){
    }
    setRecording(false)
    setImage_icon(asset.uri)
    setImageIconType('video')
    // await CameraService.saveMediaToAlbum(video.uri)
  }
  const callZooming =(mode)=>{
    setZoom(mode/10)
  }
  // Zooming for bar 
  const startZooming = (direction) => {
    if (zoomInterval.current) return;
    
    zoomInterval.current = setInterval(() => {
      setZoom(prev => {
        if (direction === "in") return Math.min(prev + 0.01, 1);
        else return Math.max(prev - 0.01, 0);
      });
    }, 16);
  }
  // const setThumnail = async(videoUri)=>{
  //   try{
  //     const {uri} = await VideoThumbnails.getThumbnailAsync(videoUri)
  //     console.log(uri)
  //     setImage_icon(uri);
  //   }
  //   catch(e){
  //     console.error(e);
  //   }
  // }
  // // Stop zooming for bar
  const stopZooming = () => {
    if (zoomInterval.current) {
      clearInterval(zoomInterval.current);
      zoomInterval.current = null;
    }
  }
  const updateLastZoom =(zoom)=>{
    lastZoom.current = zoom
  }
  const onZoom = useCallback((event)=>{
    'worklet'
    const scaleOffset = (event.scale -  1) * 0.3;
    const newZoom = Math.max(0,Math.min(lastZoom.current+scaleOffset,1))
    scheduleOnRN(setZoom,newZoom)
  },[])
  const onEndZoom = useCallback(() => {
    'worklet';
    scheduleOnRN(updateLastZoom, zoom);
  }, [zoom]);

  const zoomPinch = Gesture.Pinch()
    .onUpdate(onZoom)
    .onEnd(onEndZoom)
  return (
    <View style={cameraStyle.container}>
        {/* Check for permission */}

      <PermissionLayout cameraPermission = {cameraPermission} requestcameraPermission={requestcameraPermission}
      albumPermission={albumPermission} requestAlbumPermission={requestAlbumPermission}/>

      {/* While flash to express the taking picture */}
      {showFlash && (
        <View style={cameraStyle.flashOverlay}></View>
      )}

      <GestureDetector gesture={zoomPinch}>
        <View style={{ flex: 1 }}>
          <CameraView
            // {...panResponder.panHandlers}

            ref={cameraRef}
            style={{ width, height }}
            zoom={0.01} // Use state value directly
            facing={facing}
            flash={flash}     
            mode={currentMode}
       
            onCameraReady={onCameraReady}
          />
        </View>
      </GestureDetector>

      {/* Rest of your UI remains the same */}
      <TopBarCamera flash={flash} image_flash_icon ={image_flash_icon} setFlash={setFlash} facing={facing} setFacing={setFacing} toggleFlash={toggleFlash} exitCamera={exitCamera}/>
      
      <View style={cameraStyle.middleBar}>
        <CatureOption toggleCameraMode={toggleCameraMode} currentMode={currentMode}></CatureOption>
        <ZoomText zoom={zoom}></ZoomText>
        <CameraZoomLayout startZooming = {startZooming} callZooming ={callZooming} stopZooming={stopZooming} zoom={zoom}/>

      </View >
      <View>

        <BotBarControl recordVideo={recordVideo} stopRecording={stopRecording} toggleCameraMode = {toggleCameraMode} shutterButtonAction ={shutterButtonAction} currentMode={currentMode} recording={recording} image_icon={image_icon} type={imageIconType}/>
      </View>
    </View>
  );
};
