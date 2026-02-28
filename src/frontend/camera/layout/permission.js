import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image ,PanResponder} from 'react-native';
import { cameraStyle,camera_zoom } from '../../../styles/camera_style';


const PermissionLayout = ({ cameraPermission, albumPermission, requestAlbumPermission, requestcameraPermission, microphonePermission, requestMicrophonePermission }) => {
    console.log(cameraPermission,albumPermission,microphonePermission)
    const allGranted = cameraPermission?.granted && albumPermission?.granted && microphonePermission?.granted
    if (allGranted) return null

    return (
        <View style={styles.wrapper}>
            {cameraPermission && !cameraPermission.granted && (
                <TouchableOpacity style={styles.button} onPress={requestcameraPermission}>
                    <Text style={styles.buttonText}>Allow Camera</Text>
                </TouchableOpacity>
            )}
            {albumPermission && !albumPermission.granted && (
                <TouchableOpacity style={styles.button} onPress={requestAlbumPermission}>
                    <Text style={styles.buttonText}>Allow Album</Text>
                </TouchableOpacity>
            )}
            {!microphonePermission && !microphonePermission.granted && (
                <TouchableOpacity style={styles.button} onPress={requestMicrophonePermission}>
                    <Text style={styles.buttonText}>Allow Microphone</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        zIndex: 999,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 16,
    },
    button: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    }
})

export default PermissionLayout 