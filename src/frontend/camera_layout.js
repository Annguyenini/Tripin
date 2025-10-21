import React, { useState, useRef, useMemo,useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image ,PanResponder} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { cameraStyle } from '../styles/camera_style.js';
import { CameraService } from '../backend/camera/camera_functions.js';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { navigate } from './navigationService';
import { Platform } from 'react-native';


const { width, height } = Dimensions.get('window');
const cameraSetting_icon = require('../../assets/image/camera_setting.png');

const exitCamera = () => {
  navigate('Main');
}

const cameraService = new CameraService();

export const CameraApp = () => {
  const cameraRef = useRef(null);
  const [cameraPermission, requestcameraPermission] = useCameraPermissions();
  const [albumPermission, requestAlbumPermission] = MediaLibrary.usePermissions();

  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [currentMode, setCurrentMode] = useState("Picture")
  const [recording, setRecording] = useState(false);
  const [facing, setFacing] = useState('back');
  const [zoom, setZoom] = useState(0.16); // Back to useState
  const [lastZoom, setLastZoom] = useState(null);
  const [flash, setFlash] = useState('off');
  const [showFlash, setShowFlash] = useState(false);
  const [image_icon, setImage_icon] = useState('file:///var/mobile/Containers/Data/Application/5DBFCD23-AFBA-4281-914D-12EAF42C9416/Library/Caches/ExponentExperienceData/@anonymous/tripin-abf3e43d-29e4-438a-86c2-3c5425c1f3da/Camera/5FF144A7-2825-4CB6-A11A-62C455ED9E60.jpg');
  const [image_flash_icon, setFlashIcon] = useState(require('../../assets/image/camera_flash_off.png'));
  
  const zoomInterval = useRef(null);
  const baseZoom = useRef(0.16);
  const leftZoomModeList =[0,1,2];
  const rightZoomModeList =[3,5,10];

  const toggleFlash = () => {
    setFlashIcon(prev => prev === require("../../assets/image/camera_flash_off.png") ? require('../../assets/image/camera_flash_on.png') : require('../../assets/image/camera_flash_off.png'));
  }

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
  const recordVideo = async()=>{
    console.log("record")
    if (!recording){
      console.log("pass")
      const vid = cameraService.recordVideo(cameraRef);
      setRecording(true)
      setVideo(vid)
      setImage_icon(vid.uri)
    }
    
  }
  const stopRecording = async()=>{
    console.log("stop record")
    if(recording){
      cameraService.stopRecording(cameraRef);
    }
    setRecording(false)

    console.log(video.uri)
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

  // Check for permission
  if (!cameraPermission?.granted || !albumPermission?.granted) {
    return (
      <View style={cameraStyle.container}>
        <Text style={cameraStyle.text}>
          {!cameraPermission ? 'Camera permission granted!' : 'Camera permission required'}
        </Text>
        <Text style={cameraStyle.text}>
          {!albumPermission ? 'Album permission granted!' : 'Album permission required'}
        </Text>

        {/* Ask for camera Permission */}
        {cameraPermission && !cameraPermission.granted && (
          <TouchableOpacity style={cameraStyle.button} onPress={requestcameraPermission}>
            <Text style={cameraStyle.buttonText}>Allow Camera</Text>
          </TouchableOpacity>
        )}
        {/* Ask for album permission */}
        {albumPermission && !albumPermission.granted && (
          <TouchableOpacity style={cameraStyle.button} onPress={requestAlbumPermission}>
            <Text style={cameraStyle.buttonText}>Allow access album</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={cameraStyle.container}>
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
          />
        </View>
      </GestureDetector>

      {/* Rest of your UI remains the same */}
      <View style={cameraStyle.topControls}>
        <TouchableOpacity style={cameraStyle.flipButton} onPress={exitCamera}>
          <Text style={cameraStyle.buttonText}>X</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={cameraStyle.flipButton} 
          onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
        >
          <Text style={cameraStyle.buttonText}>🔄</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={cameraStyle.flipButton} 
          onPress={() => {
            setFlash(prev => prev === 'off' ? 'on' : 'off');
            toggleFlash();
          }}
        >
          <Image source={image_flash_icon} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
      </View>

      <View style={cameraStyle.zoomControls}>

        <TouchableOpacity 
          style={cameraStyle.zoomButtons} 
          onPressIn={() => startZooming('out')} 
          onPressOut={stopZooming}
        >
          <Text style={cameraStyle.zoomText}>-</Text>
        </TouchableOpacity>

            {leftZoomModeList.map((mode)=>{
              return(
                <View style={cameraStyle.zoomModeZone}>
              <TouchableOpacity style={cameraStyle.zoomButtons} onPress={()=>callZooming(mode)}>
                <Text style={cameraStyle.zoomText}>
                  {mode}X
                </Text>
              </TouchableOpacity>
              </View>)
            })}

        <View style={cameraStyle.currentZoomZone}><Text style={cameraStyle.currentZoomText}>{(zoom * 10).toFixed(1)}</Text></View>

            {rightZoomModeList.map((mode)=>{
              return(
                <View style={cameraStyle.zoomModeZone}>
              <TouchableOpacity style={cameraStyle.zoomButtons} onPress={()=>callZooming(mode)}>
                <Text style={cameraStyle.zoomText}>
                  {mode}X
                </Text>
              </TouchableOpacity>
              </View>)
            })}

        <TouchableOpacity 
          style={cameraStyle.zoomButtons} 
          onPressIn={() => startZooming('in')} 
          onPressOut={stopZooming}
        >
          <Text style={cameraStyle.zoomText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={cameraStyle.botControls}>
        <TouchableOpacity style={cameraStyle.flipButton}>
          <Image source={cameraSetting_icon} style={[cameraStyle.icon, { width: 50, height: 50 }]} />
        </TouchableOpacity>


        <TouchableOpacity >
          <Text style={cameraStyle.cameraMode} >{(currentMode === "Picture")? "Picture":"Video"}</Text>
        </TouchableOpacity>


        <TouchableOpacity style={cameraStyle.snapButton} onPress={takePicture} onLongPress={recordVideo} onPressOut={stopRecording} delayLongPress={500}>
          <Text style={cameraStyle.buttonText}> </Text>
        </TouchableOpacity>
        <TouchableOpacity >
        </TouchableOpacity>
        <TouchableOpacity style={cameraStyle.flipButton}>
          <Image source={{ uri: image_icon }} style={[cameraStyle.icon, { width: 70, height: 70 }]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};