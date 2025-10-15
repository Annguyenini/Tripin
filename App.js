import React, { useState,useEffect } from 'react';
import { AuthScreen, loginWithAccessToken} from './src/frontend/auth.js';
import {MainScreen} from './src/frontend/mainscreen.js'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { navigationRef } from './src/frontend/navigationService';
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
import {styles} from './src/styles/style.js'
import{mainScreenStyle} from './src/styles/main_screen_styles.js'
import{cameraStyle} from './src/styles/camera_style.js'
import {CameraApp} from './src/frontend/camera_layout.js'
const backgroundImage = require('./assets/image/main_background.png');
const logo = require('./assets/image/main_logo.png');
const { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();

export default function App() {

  const [loaded] = useFonts({
    mainfont: require('./assets/fonts/font2.otf'),
  });
    useEffect(() => {
     const checkToken = async () => {
    await loginWithAccessToken();
    setLoading(false);
  };
  checkToken();
  }, []);
  if (!loaded) return null;

  return (
    <View style={{flex:1}}>
    <SafeAreaProvider>
      {/* <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
          <Image source={logo} style={styles.logo} />
      
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Auth" component={AuthScreen} />
          </Stack.Navigator>
        </NavigationContainer> */}
      <NavigationContainer  ref={navigationRef}>
          <Stack.Navigator>
            <Stack.Screen name="auth" component={AuthLayout}   options={{ headerShown: false }} // ← hides the "Auth" text
/>
            <Stack.Screen name="Main" component={MainLayout}   options={{ headerShown: false }} // ← hides the "Auth" text
/>
            <Stack.Screen name ="Camera" component={CameraLayout} options={{headerShown: false}}/>
          </Stack.Navigator>
        </NavigationContainer>


    {/* <AuthScreen/> */}
      {/* </ImageBackground>
      </ScrollView> */}
    </SafeAreaProvider>
    </View>
  );
}

function AuthLayout() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <Image source={logo} style={styles.logo} />
        <AuthScreen />
      </ImageBackground>
    </ScrollView>
  );
}
function MainLayout() {
  return (
    <ScrollView contentContainerStyle={mainScreenStyle.scrollContent} showsVerticalScrollIndicator={false}>
      <ImageBackground source={backgroundImage} style={mainScreenStyle.backgroundImage}>
        <Image source={logo} style={mainScreenStyle.logo} />
        <MainScreen />
      </ImageBackground>
    </ScrollView>
  );
}
function CameraLayout(){
  return(
    <View style={cameraStyle.container}>
        <CameraApp/>
    </View>
  )
}
