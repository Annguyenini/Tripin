import { View,Text } from "react-native"
import { camera_zoom } from "../../../styles/camera_style"
const ZoomText=({zoom})=>{
    return(
    <View style={camera_zoom.centeredZoom}>
                <Text style={camera_zoom.currentZoomText}>{(zoom * 10).toFixed(1)}</Text>
            </View>
            )
}
export default ZoomText