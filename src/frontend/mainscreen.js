import React, { useMemo, useState,useRef, useEffect, useCallback } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

import {Image} from 'react-native'
import { View, TouchableOpacity, Text,Button, TextInput,Alert, StyleSheet, Dimensions } from 'react-native';
import {mainScreenStyle,footer} from '../styles/main_screen_styles.js'
// import { Button } from 'react-native-web';
import { navigate } from './custom_function/navigationService.js';
// import { Color } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';
import { LocationPermission } from './functions/location_permision.js';
import { UserDataBottomSheet } from './bottom_sheet.js';
// import Subject from './logics/observer.js'
// import UserData from '../app-core/local_data/local_user_data.js'
import UserDataService from '../../src/backend/storage/user.js'
import {ProfileImagePicker} from'./custom_components/profile_image_picker.js'
import { AppState } from 'react-native';
import { startForegroundGPSTracker,endForegroundGPSTracker } from '../backend/gps_logic/foreground_gps_logic.js';
import CurrenTripDataService from '../backend/storage/current_trip.js'
import GPSLogic from '../backend/gps_logic/gps_logic.js';
const homeIcon = require('../../assets/image/home_icon.png')
const cameraIcon = require('../../assets/image/camera_icon.png')
const galleryIcon = require('../../assets/image/gallery_icon.png')
const settingIcon = require('../../assets/image/setting_icon.png')
import { MapBoxLayout } from './map_box/map_box_layout.js';
import { DATA_KEYS } from '../backend/storage/keys/storage_keys.js';


export const MainScreen = () =>{
  console.log('render main')
  const [user_id, setUserId] = useState(UserDataService.getUserId())
  const [user_name, setUsername ] = useState(UserDataService.getUserName())
  const [display_name,setDisplayName] = useState(UserDataService.getDisplayName())
  const isUserDataReady = useRef(false)
  // const user_id = useRef(null)
  // const user_name =useRef(null)
  // const display_name =useRef(null)
  const[show_profile_picker,set_show_profile_picker] =useState(false)
  const [state, setState] = useState(AppState.currentState)
  const [CurrentTripStatus,setCurrentTripStatus]=useState(CurrenTripDataService.getCurrentTripStatus())
  const gpsTask = useRef(null)
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      const update_status={
        update(newStatus){
          setCurrentTripStatus(newStatus)
        }
      }
      CurrenTripDataService.attach(update_status,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
      return ()=> CurrenTripDataService.detach(update_status,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
    }, []);
// app state tracker
  useEffect(()=>{
    const backgroundGPSTask =async()=>{
      if(!CurrentTripStatus) {
        await GPSLogic.endGPSLogic()
        return
      }
      await GPSLogic.startGPSLogic()
    }
    backgroundGPSTask()
  },[CurrentTripStatus])
  
  useEffect(()=>{

    const initGps= async()=>{
      gpsTask.current = await startForegroundGPSTracker()
    }
    initGps()
    const getState = AppState.addEventListener('change' ,nextState=>{
      // if(state ===nextState) return
        setState(nextState)
        if(nextState ==='active'){
          if(!gpsTask.current){
            gpsTask.current = startForegroundGPSTracker()
          }
        }
        else{
          endForegroundGPSTracker()
          gpsTask.current =(null)
        }
      });
      return ()=>{
        getState.remove()
        gpsTask.current =(null)
        endForegroundGPSTracker()
      }
  },[])
  console.log(state)
 
  // useEffect(async()=>{
  //   console.log(state)
  // },[state])

  const callCamera= ()=>{
    const res = navigate("Camera");
  }
  const callSetting =()=>{
    const res = navigate("Setting");
  } 
  const callAlbum =()=>{
    const res = navigate('Album')
  }
  const RenderMap = useCallback(()=>{
    return(<MapBoxLayout></MapBoxLayout>)
  },[])
    return(
      
      <View style={styles.container}> 
      <LocationPermission></LocationPermission>
      
      {RenderMap()
      }
      {
      <UserDataBottomSheet  userId={user_id} userDisplayName = {display_name} set_show_profile_picker={set_show_profile_picker}/>
      }
      <View style={footer.footerContainer}>
        <View style={footer.fotterrow}>
        <TouchableOpacity style={footer.fotterbutton}>
            <Image source = {homeIcon} style ={footer.fottericon}/>
        </TouchableOpacity>
        <TouchableOpacity style={footer.fotterbutton} onPress={callCamera} >
            <Image source = {cameraIcon} style ={footer.fottericon}/>
        </TouchableOpacity>
        <TouchableOpacity style={footer.fotterbutton} onPress={callAlbum}>
            <Image source = {galleryIcon} style ={footer.fottericon}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={callSetting}>
            <Image source={settingIcon} style={footer.settingIcon} />
          </TouchableOpacity>
      </View>
        </View>
        {show_profile_picker && <View style ={mainScreenStyle.overlay}><ProfileImagePicker set_show_profile_picker ={set_show_profile_picker}>
          </ProfileImagePicker></View>}
    </View>   
    )
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    justifyContent: 'center',
    width:'100%',
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
  },
  content: {
    padding: 30,
    flexDirection: 'row',
    backgroundColor:'#3d3b3bff',
    borderRadius:20
  },
   overlay: {
    position: 'absolute', // absolutely positioned over the map
    left: 10, // distance from left
    right: 10, // distance from right
    zIndex: 10, // ensures it's on top
  },
});