import React, { useMemo, useState,useRef, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { UserDataTrip } from '../backend/userdatas/userdata_trip.js';
import {Image} from 'react-native'
import { View, TouchableOpacity, Text,Button, TextInput,Alert, StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {mainScreenStyle,footer} from '../styles/main_screen_styles.js'
// import { Button } from 'react-native-web';
import { navigate } from './custom_function/navigationService.js';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {UserDataService} from "../backend/userdatas/userdata.js"
// import { Color } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';
import { LocationHandler } from '../backend/location_permision.js';
import { UserDataBottomSheet } from './bottom_sheet.js';
const homeIcon = require('../../assets/image/home_icon.png')
const cameraIcon = require('../../assets/image/camera_icon.png')
const galleryIcon = require('../../assets/image/gallery_icon.png')
const settingIcon = require('../../assets/image/setting_icon.png')
const userDataService = new UserDataService()
const userDataServiceTrip = new UserDataTrip()
import { MapBoxLayout } from './map_box/map_box_layout.js';
// const fetchUserData = async()=>{
//   const userProfilePic = await userDataService.getUserProfilePic();
//   const userDisplayName = await userDataService.getUserDisplayName ();
//   const userId = await userDataService.getUserId();
//   ///all trips is a dictionary
//   let currentTrip = await userDataService.getCurrentTrip();
//   let allTrip = await userDataService.getAllTrips();
// }

export const MainScreen = () =>{
  const userId = userDataService.getUserId();
  const userDisplayName = userDataService.getDisplayName ();
  const [isOnATrip, setIsOnAtrip] = useState(false);
    useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }, []);

  const callCamera= ()=>{
    const res = navigate("Camera");
  }
  const callSetting =()=>{
    const res = navigate("Setting");
  } 

    return(
      
      <View style={styles.container}>    
      <LocationHandler></LocationHandler>
      <MapBoxLayout></MapBoxLayout>
      
      <UserDataBottomSheet isOnATrip={isOnATrip} setIsOnATrip ={setIsOnAtrip} userId={userId} userDisplayName = {userDisplayName}/>
      <View style={footer.footerContainer}>
        <View style={footer.fotterrow}>
        <TouchableOpacity style={footer.fotterbutton}>
            <Image source = {homeIcon} style ={footer.fottericon}/>
        </TouchableOpacity>
        <TouchableOpacity style={footer.fotterbutton} onPress={callCamera} >
            <Image source = {cameraIcon} style ={footer.fottericon}/>
        </TouchableOpacity>
        <TouchableOpacity style={footer.fotterbutton}>
            <Image source = {galleryIcon} style ={footer.fottericon}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={callSetting}>
            <Image source={settingIcon} style={footer.settingIcon} />
          </TouchableOpacity>
      </View>
        </View>
    </View>   
    )
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    justifyContent: 'center',
    width:'95%',
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
});