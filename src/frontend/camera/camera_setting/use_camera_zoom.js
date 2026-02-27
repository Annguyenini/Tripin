import { useEffect,useState,useCallback } from "react"
import { scheduleOnRN } from 'react-native-worklets';
import Animated, { useSharedValue, clamp,useDerivedValue } from "react-native-reanimated"

const useCameraZoom =(device)=>{
    const MIN_ZOOM = device?.minZoom ?? 1
    const MAX_ZOOM = Math.min(device?.maxZoom ?? 1, 10)
    const NEUTRAL_ZOOM = device?.neutralZoom ?? 1

    // zoom
    const zoom = useSharedValue(1)
    const lastZoom = useSharedValue(1)
    const [zoomText,setZoomText]= useState(1)
    useEffect(() => {
        if (device?.neutralZoom) {
            zoom.value = device.neutralZoom
            lastZoom.value = device.neutralZoom
        }
    }, [device?.neutralZoom])
    const onZoom = useCallback((event) => {
        'worklet'
        zoom.value = clamp(lastZoom.value * event.scale, MIN_ZOOM, MAX_ZOOM)
        scheduleOnRN(setZoomText,zoom.value)
        }, 
    [MIN_ZOOM, MAX_ZOOM])

    const onZoomEnd = useCallback(() => {
        'worklet'
        lastZoom.value = zoom.value
    }, [])
    return {onZoom,onZoomEnd,zoom,zoomText}
}
export default useCameraZoom