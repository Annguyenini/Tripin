import { useState, useCallback, useRef } from 'react'
import CameraService from '../../../backend/camera/camera_functions.js'
const useCameraCapture = (cameraRef, isCameraReady,flash) => {
    const [currentMode, setCurrentMode] = useState('picture')
    const [recording, setRecording] = useState(false)
    const photoOptions ={quality: 1, base64 :true}
    const toggleCameraMode = () => {
        setCurrentMode(prev => prev === 'picture' ? 'video' : 'picture')
    }

    const takePicture = async () => {
        photoOptions.flash = flash
        const photo = await CameraService.takePicture(cameraRef,photoOptions)
        if (photo) {
            setImageIcon(photo.path)
            setImageIconType('photo')
        }
    }

    const recordVideo = async () => {
        if (!isCameraReady || !cameraRef.current) return
        try {
            setRecording(true)
            await CameraService.recordVideo(cameraRef)
        } catch (err) {
            console.error('Recording error:', err)
            setRecording(false)
        }
    }

    const stopRecording = async () => {
        let asset
        try {
            if (recording) asset = await CameraService.stopRecording(cameraRef)
        } catch (err) {
            console.error('Stop recording error:', err)
        }
        setRecording(false)
        if (asset?.uri) {
            setImageIcon(asset.uri)
            setImageIconType('video')
        }
    }

    const shutterButtonAction = () => {
        if (!isCameraReady) return
        currentMode === 'picture' ? takePicture() : (!recording ? recordVideo() : stopRecording())
    }

    return {
        currentMode, toggleCameraMode,
        recording,shutterButtonAction, recordVideo, stopRecording
    }
}

export default useCameraCapture