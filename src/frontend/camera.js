import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { cameraStyle } from './style';

const { width, height } = Dimensions.get('window');

export const CameraApp = () => {
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    return (
      <View style={cameraStyle.container}>
        <Text style={cameraStyle.text}>
          {!permission ? 'Loading...' : 'Camera permission required'}
        </Text>
        {permission && !permission.granted && (
          <TouchableOpacity style={cameraStyle.button} onPress={requestPermission}>
            <Text style={cameraStyle.buttonText}>Allow Camera</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={cameraStyle.container}>
      <CameraView
        ref={cameraRef}
        style={{ position: 'absolute', top: 0, left: 0, width, height }}
        facing={facing}
      />
      
      <View style={cameraStyle.controls}>
        <TouchableOpacity 
          style={cameraStyle.flipButton} 
          onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
        >
          <Text style={cameraStyle.buttonText}>🔄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

