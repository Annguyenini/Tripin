import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {Trip} from'../backend/trip/trip.js'
import {mainScreenStyle} from '../styles/main_screen_styles.js'
import { useRef, useState,useMemo, useEffect } from "react";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity,Text } from "react-native";
import {  StyleSheet,View,Image } from 'react-native';
import { OverlayCard } from "./auth.js";
import { authStyle } from "../styles/auth_style.js";
import { NewTripFiller } from "./functions/add_new_trip.js";
import { CurrentTripHeader } from "./functions/current_trip_bar.js";
import { navigate } from "./custom_function/navigationService.js";
import { TripDataService } from "../backend/storage/trip.js";

const trip_data_service = new TripDataService()
export const UserDataBottomSheet = ({ 

  userId, 
  userDisplayName 
}) => {  const bottomSheetRef = useRef(null);

    const snapPoints = useMemo (()=>['20%','95%'],[])
    const [trip_name, set_trip_name] = useState(null)
    const [show_create_trip_filler, set_show_create_trip_filler] = useState(false)
    const trip_service = new Trip();
    const[isOnATrip,setIsOnATrip] =useState(null)
    useEffect(()=>{
      const update_state ={
        update(newState){
        setIsOnATrip(newState)
      }
    }
      trip_data_service.attach(update_state,'status')

      return ()=>trip_data_service.detach(update_state,'status')
    },[])
    
    
    const new_trip_filler = ()=>{
       set_show_create_trip_filler(true)
    }

    const request_new_trip = async()=>{
      const res = await trip_service.requestNewTrip(trip_name)
      console.log("respond",res)
      if (res){
        set_show_create_trip_filler(false)
        trip_data_service.setTripStatus('true')
      }
      return
      // navigate('Main')
    }
    return (

        <BottomSheet
        ref={bottomSheetRef}
        index={1} // start closed
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: '#2b2a2aff' }}
        handleIndicatorStyle={{ backgroundColor: '#0e0c0cff' }}
        
      >
        

        {/* bottom sheet user infos */}
        <BottomSheetScrollView contentContainerStyle={styles.content}>
        {/* <Image source={userProfilePic}/> */}
        
        <View style = {mainScreenStyle.profilePic}><Image/></View>
        <Text style ={mainScreenStyle.displayname}>{userDisplayName}</Text>
        <TouchableOpacity>
          <Text></Text>
        </TouchableOpacity>
        {/* <Text style={mainScreenStyle.userId}>{userId}</Text> */}
        </BottomSheetScrollView>
        
        <View style={mainScreenStyle.curentTripZone}>
          <View style={mainScreenStyle.row}>
            <Text style={mainScreenStyle.title}>Current Trip</Text>
            {!isOnATrip&& 
            (<TouchableOpacity style={mainScreenStyle.button} onPress={new_trip_filler}>
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



        {/* filer for new trip */}
        {show_create_trip_filler&&
        <NewTripFiller show_create_trip_filler={show_create_trip_filler} set_show_create_trip_filler ={set_show_create_trip_filler} set_trip_name={set_trip_name} request_new_trip={request_new_trip} />}

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