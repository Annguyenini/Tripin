import React, { useMemo, useState,useRef, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

import {Image} from 'react-native'
import { View, TouchableOpacity, Text,Button, TextInput,Alert, StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {mainScreenStyle,footer} from '../styles/main_screen_styles.js'
// import { Button } from 'react-native-web';
import { navigate } from './navigationService.js';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {UserDataService} from "../backend/userdata.js"
// import { Color } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';
const userDataServive = new UserDataService();
const homeIcon = require('../../assets/image/home_icon.png')
const cameraIcon = require('../../assets/image/camera_icon.png')
const galleryIcon = require('../../assets/image/gallery_icon.png')

// const fetchUserData = async()=>{
//   // const userProfilePic = await userDataServive.getUserProfilePic();
//   // const userDisplayName = await userDataServive.getUserDisplayName ();
//   // const userId = await userDataServive.getUserId();
//   // ///all trips is a dictionary
//   // let currentTrip = await userDataServive.getCurrentTrip();
//   // let allTrip = await userDataService.getAllTrips();
// }

export const MainScreen = () =>{
  // const isCurrentTripActive = currentTrip.get("status") ? setIsOnAtrip(true) : setIsOnAtrip(false);

  const userId = userDataServive.getUserId();
  const userDisplayName = userDataServive.getDisplayName ();
  console.log(userDisplayName)
  const [isOnATrip, setIsOnAtrip] = useState(false);

    useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }, []);
  const callCamera= ()=>{
  const res = navigate("Camera");
}

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo (()=>['20%','95%'],[])
 

    return(
      <View style={styles.container}>    

      <BottomSheet
        ref={bottomSheetRef}
        index={1} // start closed
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: '#2b2a2aff' }}
        handleIndicatorStyle={{ backgroundColor: '#0e0c0cff' }}

      >
        <BottomSheetScrollView contentContainerStyle={styles.content}>
        {/* <Image source={userProfilePic}/> */}
        <View style = {mainScreenStyle.profilePic}><Image/></View>
        <Text style ={mainScreenStyle.displayname}>{userDisplayName}</Text>
        {/* <Text style={mainScreenStyle.userId}>{userId}</Text> */}
        </BottomSheetScrollView>
        <View style={mainScreenStyle.curentTripZone}>
          <View style={mainScreenStyle.row}>
            <Text style={mainScreenStyle.title}>Current Trip</Text>
            {!isOnATrip&& 
            (<TouchableOpacity style={mainScreenStyle.button}>
              <Text style={mainScreenStyle.buttonText}>+</Text>
            </TouchableOpacity>)
            }
          </View>
        </View>
       {/* {showCurrentTrip&&()} */}
        <View style={mainScreenStyle.alltrip}>
          <Text style={mainScreenStyle.allTripTitle}>Browse All Trip</Text>
        </View>
         {/* {showAllTrips&&()} */}
        {/* Extra bottom padding so last content isn’t hidden behind toolbar */}
        <View style={{ height: 80 }} />
      </BottomSheet>
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
      </View>
        </View>
    </View>   
//         <SafeAreaProvider>
//   <SafeAreaView style={{ flex: 1 }}>
//     <View style={mainScreenStyle.container}>

//       {/* Scrollable content */}
//       <ScrollView contentContainerStyle={mainScreenStyle.scrollContent}>
      //   <View style={mainScreenStyle.curentTripZone}>
      //     <View style={mainScreenStyle.row}>
      //       <Text style={mainScreenStyle.title}>Current Trip</Text>
      //       <TouchableOpacity style={mainScreenStyle.button}>
      //         <Text style={mainScreenStyle.buttonText}>+</Text>
      //       </TouchableOpacity>
      //     </View>
      //   </View>
      //  {/* {showCurrentTrip&&()} */}
      //   <View style={mainScreenStyle.alltrip}>
      //     <Text style={mainScreenStyle.allTripTitle}>Browse All Trip</Text>
      //   </View>
      //    {/* {showAllTrips&&()} */}
      //   {/* Extra bottom padding so last content isn’t hidden behind toolbar */}
      //   <View style={{ height: 80 }} />
//       </ScrollView>

//       {/* Sticky bottom toolbar — outside ScrollView */}
    //   <View style={footer.footerContainer}>
    //     <View style={footer.fotterrow}>
    //     <TouchableOpacity style={footer.fotterbutton}>
    //         <Image source = {homeIcon} style ={footer.fottericon}/>
    //     </TouchableOpacity>
    //     <TouchableOpacity style={footer.fotterbutton} onPress={callCamera} >
    //         <Image source = {cameraIcon} style ={footer.fottericon}/>
    //     </TouchableOpacity>
    //     <TouchableOpacity style={footer.fotterbutton}>
    //         <Image source = {galleryIcon} style ={footer.fottericon}/>
    //     </TouchableOpacity>
    //   </View>
    //     </View>
    // </View>
//   </SafeAreaView>
// </SafeAreaProvider>

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