import React, { useState, useRef, useCallback, useEffect,useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { Camera, useCameraDevice,useCameraFormat } from 'react-native-vision-camera'
import Animated, { useSharedValue, clamp,useDerivedValue } from "react-native-reanimated"
import { useCameraPermissions } from 'expo-camera';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';

const AnimatedCamera = Animated.createAnimatedComponent(Camera)

import { cameraStyle } from '../../styles/camera_style.js';
import CameraService from '../../backend/camera/camera_functions.js'
import { navigate } from '../custom_function/navigationService.js';
import AlbumService from '../../backend/album/albumdb.js';

import TopBarCamera from './layout/top_bar.js'
import PermissionLayout from './layout/permission.js';
import BotBarControl from './layout/bot_bar.js';
import ZoomText from './layout/zoom_text.js';
import useCameraCapture from './camera_setting/use_camera_capture.js';
import useCameraZoom from './camera_setting/use_camera_zoom.js';
import CameraSetting from './layout/camera_setting_bar.js';
// import {microphonePermission} from 'expo-audio'
import { Audio } from 'expo-av'
import HorizontalSlider from './layout/vertical_slider.js'
const { width, height } = Dimensions.get('window');

const exitCamera = () => navigate('Main');

export const CameraApp = () => {
    const cameraRef = useRef(null);

    // permissions
    const [cameraPermission, requestcameraPermission] = useCameraPermissions();
    const [albumPermission, requestAlbumPermission] = MediaLibrary.usePermissions();
    const [hasMicrophonePermission, requestMicrophonePermission] = Audio.usePermissions()
    // camera device
    const [facing, setFacing] = useState('back');
    const device = useCameraDevice(facing, {
        physicalDevices: ['ultra-wide-angle-camera', 'wide-angle-camera', 'telephoto-camera']
    })
    const [flash, setFlash] = useState('auto');
    const [isCameraReady, setCameraReady] = useState(false)
    // album
    const [image_icon, setImage_icon] = useState(null)
    const [imageIconType, setImageIconType] = useState(null)
    // capture
    const {currentMode, toggleCameraMode, recording,shutterButtonAction} = useCameraCapture(cameraRef,isCameraReady,flash)
    // zoom
    const {onZoom,onZoomEnd,zoom,zoomText} = useCameraZoom(device)

    // exposure
    const [exposure,setExposure]= useState(0)
    // format
    const format = useCameraFormat(device,[
        {fps:60}
    ])

    useEffect(() => {
        const fetchImages = async () => {
            setImage_icon(AlbumService.AlbumsArray[0].uri)
            setImageIconType(AlbumService.AlbumsArray[0].mediaType)
        }
        const updateImages = {
            update(newArray) {
                setImage_icon(newArray[0].uri)
                setImageIconType(newArray[0].mediaType)
            }
        }
        AlbumService.attach(updateImages)
        fetchImages()
        return () => AlbumService.detach(updateImages)
    }, [])


    const onCameraReady = useCallback(() => {
        setCameraReady(true)
    }, [])

    // gesture pinch
    const zoomPinch = Gesture.Pinch()
        .onUpdate(onZoom)
        .onEnd(onZoomEnd)

    return (
        <View style={cameraStyle.container}>

            <PermissionLayout
                cameraPermission={cameraPermission}
                requestcameraPermission={requestcameraPermission}
                albumPermission={albumPermission}
                requestAlbumPermission={requestAlbumPermission}
                microphonePermission={hasMicrophonePermission}
                requestMicrophonePermission={requestMicrophonePermission}
            />


            <GestureDetector gesture={zoomPinch}>
                <View style={{ flex: 1 }}>
                    <AnimatedCamera
                        ref={cameraRef}
                        device={device}
                        isActive={true}
                        style={{ flex: 1 }}
                        zoom={zoom}
                        onInitialized={onCameraReady}
                        photo={true}
                        video={true}
                        audio={true}
                        exposure={exposure}
                    />
                </View>
            </GestureDetector>

            <TopBarCamera
               
                exitCamera={exitCamera}
            />
            <CameraSetting 
                 flash={flash}
                setFlash={setFlash}
                facing={facing}
                setFacing={setFacing}/>
            <View style={cameraStyle.middleBar}>
                <ZoomText zoom={zoomText/10} />
            </View>
            <HorizontalSlider value={exposure} onChange={setExposure} min={device.minExposure} max={device.maxExposure} label={'exposure'}/>

            <View>
                <BotBarControl
                    toggleCameraMode={toggleCameraMode}
                    shutterButtonAction={shutterButtonAction}
                    currentMode={currentMode}
                    recording={recording}
                    image_icon={image_icon}
                    type={imageIconType}
                />
            </View>

        </View>
    )
}