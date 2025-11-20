import React, { useState, useRef, useMemo,useCallback,useEffect } from 'react';
import {FlatList} from 'react-native'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image ,PanResponder} from 'react-native';
import { cameraStyle,camera_zoom } from '../../styles/camera_style.js';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue,configureReanimatedLogger,ReanimatedLogLevel, } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const cameraSetting_icon = require('../../../assets/image/camera_setting.png');
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn, // or .error if you want less spam
  strict: false,
});


export const Permission_request_laytout=({cameraPermission,albumPermission, requestAlbumPermission,requestcameraPermission})=>{
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
}

export const Top_bar_control =({facing,setFacing,flash,setFlash,toggleFlash,exitCamera,image_flash_icon})=>{
    return (<View style={cameraStyle.topControls}>
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
    </View>)
}

export const Camera_zoom_layout=({startZooming,leftZoomModeList=[],rightZoomModeList=[],callZooming,stopZooming,zoom})=>{
  const zoom_mode_list = [0,1,1.6,2,3,5];
  let curIndex = useSharedValue(2)
const Zoom_mode_gesture = 
        Gesture.Pan()
            .onEnd((e) => {
                'worklet'; // Explicitly mark as worklet
                let zoomMode;
                const value = e.translationX;
                try {
                    if (value >= 30) {
                      console.log("Swiping right"); 
                      curIndex.value = Math.min(curIndex.value+1, zoom_mode_list.length)
                      zoomMode = zoom_mode_list[curIndex.value]
                      scheduleOnRN(callZooming,zoomMode)                 
                    }
                    else if (value <= -30) {
                      console.log("Swiping left"); // Add this
                      curIndex.value = Math.max(curIndex.value-1, 0)
                      zoomMode = zoom_mode_list[curIndex.value]
                      scheduleOnRN(callZooming,zoomMode)                 
                    }
                } catch (error) {
                    console.error("Gesture catch ERROR:");
                    console.error("Message:", error.message);
                    console.error("Stack:", error.stack);
                    console.error("Full:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
                }
                console.log("Gesture Ended", e.translationX);
            })
    // [onSwap] // Only depend on onSwap now

    return(<View style={camera_zoom.zoomControls}>

        <TouchableOpacity 
            style={camera_zoom.zoomButtons} 
            onPressIn={() => startZooming('out')} 
            onPressOut={stopZooming}
        >
            <Text style={camera_zoom.zoomText}>-</Text>
        </TouchableOpacity>

        <View style={camera_zoom.centeredZoom}><Text style={camera_zoom.currentZoomText}>{(zoom * 10).toFixed(1)}</Text></View>
            <GestureDetector gesture={Zoom_mode_gesture}>
              <View style ={camera_zoom.zoom_mode_zone}>
                {zoom_mode_list.map((mode, index) =>{
                  return(
                    <View style={index === curIndex.value? camera_zoom.curent_zoom_mode_overlay : camera_zoom.zoom_mode_overlay}>
                    <Text key={index} style={index === curIndex.value? camera_zoom.current_zoom_text_mode : camera_zoom.zoom_text} >
                      {mode}
                    </Text>
                    </View>
                  )
                })}
                </View>       

              </GestureDetector>

        <TouchableOpacity 
            style={camera_zoom.zoomButtons} 
            onPressIn={() => startZooming('in')} 
            onPressOut={stopZooming}
        >
            <Text style={camera_zoom.zoomText}>+</Text>
        </TouchableOpacity>
        </View>
        )
}

export const Bot_bar_control = ({toggleCameraMode,takePicture,currentMode,recording,image_icon, recordVideo,shutterButtonAction})=>{
    return(<View style={cameraStyle.botControls}>
            <TouchableOpacity style={cameraStyle.flipButton}>
              <Image source={cameraSetting_icon} style={[cameraStyle.icon, { width: 50, height: 50 }]} />
            </TouchableOpacity>
    
    
            <TouchableOpacity onPress={toggleCameraMode}>
              <Text style={cameraStyle.cameraMode} >{(currentMode === "picture")? "picture":"video"}</Text>
            </TouchableOpacity>
    
    
            <TouchableOpacity style={cameraStyle.outerCircle} onPress={shutterButtonAction} >
              <Text style={[cameraStyle.innerCircle, {backgroundColor: currentMode === "picture"? "white": "red"},
                {width: recording && currentMode==='video'? 30:60},
                {height: recording && currentMode==='video'? 30:60}]} > </Text>
            </TouchableOpacity>
            <TouchableOpacity >
            </TouchableOpacity>
            <TouchableOpacity style={cameraStyle.flipButton}>
              <Image source={{ uri: image_icon }} style={[cameraStyle.icon, { width: 70, height: 70 }]} />
            </TouchableOpacity>
          </View>)
}