import { View, Text, Image,StyleSheet,TouchableOpacity,AppState } from 'react-native';
import { useEffect, useState } from "react";
import TripData from '../../../app-core/local_data/local_trip_data';
import { MaterialIcons } from '@expo/vector-icons'; // For the arrow icon
import { TripService } from '../../../backend/trip/trip_service';
import { TripDataService } from '../../../backend/storage/trip';
export const CurrentTripBox = ()=>{
    const tripService = new TripService()
    const tripDataService = new TripDataService()
    const[currentState,setCurrentState] =useState(AppState.currentState);
    const[curesntTripName,setCurrentTripName] = useState(null)
    const[tripImageCover,setTripImageCover] = useState(null)
    useEffect(()=>{
      // const updateImage ={
      //   update(uri){
      //     console.log("uri",uri)
      //     setTripImageCover(uri)
      //   }
      // }
      // tripDataService.attach(updateImage,"trip_image");

      (async()=>{
        const tripStatus = await tripDataService.getTripStatus()

        if (tripStatus ==='true'){
        tripService.init_trip_properties()
        }
        const state = AppState.addEventListener('change' ,nextState=>{
        setCurrentState(nextState)
        });
        // await location_logic();
        tripService.startGPSWatch(currentState);
        return () => state.remove();
      
      })()
       
      
      // appState()
        // return ()=>tripDataService.detach(updateImage,"trip_image")
    })
    return (
        <View style={styles.wrapper}>
    <View style={styles.card}>
      {/* Background layer */}
      <View style={styles.background} />

      {/* Image */}
      {/* <Image source={imageSource} style={styles.image} /> */}

      {/* LIVE badge */}
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>• LIVE</Text>
        </View>

      {/* Arrow button */}
      <TouchableOpacity style={styles.arrowButton}>
        <MaterialIcons name="arrow-forward-ios" size={20} color="white" />
      </TouchableOpacity>

      {/* City name */}
      <Text style={styles.tripName}>{TripData.trip_name}</Text>
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
    width: '100%',
    height: 120,
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
