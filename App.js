
import React, { useState,useEffect,useRef } from 'react';
import { AuthScreen} from './src/frontend/auth.js';
import {MainScreen} from './src/frontend/mainscreen.js'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './src/frontend/custom_function/navigationService.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
import { useFonts } from 'expo-font';
import {styles} from './src/styles/style.js'
import{mainScreenStyle} from './src/styles/main_screen_styles.js'
import {CameraApp} from './src/frontend/camera/camera_main.js'
import { SettingScreen } from './src/frontend/setting_screen.js';
import AppFlow from './src/app-core/flow/app_flow.js'
import AlbumScreen from './src/frontend/albums/album.js';
import { OverLayProvider } from './src/frontend/overlay/overlay_main.js';
const backgroundImage = require('./assets/image/main_background.png');
const logo = require('./assets/image/main_logo.png');
const { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();

export default function App() {
  const [authentication,setAuthentication] =useState(false)
  const [font]=useFonts({
    mainfont: require('./assets/fonts/font2.otf'),
  });
  
  if (!font) return null;
 

  return (
    <OverLayProvider>
    <View style={{flex:2}}>
    {/* <SafeAreaProvider> */}
      {/* <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
          <Image source={logo} style={styles.logo} />
      
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Auth" component={AuthScreen} />
          </Stack.Navigator>
        </NavigationContainer> */}
      {/* {!authentication&&<AuthLayout setAuthentication ={setAuthentication}></AuthLayout>} */}
       <NavigationContainer  ref={navigationRef}>
          <Stack.Navigator>
            <Stack.Screen name="auth" component={AuthLayout}   options={{ headerShown: false }} />
            <Stack.Screen name="Main" component={MainLayout}   options={{ headerShown: false, gestureEnabled:false, presentation:'card',animation:'none' }} // ← hides the "Auth" tet
/>  
            <Stack.Screen name="Setting" component={SettingLayout}   options={{ headerShown: false, gestureEnabled:false, presentation:'card',animation:'none' }} // ← hides the "Auth" text
/>  
            <Stack.Screen name ="Camera" component={CameraLayout} options={{headerShown: false}}/>
            <Stack.Screen name ='Album' component={AlbumLayout} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
          

    {/* <AuthScreen/> */}
      {/* </ImageBackground>sas
      </ScrollView> */}
    {/* </SafeAreaProvider> */}
    </View>
    </OverLayProvider>
  );
}

function AuthLayout() {
  return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <Image source={logo} style={styles.logo} />
        <AuthScreen />
      </ImageBackground>
  );
}
const MainLayout =()=> {
  console.log('render1')
  return (
      <ImageBackground source={backgroundImage} style={mainScreenStyle.backgroundImage}>
        <Image source={logo} style={mainScreenStyle.logo} />
        <MainScreen />
      </ImageBackground>
  );
}
function CameraLayout(){
  return(
    <GestureHandlerRootView style={{ flex: 1 }}>

      <CameraApp />
      </GestureHandlerRootView>

  )
}

function SettingLayout(){
  return(
      <ImageBackground source={backgroundImage} style={mainScreenStyle.backgroundImage}>
        <Image source={logo} style={mainScreenStyle.logo} />
        <SettingScreen />
      </ImageBackground>
  )
}
function AlbumLayout(){
  return(
      <ImageBackground source={backgroundImage} style={mainScreenStyle.backgroundImage}>
        <Image source={logo} style={mainScreenStyle.logo} />
        <AlbumScreen />
      </ImageBackground>
  )
}
