import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {Trip} from'../backend/trip/trip.js'
import {mainScreenStyle} from '../styles/main_screen_styles.js'
import { useRef, useState,useMemo } from "react";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity,Text } from "react-native";
import { UserDataService } from "../backend/userdatas/userdata.js";
import {  StyleSheet,View,Image } from 'react-native';
import { OverlayCard } from "./auth.js";
import { authStyle } from "../styles/auth_style.js";
import { NewTripFiller } from "./features/add_new_trip.js";
export const UserDataBottomSheet = ({ 
  isOnATrip, 
  setIsOnATrip, 
  userId, 
  userDisplayName 
}) => {  const bottomSheetRef = useRef(null);

    const snapPoints = useMemo (()=>['20%','95%'],[])
    const [trip_name, set_trip_name] = useState(null)
    const [show_create_trip_filler, set_show_create_trip_filler] = useState(false)
    const trip_service = new Trip();
    const new_trip_filler = ()=>{
       set_show_create_trip_filler(true)
    }    
    const request_new_trip =()=>{
      const res = trip_service.requestNewTrip(trip_name)
      if (!res){
        
      }
      setIsOnATrip(True)
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
        {show_create_trip_filler&&
        <NewTripFiller show_create_trip_filler={show_create_trip_filler} set_show_create_trip_filler ={set_show_create_trip_filler} set_trip_name={set_trip_name} request_new_trip={request_new_trip}/>}

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
});