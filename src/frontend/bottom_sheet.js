import BottomSheet, { BottomSheetScrollView,BottomSheetFlatList,BottomSheetView } from "@gorhom/bottom-sheet";
import TripHandler from "../app-core/flow/trip_handler.js";
import { useRef, useState,useMemo, useEffect, use } from "react";
import { TouchableOpacity,Text ,ScrollView} from "react-native";
import {  StyleSheet,View,Image } from 'react-native';
import { NewTripFiller } from "./functions/add_new_trip.js";
import TripDataService from "../backend/storage/trips.js";
import CurrentTripDataService from '../backend/storage/current_trip.js'
// import TripData
import UserDataService from'../backend/storage/user.js'
import { DATA_KEYS } from "../backend/storage/keys/storage_keys.js";
import {TripCard } from "./custom_components/trip_label.js";
import { tripCardsStyle } from "../styles/function/tripcards.js";
import AppFlow from "../app-core/flow/app_flow.js";
import { TestScreen } from "../test_screen.js";
import TripDisplayObserver from "./map_box/functions/trip_display_observer.js";
import { Loading } from "./custom_components/loading.js";
const default_user_image = require('../../assets/image/profile_icon.png')
export const UserDataBottomSheet = ({ 
  set_show_profile_picker,
  userId, 
  userDisplayName,
  loading
}) => {  const bottomSheetRef = useRef(null);

    const snapPoints = useMemo (()=>['20%','95%'],[])
    const [trip_name, set_trip_name] = useState(null)
    const [imageUri,setImageUri] =useState(null)
    const [show_create_trip_filler, set_show_create_trip_filler] = useState(false)
    const[isOnATrip,setIsOnATrip] =useState(null)
    const[trips,setTrips] = useState(null)
    const [userProfileImage, setUserProfileImage] = useState()
    const [testScreen,setTestScreen] = useState(false)
    useEffect(()=>{
      const fetch_avatar = async ()=>{
        const avatar =  UserDataService.getProfileImageUri()
        setUserProfileImage(avatar)
      }
      fetch_avatar()
      // const fetch_trips = async()=>{
      //   const tripss = TripDataService.getAllTripsList()
      //   setTrips(tripss)
      // }
      // fetch_trips()
      const callbackRenderSuccessfully = async()=>{
        await AppFlow.onRenderUserData()

      }
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
      // const update_snapPoint={
      //   update(data){
      //     bottomSheetRef.current === 0 
      //   }
      // }

      CurrentTripDataService.attach(update_state,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
      TripDataService.attach(update_trips,DATA_KEYS.TRIP.ALL_TRIP_LIST)
      UserDataService.attach(update_user_image,DATA_KEYS.USER.USER_AVATAR)
      // TripDisplayObserver.attach(update_snapPoint,TripDisplayObserver.EVENTS)
      callbackRenderSuccessfully()
      return ()=>{
        CurrentTripDataService.detach(update_state,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
        TripDataService.detach(update_trips,DATA_KEYS.TRIP.ALL_TRIP_LIST)
        UserDataService.detach(update_user_image,DATA_KEYS.USER.USER_AVATAR)
        // TripDisplayObserver.detach(update_snapPoint,TripDisplayObserver.EVENTS)

      }

    },[])
    
    
    const new_trip_filler = ()=>{
       set_show_create_trip_filler(true)
    }
    const profile_picker =()=>{
      set_show_profile_picker(true)
    }

    const testScreenHandler=()=>{
      setTestScreen(prev => prev ===true ? false:true)
      console.log(testScreen)
    }
    const refresh_user_trips=async()=>{
      await TripHandler.refreshAllTripsData()
    }
    const request_new_trip = async()=>{
      loading(true)
      const res = await TripHandler.requestNewTripHandler(trip_name,imageUri? imageUri:null)
      if (res){
        set_show_create_trip_filler(false)
        // await TripDataService.setTripStatus('true')
        // await TripDataService.setTripImageCover(imageUri)
        setImageUri(null)
      }
      loading(false)

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
        <BottomSheetFlatList
        
              data={trips}
              keyExtractor={(item) => 
                item.id.toString()}
              numColumns={2}
              columnWrapperStyle={tripCardsStyle.row}
              renderItem={({ item }) => (
                <TripCard trip={item} />
              )}
              showsVerticalScrollIndicator={false}

               ListHeaderComponent={
              <>

              {/*userdata*/}
              <View style={styles.userCard}>
          <TouchableOpacity onPress={profile_picker}>
            <Image
              source={userProfileImage ? { uri: userProfileImage } : default_user_image}
              style={styles.avatar}
            />
          </TouchableOpacity>

          <Text style={styles.displayName}>
            {userDisplayName}
          </Text>
          <TouchableOpacity onPress={testScreenHandler}>
            <Text style={{color:'red'}}>
              test
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Trips</Text>
          <TouchableOpacity style ={styles.addBtn} onPress={refresh_user_trips}>
            <Text >↺</Text>
          </TouchableOpacity>
          {!isOnATrip && (
            <TouchableOpacity onPress={new_trip_filler} style={styles.addBtn}>
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
              </>
               }

        contentContainerStyle={{ paddingBottom: 80 }}

            />
               
        {show_create_trip_filler&&
        <NewTripFiller set_show_create_trip_filler ={set_show_create_trip_filler} set_trip_name={set_trip_name} request_new_trip={request_new_trip} setImageUri={setImageUri} imageUri={imageUri}/>}
        {testScreen && <TestScreen testScreenHandler={testScreenHandler}></TestScreen>}
      </BottomSheet>

    )
}
const styles = StyleSheet.create({container: {
  padding: 16,
},

/* User Card */
userCard: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  padding: 16,
  backgroundColor: '#3d3b3bff',
  borderRadius: 20,
  marginBottom: 16,
},

avatar: {
  width: 56,
  height: 56,
  borderRadius: 28,
},

displayName: {
  fontSize: 18,
  fontWeight: '600',
  color: '#fff',
},

/* Section Header */
sectionHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  paddingHorizontal: 8,
  marginBottom: 8,
},

sectionTitle: {
  fontSize: 20,
  fontWeight: '600',
  color: '#fff',
},

addBtn: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#ffffff',
  alignItems: 'center',
  justifyContent: 'center',
},

addText: {
  fontSize: 20,
  color: '#000000',
},

/* List */
listContainer: {
  width: '100%',
  paddingBottom:200,
},
})
