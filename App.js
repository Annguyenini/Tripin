
import React, { useState,useEffect } from 'react';
import { AuthScreen, loginWithAccessToken} from './src/frontend/auth.js';
import {MainScreen} from './src/frontend/mainscreen.js'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { navigationRef } from './src/frontend/custom_function/navigationService.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MachineState from './src/app-core/state_control/machine_state.js'
import { navigate } from './src/frontend/custom_function/navigationService.js';
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
import {CameraApp} from './src/frontend/camera/camera_main.js'
import { SettingScreen } from './src/frontend/setting_screen.js';
import { Loading } from './src/frontend/custom_components/loading.js';
import Trip from './src/backend/trip/trip.js';
const backgroundImage = require('./assets/image/main_background.png');
const logo = require('./assets/image/main_logo.png');
const { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();


export default function App() {

  const [loaded,setLoaded] = useState(false)
  const [font]=useFonts({
    mainfont: require('./assets/fonts/font2.otf'),
  });
  const [machineState,setMachineState]= useState(null)
    useEffect(() => {
      const checkToken = async () => {
        const status = await loginWithAccessToken();
        if (!status){
          setLoaded(true)
        }
      };
      checkToken();
      const machine_state={
        update(state) {
          console.log(state)
          if(state ==='READY'){
            setMachineState(true)
            setTimeout(()=>{
              navigate('Main')
              setLoaded(true)
            },1000)
          }
        }
      }
      
     
    MachineState.attach(machine_state)
  
  return ()=>MachineState.detach(machine_state)

  }, []);
  if (!font) return null;
 

  return (
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

        {!loaded &&<Loading></Loading>}
      <NavigationContainer  ref={navigationRef}>
          <Stack.Navigator>
            <Stack.Screen name="auth" component={AuthLayout}   options={{ headerShown: false }} // ← hides the "Auth" text
/>
{machineState && <><Stack.Screen name="Main" component={MainLayout}   options={{ headerShown: false, gestureEnabled:false, presentation:'card',animation:'none' }} // ← hides the "Auth" tet
/>  
            <Stack.Screen name="Setting" component={SettingLayout}   options={{ headerShown: false, gestureEnabled:false, presentation:'card',animation:'none' }} // ← hides the "Auth" text
/>  
            <Stack.Screen name ="Camera" component={CameraLayout} options={{headerShown: false}}/>
            </>}
          
          </Stack.Navigator>
        </NavigationContainer>


    {/* <AuthScreen/> */}
      {/* </ImageBackground>sas
      </ScrollView> */}
    {/* </SafeAreaProvider> */}
    </View>
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
function MainLayout() {
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
