import { useSharedValue } from "react-native-reanimated"


const MAX_ZOOM = Math.min(device?.maxZoom ?? 1, 10) // clamp to realistic value
const MIN_ZOOM = device?.minZoom ?? 1
const NEUTRAL_ZOOM = device?.neutralZoom ?? 1

const useCameraDeviceSetup =()=>{

    const zoom = useSharedValue(NEUTRAL_ZOOM)
    const lastZoom = useSharedValue(NEUTRAL_ZOOM)
    
}