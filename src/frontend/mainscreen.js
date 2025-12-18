import React, { useMemo, useState,useRef, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { UserDataTrip } from '../backend/userdatas/userdata_trip.js';
import {Image} from 'react-native'
import { View, TouchableOpacity, Text,Button, TextInput,Alert, StyleSheet, Dimensions } from 'react-native';
import {mainScreenStyle,footer} from '../styles/main_screen_styles.js'
// import { Button } from 'react-native-web';
import { navigate } from './custom_function/navigationService.js';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {UserDataService} from "../backend/userdatas/user.js"
// import { Color } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';
import { LocationPermission } from './functions/location_permision.js';
import { UserDataBottomSheet } from './bottom_sheet.js';
import {CurrentTripBar} from'./functions/current_trip_header.js'
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

  const [user_id, setUserId] = useState(null)
  const [user_name, setUsername ] = useState(null)
  const [display_name,setDisplayName] = useState(null)

  const [isOnATrip, setIsOnAtrip] = useState(false);
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    async function fetch_userdata(){
      const userdata = await userDataService.getUserData()
      setUserId(userdata.user_id)
      setUsername(userdata.user_name)
      setDisplayName(userdata.display_name)

    }
    fetch_userdata()
  }, []);

  const callCamera= ()=>{
    const res = navigate("Camera");
  }
  const callSetting =()=>{
    const res = navigate("Setting");
  } 

    return(
      
      <View style={styles.container}> 
      <LocationPermission></LocationPermission>
      <MapBoxLayout style={{ height: '70%' }} isOnAtrip={isOnATrip}></MapBoxLayout>
      

      <UserDataBottomSheet isOnATrip={isOnATrip} setIsOnATrip ={setIsOnAtrip} userId={user_id} userDisplayName = {display_name}/>
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