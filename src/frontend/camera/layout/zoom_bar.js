import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image ,PanResponder} from 'react-native';
import { cameraStyle,camera_zoom } from '../../../styles/camera_style.js';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue,configureReanimatedLogger,ReanimatedLogLevel, } from 'react-native-reanimated';
import { runOnJS,scheduleOnRN } from 'react-native-worklets';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
const CameraZoomLayout=({callZooming})=>{
  const zoom_mode_list = [0,1,1.6,2,3,5];
  let curIndex = useSharedValue(2)
const Zoom_mode_gesture = Gesture.Pan()
  .onEnd((e) => {
    'worklet'; // mark as worklet

    let zoomMode;
    const value = e.translationX;

    if (value >= 30) {
      curIndex.value = Math.min(curIndex.value + 1, zoom_mode_list.length - 1);
      zoomMode = zoom_mode_list[curIndex.value];
      scheduleOnRN(callZooming, zoomMode); // <-- run on JS thread
    } else if (value <= -30) {
      curIndex.value = Math.max(curIndex.value - 1, 0);
      zoomMode = zoom_mode_list[curIndex.value];
      scheduleOnRN(callZooming, zoomMode); // <-- run on JS thread
    }

    // runOnJS(console.log)("Gesture Ended", value); // log on JS thread
  });

    // [onSwap] // Only depend on onSwap now

    return(
        <GestureDetector gesture={Zoom_mode_gesture}>
            <View style ={camera_zoom.zoom_mode_zone}>
            {zoom_mode_list.map((mode, index) =>{
                return(
                <View key={index} style={index === curIndex.value? camera_zoom.curent_zoom_mode_overlay : camera_zoom.zoom_mode_overlay}>
                <Text key={index} style={index === curIndex.value? camera_zoom.current_zoom_text_mode : camera_zoom.zoom_text} >
                    {mode}
                </Text>
                </View>
                )
            })}
            </View>       

        </GestureDetector>
    
        )
}

export default CameraZoomLayout