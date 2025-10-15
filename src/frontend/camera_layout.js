import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions,Image,PanResponder } from 'react-native';
import { CameraView, useCameraPermissions, FlashMode } from 'expo-camera';
import { cameraStyle, mainScreenStyle } from '../styles/camera_style.js';
import {CameraService} from '../backend/camera/camera_functions.js'

import * as MediaLibrary from 'expo-media-library';
import{navigate} from './navigationService'
const { width, height } = Dimensions.get('window');
const cameraSetting_icon = require('../../assets/image/camera_setting.png');
const exitCamera=()=>{
  navigate('Main');
}
const cameraService =new CameraService();
export const CameraApp = () => {
  const cameraRef = useRef(null);
  const [cameraPermission, requestcameraPermission] = useCameraPermissions();
  const [albumPermission, requestAlbumPermission] =  MediaLibrary.usePermissions();


  const [Album,setAlbums]= useState(null);
  const [photo,setPhoto] =useState(null);
  const [video,setVideo]=useState(null);
  const [recording,setRecording] =useState(false);

  const [facing, setFacing] = useState('back');
  const [zoom,setZoom] = useState(0.16);
  const [flash,setFlash] =useState('off');
  const [showFlash,setShowFlash] =useState(false);


  const [image_icon, setImage_icon] =useState('file:///var/mobile/Containers/Data/Application/5DBFCD23-AFBA-4281-914D-12EAF42C9416/Library/Caches/ExponentExperienceData/@anonymous/tripin-abf3e43d-29e4-438a-86c2-3c5425c1f3da/Camera/5FF144A7-2825-4CB6-A11A-62C455ED9E60.jpg');
  const [image_flash_icon,setFlashIcon] = useState(require('../../assets/image/camera_flash_off.png'));
  const zoomInterval=useRef(null);

  const toggleFlash =()=>{
    setFlashIcon (prev =>prev === require("../../assets/image/camera_flash_off.png")? require('../../assets/image/camera_flash_on.png'):require('../../assets/image/camera_flash_off.png'));
  }
/////get album return album var
  async function getAlbums() {
    if (permissionResponse.status !== 'granted') {
      await requestAlbumPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }
  //take piture
  const takePicture = async()=>{
      setShowFlash(true);
      setTimeout(()=>{
        setShowFlash(false);
      },150)
      const photo = await cameraService.takePicture(cameraRef);  //// calling camera service (backend)
      if (photo){
        console.log("pass")
        setPhoto(photo);
        setImage_icon(photo.uri); 
      } 
  }



  const recordVideo =async()=>{
    const video = await cameraService.recordVideo(cameraRef);
    setRecording(true);
    setVideo(video);

  }
  const stopRecording = ()=>{
    cameraService.stopRecording();
    setRecording(false);
    setImage_icon(video.uri);
  }
  //zooming for bar 
  const startZooming =(direction)=>{
    if(zoomInterval.current) return;
      
      zoomInterval.current= setInterval(()=>{
        setZoom(prev =>{
          if(direction ==="in") return Math.min(prev+0.01,1);
          else{return Math.max(prev-0.01,0)}
        })
      })
    }
  //stop zooming for bar
  const stopZooming =()=>{
    if(zoomInterval.current){
      clearInterval(zoomInterval.current);
      zoomInterval.current=null;
    }
  }
  //zooming for pan 
const panResponder = PanResponder.create({
  onStartShouldSetPanResponder: () => true,
  onMoveShouldSetPanResponder: () => true,
  onPanResponderGrant: () => {
    // Touch started
  },
  onPanResponderMove: (evt, gestureState) => {
    // For basic zoom, you could use dy (vertical movement)
    const zoomChange = gestureState.dy * 0.001;
    const newZoom = Math.min(Math.max(zoom + zoomChange, 0), 1);
    setZoom(newZoom);
  },
});


  //check for permission
  if (!cameraPermission?.granted||!albumPermission?.granted) {
    return (
      <View style={cameraStyle.container}>
        <Text style={cameraStyle.text}>
          {!cameraPermission ? 'Camera permisstion granted!' : 'Camera permission required'}
        </Text>
        <Text style ={cameraStyle.text}>
            {!albumPermission?'Album permisstion granted!': 'Album permission required'}
        </Text>

        {/*Ask for camera Permission */}
        {cameraPermission && !cameraPermission.granted && (
          <TouchableOpacity style={cameraStyle.button} onPress={requestcameraPermission}>
            <Text style={cameraStyle.buttonText}>Allow Camera</Text>
          </TouchableOpacity>
        )}
        {/*Ask for album permission*/}
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

      {/* While flash to exprest the taking picture*/}
      {showFlash && (
      <View style={cameraStyle.flashOverlay}></View>)}


    <CameraView
      {...panResponder.panHandlers}
      ref={cameraRef}
      style={{ width, height }}
      zoom={zoom}
      facing={facing}
      flash={flash}
    />

      {/* top bar header */}
      <View style ={cameraStyle.topControls}>
        {/**Exit button */}
        <TouchableOpacity 
          style={cameraStyle.flipButton} 
          onPress={ exitCamera}
          >
          <Text style={cameraStyle.buttonText}>X</Text>
        </TouchableOpacity>

        {/**Flip button */}
        <TouchableOpacity 
          style={cameraStyle.flipButton} 
          onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')
            }
          >
          <Text style={cameraStyle.buttonText}>🔄</Text>
        </TouchableOpacity>

        {/**flash button */}
        <TouchableOpacity 
          style={cameraStyle.flipButton} 
          
          onPress={ ()=>{
            setFlash(prev=> prev === 'off'? 'on':'off')
            toggleFlash();
          }}>
        <Image source={image_flash_icon} style={{width: 40, height: 40}}  />        
        </TouchableOpacity>
      </View>

          {/**zoom zone buttons */}
      <View style={cameraStyle.zoomControls}>
        {/**- zoom button */}
        <TouchableOpacity style={cameraStyle.zoomButtons} onPressIn={()=>startZooming('out')} onPressOut={stopZooming}
        >
          <Text style={cameraStyle.zoomText}>-</Text>
        </TouchableOpacity>

          {/**zoom level*/}
          <Text style={cameraStyle.zoomText}>{(zoom * 10).toFixed(1)}</Text>

           {/**+ zoom button */}
        <TouchableOpacity style={cameraStyle.zoomButtons} onPressIn={()=>startZooming('in')} onPressOut={stopZooming}>
          <Text style={cameraStyle.zoomText}>+</Text>
        </TouchableOpacity>
      </View>

      {/*footer bar incuding setting, picture, gallary*/}
      <View style={cameraStyle.botControls}>
        {/** camera setting button */}
        <TouchableOpacity 
          style={cameraStyle.flipButton} >
          <Image source={cameraSetting_icon} style={[cameraStyle.icon,  {width: 50, height: 50}]}></Image>
        </TouchableOpacity>
        
          {/** camera picture button */}
         <TouchableOpacity 
          style={cameraStyle.snapButton} 
             onPress={takePicture}

        >
          <Text style={cameraStyle.buttonText}> </Text>
        </TouchableOpacity>

        {/** gallery button */}
        <TouchableOpacity 
          style={cameraStyle.flipButton} 
         
        >
          <Image source={{uri:image_icon}} style={[cameraStyle.icon,  {width: 70, height: 70}]}></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
};

