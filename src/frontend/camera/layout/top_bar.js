import { View, Text, TouchableOpacity } from "react-native";
import { topCameraBarStyle } from "../../../styles/camera_top_bar";
import { cameraStyle } from "../../../styles/camera_style";

const TopBarCamera = ({
  exitCamera,
  cameraPermission,
  requestcameraPermission,
  albumPermission,
  requestAlbumPermission,
  microphonePermission,
  requestMicrophonePermission,
}) => {
  const needsCamera = !cameraPermission?.granted;
  const needsMic = !microphonePermission?.granted;
  const needsAlbum = !albumPermission?.granted;

  return (
    <View style={topCameraBarStyle.top_wrapper}>
      <View style={topCameraBarStyle.top_shape}>
        <View style={topCameraBarStyle.topControls}>
          {/* Exit Button */}
          <TouchableOpacity
            style={topCameraBarStyle.flipButton}
            onPress={exitCamera}
          >
            <Text style={topCameraBarStyle.buttonText}>←</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Permission requests */}
      {(needsCamera || needsMic || needsAlbum) && (
        <View style={cameraStyle.permissionRow}>
          {needsCamera && (
            <TouchableOpacity
              style={cameraStyle.permissionButton}
              onPress={requestcameraPermission}
            >
              <Text style={cameraStyle.permissionButtonText}>Allow Camera</Text>
            </TouchableOpacity>
          )}
          {needsMic && (
            <TouchableOpacity
              style={cameraStyle.permissionButton}
              onPress={requestMicrophonePermission}
            >
              <Text style={cameraStyle.permissionButtonText}>
                Allow Microphone
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default TopBarCamera;
