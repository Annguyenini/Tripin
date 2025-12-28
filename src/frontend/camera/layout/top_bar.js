import { View, Text, TouchableOpacity,Image } from 'react-native';

import { cameraStyle } from "../../../styles/camera_style"
const TopBarCamera =({facing,setFacing,flash,setFlash,toggleFlash,exitCamera,image_flash_icon})=>{
    return (
      <View style={cameraStyle.top_wrapper}>
    <View style={cameraStyle.top_shape}>
      <View style={cameraStyle.topControls}>
        <TouchableOpacity style={cameraStyle.flipButton} onPress={exitCamera}>
            <Text style={cameraStyle.buttonText}>X</Text>
        </TouchableOpacity>
      </View>
    </View></View>)
}

export default TopBarCamera