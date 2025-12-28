import { TouchableOpacity,Text,View } from "react-native"
import { cameraStyle } from "../../../styles/camera_style"
const CatureOption = ({toggleCameraMode,currentMode})=>{
    return( 
    <View style ={cameraStyle.captureMode}>
        <TouchableOpacity onPress={toggleCameraMode}>
              <Text style={cameraStyle.cameraMode} >{(currentMode === "picture")? "picture":"video"}</Text>
            </TouchableOpacity>
            </View>)
}

export default CatureOption