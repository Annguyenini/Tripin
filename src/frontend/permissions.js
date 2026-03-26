import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Linking, Animated, Easing
} from 'react-native';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import app_flow from '../app-core/flow/app_flow';
import { Modal } from 'react-native';
import PermissionStorage from '../backend/storage/settings/permissions';
const STEPS = [
  {
    emoji: '📍',
    title: 'Where You At?',
    description: "We're a map-based app — kinda useless without knowing where you are. Like a compass with no north.",
    required: true,
    skipLabel: null,
  },
  {
    emoji: '🛰️',
    title: 'Stay With Us?',
    description: "Background location lets us track your trip while you're busy living it. We respect your privacy — deny this and the app still works, just less automagically.",
    required: false,
    skipLabel: 'Nah, I\'ll manage',
  },
  {
    emoji: '📸',
    title: 'Say Cheese',
    description: "No camera, no memories. Pretty hard to build a travel app without it. We promise not to photograph you mid-yawn.",
    required: true,
    skipLabel: null,
  },
  {
    emoji: '🖼️',
    title: 'The Photo Vault',
    description: "We need access to save your shots to the album. Deny this and photos still save — just to our app folder, not your gallery. Your call.",
    required: false,
    skipLabel: 'App folder is fine',
  },
];

export default function PermissionsFlowScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [denied, setDenied] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [step, denied]);

  useEffect(() => {
    requestPermission()
    if (step === STEPS.length) {
      PermissionStorage.setInitSettings('true')
      app_flow.onPermissionReady();
    }
  }, [step]);

  const requestPermission = async () => {
    setDenied(false);

    try {
      const permission = await PermissionStorage.getInitSettingPer()
      if(permission==='true')setStep(STEPS.length)
      switch (step) {
        case 0: {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') return setDenied(true);
          setStep(s => s + 1);
          break;
        }
        case 1: {
          const { status } = await Location.requestBackgroundPermissionsAsync();
          if (status !== 'granted') return setDenied(true);
          setStep(s => s + 1);
          break;
        }
        case 2: {
          const { status } = await Camera.requestCameraPermissionsAsync();
          if (status !== 'granted') return setDenied(true);
          setStep(s => s + 1);
          break;
        }
        case 3: {
          await MediaLibrary.requestPermissionsAsync();
          // not checking status — app handles limited/denied gracefully
          setStep(s => s + 1);
          break;
        }
      }
    } catch (e) {
      console.error('Permission error:', e);
    }
  };

  const skip = () => {
    setDenied(false);
    setStep(s => s + 1);
  };

  if (step >= STEPS.length) return null;

  const current = STEPS[step];

  return (
    
    <View style={styles.container}>
      {/* Progress dots */}
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotDone]}
          />
        ))}
      </View>

      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.emoji}>{current.emoji}</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.description}>{current.description}</Text>

        {denied && (
          <View style={styles.deniedBox}>
            <Text style={styles.deniedText}>
              {current.required
                ? "This one's non-negotiable — the app genuinely can't work without it."
                : "No worries, we get it. You can always change this later in Settings."}
            </Text>
            {current.required && (
              <TouchableOpacity style={styles.settingsBtn} onPress={() => Linking.openSettings()}>
                <Text style={styles.settingsBtnText}>Open Settings</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Animated.View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.primaryBtnText}>
            {denied ? 'Try Again' : 'Allow'}
          </Text>
        </TouchableOpacity>

        {!denied && current.skipLabel && (
          <TouchableOpacity style={styles.skipBtn} onPress={skip}>
            <Text style={styles.skipBtnText}>{current.skipLabel}</Text>
          </TouchableOpacity>
        )}

        {denied && !current.required && (
          <TouchableOpacity style={styles.skipBtn} onPress={skip}>
            <Text style={styles.skipBtnText}>Skip anyway</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0c0a',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 28,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: '#3a3835',
  },
  dotActive: {
    backgroundColor: '#f0f0ec',
    width: 24,
  },
  dotDone: {
    backgroundColor: '#6b6860',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'PermanentMarker',
    fontSize: 32,
    color: '#f0f0ec',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontFamily: 'DMMono',
    fontSize: 15,
    color: '#a09e99',
    textAlign: 'center',
    lineHeight: 24,
  },
  deniedBox: {
    marginTop: 28,
    backgroundColor: '#1a1917',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2e2c29',
    alignItems: 'center',
    gap: 12,
  },
  deniedText: {
    fontFamily: 'DMMono',
    fontSize: 13,
    color: '#a09e99',
    textAlign: 'center',
    lineHeight: 20,
  },
  settingsBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0ec',
    borderRadius: 8,
  },
  settingsBtnText: {
    fontFamily: 'DMMono',
    fontSize: 13,
    color: '#0d0c0a',
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#f0f0ec',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  primaryBtnText: {
    fontFamily: 'DMMono',
    fontSize: 16,
    color: '#0d0c0a',
    fontWeight: '700',
  },
  skipBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipBtnText: {
    fontFamily: 'DMMono',
    fontSize: 14,
    color: '#6b6860',
  },
});