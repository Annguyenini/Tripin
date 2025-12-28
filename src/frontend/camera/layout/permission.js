import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image ,PanResponder} from 'react-native';
import { cameraStyle,camera_zoom } from '../../../styles/camera_style';


const PermissionLayout=({cameraPermission,albumPermission, requestAlbumPermission,requestcameraPermission})=>{
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

export default PermissionLayout 