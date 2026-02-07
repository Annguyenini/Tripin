import { View, Text, TouchableOpacity } from 'react-native';
import { topCameraBarStyle } from '../../../styles/camera_top_bar';

const TopBarCamera = ({ flash, setFlash, exitCamera, facing, setFacing }) => {
  return (
    <View style={topCameraBarStyle.top_wrapper}>
      <View style={topCameraBarStyle.top_shape}>
        <View style={topCameraBarStyle.topControls}>
          {/* Exit Button */}
          <TouchableOpacity style={topCameraBarStyle.flipButton} onPress={exitCamera}>
            <Text style={topCameraBarStyle.buttonText}>←</Text>
          </TouchableOpacity>

          {/* Flip Camera Button */}
          <TouchableOpacity
            style={topCameraBarStyle.flipButton}
            onPress={() => setFacing(prev => (prev === 'back' ? 'front' : 'back'))}
          >
            <Text style={topCameraBarStyle.buttonText}>⟲</Text>
          </TouchableOpacity>

          {/* ⚡︎ Text with Overlay Button */}
          <View style={topCameraBarStyle.flashWrapper}>
            {/* Lightning as Text */}
            <Text style={topCameraBarStyle.lightningText}>⚡︎</Text>

            {/* Invisible Button Overlay */}
            <TouchableOpacity
              style={topCameraBarStyle.flashOverlayButton}
              onPress={() => setFlash(prev => (prev === 'off' ? 'on' : 'off'))}
            >
              <Text style={topCameraBarStyle.overlayText}>{flash === 'on' ? "_____" :''}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TopBarCamera;