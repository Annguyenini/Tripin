import { View, Text, Image,StyleSheet,TouchableOpacity,AppState } from 'react-native';
import { useEffect, useState } from "react";
import { MaterialIcons } from '@expo/vector-icons'; // For the arrow icon
import TripService from '../../../backend/gps_logic/gps_logic';
import CurrentTripDataService from '../../../backend/storage/current_trip'
import { DATA_KEYS } from '../../../backend/storage/keys/storage_keys';
export const CurrentTripBox = ()=>{
    const[currentState,setCurrentState] =useState(AppState.currentState);
    const[curesntTripName,setCurrentTripName] = useState(null)
    const[tripImageCover,setTripImageCover] = useState(null)
    useEffect(()=>{


      const get_trip_image=async()=>{
        const imageUri = CurrentTripDataService.getCurrentTripImageUri()
        setTripImageCover(imageUri)
      }
      const updateImage ={
        update(uri){
          setTripImageCover(uri)
        }
      }
      CurrentTripDataService.attach(updateImage,DATA_KEYS.TRIP.TRIP_IMAGE);
      const appState =async()=>{
        const tripStatus = CurrentTripDataService.getCurrentTripStatus()

        if (tripStatus ==='true'){
        TripService.init_trip_properties()
        }
        const state = AppState.addEventListener('change' ,nextState=>{
        setCurrentState(nextState)
        });
        // await location_logic();
        TripService.startGPSWatch(currentState);
        return () => state.remove();
      }
      get_trip_image()

      appState()
        return ()=>CurrentTripDataService.detach(updateImage,DATA_KEYS.TRIP.TRIP_IMAGE)
    })
    return (
        <View style={styles.wrapper}>
    <View style={styles.card}>
      {/* Background layer */}
      <View style={styles.background} />

      {/* Image */}
      <Image source={{uri:tripImageCover}} style={styles.image} />

      {/* LIVE badge */}
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>• LIVE</Text>
        </View>

      {/* Arrow button */}
      {/* <TouchableOpacity style={styles.arrowButton}>
        <MaterialIcons name="arrow-forward-ios" size={20} color="white" />
      </TouchableOpacity> */}

      {/* City name */}
      <Text style={styles.tripName}>{CurrentTripDataService.getCurrentTripName()}</Text>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
    wrapper:{position: "absolute",
    right: 0,
    top: "25%"
    },
  card: {
    width: 140,
    height: 180,
    // margin: 10,
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    top:450,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backgroundColor: '#f0f0f0', // light gray background
  },
  image: {
    width: '90%',
    top:10,
    height: 130,
    paddingBottom:1,
    borderRadius: 15,
  },
  liveBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'red',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  arrowButton: {
    position: 'absolute',
    right: 8,
    top: 50, // vertically center relative to image
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 4,
  },
  tripName: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
});
