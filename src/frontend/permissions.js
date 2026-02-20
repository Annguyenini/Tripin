import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import app_flow from '../app-core/flow/app_flow';
export default function PermissionsFlowScreen({ navigation }) {
  const [step, setStep] = useState(0); // 0 = foreground, 1 = background, etc.
  const [message, setMessage] = useState('');

  useEffect(() => {
    requestNextPermission();
    const ready = async ()=>{
        await app_flow.onPermissionReady()
    }
    if(step ===4 ){
        ready()
    }
  }, [step]);

  const openSettings = () => {
    Linking.openSettings();
  };

  const requestNextPermission = async () => {
    try {
      switch (step) {
        case 0: {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') return setMessage('Foreground location denied. Please enable in settings.');
          setStep(1);
          break;
        }
        case 1: {
          const { status } = await Location.requestBackgroundPermissionsAsync();
          if (status !== 'granted') return setMessage('Background location denied. Please enable in settings.');
          setStep(2);
          break;
        }
        case 2: {
          const { status } = await Camera.requestCameraPermissionsAsync();
          if (status !== 'granted') return setMessage('Camera permission denied. Please enable in settings.');
          setStep(3);
          break;
        }
        case 3: {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== 'granted') return setMessage('Album permission denied. Please enable in settings.');
          setStep(4);
          break;
        }
        case 4: {
        //   Alert.alert('All permissions granted!', 'You can now use the app fully.');
          // navigation.navigate('NextScreen'); // optional
          break;
        }
        default:
          break;
      }
    } catch (e) {
      console.error('Error requesting permission:', e);
    }
  };

  if (message) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Permission Required</Text>
        <Text style={styles.msg}>{message}</Text>

        <Button
          title="Retry"
          onPress={() => {
            setMessage('');
            requestNextPermission();
          }}
        />

        <View style={{ height: 10 }} />

        <Button
          title="Open Settings"
          onPress={openSettings}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requesting Permissions...</Text>
      <Text style={styles.msg}>Step {step + 1} of 4</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  msg: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});
