import BottomSheet, { BottomSheetScrollView,BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Trip from'../backend/trip/trip.js'
import TripHandler from "../app-core/flow/trip_handler.js";
import {mainScreenStyle} from '../styles/main_screen_styles.js'
import { useRef, useState,useMemo, useEffect, use } from "react";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity,Text ,ScrollView} from "react-native";
import {  StyleSheet,View,Image } from 'react-native';
import { OverlayCard } from "./auth.js";
import { authStyle } from "../styles/auth_style.js";
import { NewTripFiller } from "./functions/add_new_trip.js";
import { CurrentTripHeader } from "./map_box/components/current_trip_bar.js";
import { navigate } from "./custom_function/navigationService.js";
import TripDataService from "../backend/storage/trip.js";
import UserDataService from'../backend/storage/user.js'
import { DATA_KEYS } from "../backend/storage/storage_keys.js";
import { renderTrips } from "./custom_components/trip_label.js";
const default_user_image = require('../../assets/image/profile_icon.png')
export const UserDataBottomSheet = ({ 
  set_show_profile_picker,
  userId, 
  userDisplayName 
}) => {  const bottomSheetRef = useRef(null);

    const snapPoints = useMemo (()=>['20%','95%'],[])
    const [trip_name, set_trip_name] = useState(null)
    const [imageUri,setImageUri] =useState(null)
    const [show_create_trip_filler, set_show_create_trip_filler] = useState(false)
    const[isOnATrip,setIsOnATrip] =useState(null)
    const[trips,setTrips] = useState(null)
    const [userProfileImage, setUserProfileImage] = useState(UserDataService.getProfileImageUri())
    useEffect(()=>{
      const fetch_trips = async()=>{
        const tripss = TripDataService.getTripsData ()
        console.log('trips',tripss)
        setTrips(tripss)
      }
      fetch_trips()
      const update_state ={
        update(newState){
        setIsOnATrip(newState)
      }
      }
      
      const update_user_image={
        update(uri){
          setUserProfileImage(uri)
        }
      }

      const update_trips ={
        update(trips){
          setTrips(trips)
        }
      }

      TripDataService.attach(update_state,DATA_KEYS.TRIP.TRIP_STATUS)
      TripDataService.attach(update_trips,DATA_KEYS.TRIP.ALL_TRIP)
      UserDataService.attach(update_user_image,DATA_KEYS.USER.USER_AVATAR)
      return ()=>{
        TripDataService.detach(update_state,DATA_KEYS.TRIP.TRIP_STATUS)
        TripDataService.detach(update_trips,DATA_KEYS.TRIP.ALL_TRIP)
        UserDataService.detach(update_user_image,DATA_KEYS.USER.USER_AVATAR)

      }

    },[])
    
    
    const new_trip_filler = ()=>{
       set_show_create_trip_filler(true)
    }
    const profile_picker =()=>{
      set_show_profile_picker(true)
    }
    const handleTripPress=()=>{

    }
    

    const request_new_trip = async()=>{
      const res = await TripHandler.requestNewTripHandler(trip_name,imageUri? imageUri:null)
      console.log("respond",res)
      if (res){
        console.log("successfully")
        set_show_create_trip_filler(false)
        await TripDataService.setTripStatus('true')
        await TripDataService.setTripImageCover(imageUri)
        setImageUri(null)
      }
      return
      // navigate('Main')
    }
    return (

        <BottomSheet
        ref={bottomSheetRef}
        index={0}  
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: '#2b2a2aff' }}
        handleIndicatorStyle={{ backgroundColor: '#0e0c0cff' }}
        
      >
        

        {/* bottom sheet user infos */}
        <View style={styles.content}>
        <TouchableOpacity onPress={profile_picker}>
          <View style={mainScreenStyle.profilePic}>
            <Image
              style={{ width: '90%', height: '90%', borderRadius: 40 }}
              source={userProfileImage ? { uri: userProfileImage } : default_user_image}
            />
          </View>
        </TouchableOpacity>

        <Text style={mainScreenStyle.displayname}>{userDisplayName}</Text>
      </View>
              
        <View style={mainScreenStyle.curentTripZone}>
          <View style={mainScreenStyle.row}>
            <Text style={mainScreenStyle.title}>All Trip</Text>

            {!isOnATrip && (
              <TouchableOpacity
                style={mainScreenStyle.button}
                onPress={new_trip_filler}
              >
                <Text style={mainScreenStyle.buttonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Make trips scrollable so it doesn’t push user info away */}
            {renderTrips(trips, handleTripPress)}
        </View>
       {/* {showCurrentTrip&&()} */}
        {/* <View style={mainScreenStyle.alltrip}>
          <Text style={mainScreenStyle.allTripTitle}>Browse All Trip</Text>
        </View> */}
         {/* {showAllTrips&&()} */}
        {/* Extra bottom padding so last content isn’t hidden behind toolbar */}
        <View style={{ height: 80 }} />

        

        {/* filer for new trip */}
        {show_create_trip_filler&&
        <NewTripFiller set_show_create_trip_filler ={set_show_create_trip_filler} set_trip_name={set_trip_name} request_new_trip={request_new_trip} setImageUri={setImageUri} imageUri={imageUri}/>}

      </BottomSheet>
     
    )
}
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
    // position:'absolute',
    padding: 30,
    flexDirection: 'row',
    backgroundColor:'#3d3b3bff',
    borderRadius:20
  },
  currentTripHeaderOverlay: {
    position: 'absolute',
    top: -20, // distance from top of BottomSheet
    left: 20,
    right: 20,
    zIndex: 20, // make sure it floats above everything
  },

});