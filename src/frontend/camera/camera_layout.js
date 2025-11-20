import React, { useState, useRef, useMemo,useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image ,PanResponder} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { cameraStyle } from '../../styles/camera_style.js';
import { CameraService } from '../../backend/camera/camera_functions.js';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { navigate } from '../custome_function/navigationService.js';
import { Platform } from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import {Permission_request_laytout,Top_bar_control,Camera_zoom_layout,Bot_bar_control} from './camera_fucntion_layout.js'
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
  const [zoom, setZoom] = useState(0.16); // Back to useState
  const [lastZoom, setLastZoom] = useState(null);
  const [flash, setFlash] = useState('off');
  const [showFlash, setShowFlash] = useState(false);
  const [image_icon, setImage_icon] = useState('file:///var/mobile/Containers/Data/Application/5DBFCD23-AFBA-4281-914D-12EAF42C9416/Library/Caches/ExponentExperienceData/@anonymous/tripin-abf3e43d-29e4-438a-86c2-3c5425c1f3da/Camera/5FF144A7-2825-4CB6-A11A-62C455ED9E60.jpg');
  const [image_flash_icon, setFlashIcon] = useState(require('../../../assets/image/camera_flash_off.png'));
  const [isCameraReady,setCameraReady] = useState(false);
  const zoomInterval = useRef(null);
  const baseZoom = useRef(0.16);
  const leftZoomModeList =[0,1,1.6]
  const rightZoomModeList =[3,5,10];
  const cameraService = new CameraService();

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
    console.log("Camera is ready");
    setCameraReady(true);
  }, []);
  // Take picture
  const takePicture = async () => {
    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
    }, 150);
    const photo = await cameraService.takePicture(cameraRef);
    if (photo) {
      console.log("pass");
      setPhoto(photo);
      setImage_icon(photo.uri);
    }
  }
  const recordVideo = async () => {
  console.log("record");
  
  // Check if camera is ready
  if (!isCameraReady) {
    console.log("Camera not ready");
    return;
  }
  
  if (!recording && cameraRef.current) {
    try {
      console.log("Starting recording...");
      setRecording(true); // Set recording BEFORE starting
      
      const video = await cameraService.recordVideo(cameraRef);
      
      if (video) {
        console.log("Video recorded:", video.uri);
        await setThumnail(video.uri)

        setVideo(video);
      }
    } catch (err) {
      console.error("Recording error:", err);
      setRecording(false); // Reset if error occurs
    }
  }
};
  const stopRecording = async()=>{
    console.log("stop record")
    if(recording){
      cameraService.stopRecording(cameraRef);
    }
    setRecording(false)
    console.log(video.uri)
    // await cameraService.saveMediaToAlbum(video.uri)
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
  const setThumnail = async(videoUri)=>{
    try{
      const {uri} = await VideoThumbnails.getThumbnailAsync(videoUri)
      setImage_icon(uri);
    }
    catch(e){
      console.error(e);
    }
  }
  // // Stop zooming for bar
  const stopZooming = () => {
    if (zoomInterval.current) {
      clearInterval(zoomInterval.current);
      zoomInterval.current = null;
    }
  }
  const onPinch = useCallback(
      (event) => {
        const velocity = event.velocity / 20;
        const outFactor = lastZoom *(Platform.OS === 'ios' ? 40 : 15);
        let newZoom =
            velocity > 0
                ? zoom + event.scale * velocity * (Platform.OS === 'ios' ? 0.01 : 25) // prettier-ignore
                : zoom - (event.scale * (outFactor || 1)) * Math.abs(velocity) * (Platform.OS === 'ios' ? 0.02: 50); // prettier-ignore

        if (newZoom < 0) newZoom = 0;
        else if (newZoom > 1) newZoom = 1;

        setZoom(newZoom);
      },
      [zoom, setZoom,lastZoom,setLastZoom]
    );
      const onPinchEnd = useCallback(
    (event) => {
      setLastZoom(zoom);
    },
    [zoom, setLastZoom]
  );
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Touch started
    },
    onPanResponderMove: (evt, gestureState) => {
      // For basic zoom, you could use dy (vertical movement)
      const zoomChange = gestureState.dx * 0.003;
      const newZoom = Math.min(Math.max(zoom + zoomChange, 0), 1);
      setZoom(newZoom);
    },
  });
  // Pinch gesture without Reanimated
  const zoomPinch = useMemo(() => 
    Gesture.Pinch()
    .onUpdate(onPinch)
    .onEnd(onPinchEnd),
    [onPinch]
  
       // Add zoom as dependency
  );
 

  return (
    <View style={cameraStyle.container}>
        {/* Check for permission */}

      <Permission_request_laytout cameraPermission = {cameraPermission} requestcameraPermission={requestcameraPermission}
      albumPermission={albumPermission} requestAlbumPermission={requestAlbumPermission}/>

      {/* While flash to express the taking picture */}
      {showFlash && (
        <View style={cameraStyle.flashOverlay}></View>
      )}

      <GestureDetector gesture={zoomPinch}>
        <View style={{ flex: 1 }}>
          <CameraView
            {...panResponder.panHandlers}

            ref={cameraRef}
            style={{ width, height }}
            zoom={zoom} // Use state value directly
            facing={facing}
            flash={flash}     
            mode={currentMode}
       
            onCameraReady={onCameraReady}
          />
        </View>
      </GestureDetector>

      {/* Rest of your UI remains the same */}
      <Top_bar_control flash={flash} image_flash_icon ={image_flash_icon} setFlash={setFlash} facing={facing} setFacing={setFacing} toggleFlash={toggleFlash} exitCamera={exitCamera}/>

      <Camera_zoom_layout startZooming = {startZooming} leftZoomModeList={leftZoomModeList} rightZoomModeList ={rightZoomModeList}
      callZooming ={callZooming} stopZooming={stopZooming} zoom={zoom}/>

      <Bot_bar_control recordVideo={recordVideo} stopRecording={stopRecording} toggleCameraMode = {toggleCameraMode} shutterButtonAction ={shutterButtonAction} currentMode={currentMode} recording={recording} image_icon={image_icon}/>
    </View>
  );
};
