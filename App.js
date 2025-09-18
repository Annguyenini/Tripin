import React, { useState } from 'react';
import { AuthScreen } from './src/fontend/auth.js';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  Dimensions,
  ScrollView
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {styles} from './src/fontend/style.js'
const backgroundImage = require('./assets/main_background.png');
const logo = require('./assets/main_logo.png');
const { width, height } = Dimensions.get('window');

export default function App() {
  const [loaded] = useFonts({
    mainfont: require('./assets/fonts/mainfont.otf'),
  });
  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
          <Image source={logo} style={styles.logo} />
          <AuthScreen/>
        </ImageBackground>
      </ScrollView>
    </SafeAreaProvider>
  );
}


