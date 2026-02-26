import { View, Text, Image,StyleSheet,TouchableOpacity,AppState } from 'react-native';
import { useEffect, useState } from "react";
import CurrentTripDataService from '../../../backend/storage/current_trip'
import { DATA_KEYS } from '../../../backend/storage/keys/storage_keys';
import {currentTripBoxStyle} from '../../../styles/function/current_trip_box_style';
const default_image = require('../../../../assets/icon.png')
export const CurrentTripBox = ({isMinimize})=>{
    const[tripImageCover,setTripImageCover] = useState(null)
    useEffect(()=>{


      const get_trip_image=async()=>{
        const imageUri = CurrentTripDataService.getCurrentTripImageUri()
        console.log('image1',imageUri)
        setTripImageCover(imageUri)
      }
      const updateImage ={
        update(uri){
          setTripImageCover(uri)
        }
      }
      CurrentTripDataService.attach(updateImage,DATA_KEYS.TRIP.TRIP_IMAGE);
      get_trip_image()
        return ()=>CurrentTripDataService.detach(updateImage,DATA_KEYS.TRIP.TRIP_IMAGE)
    },[])
    return (
        <View style={currentTripBoxStyle.wrapper}>
    <View style={[currentTripBoxStyle.card]}>
      {/* Background layer */}
      <View style={currentTripBoxStyle.background} />

      {/* Image */}
      <Image source={ tripImageCover ? {uri:tripImageCover} :default_image} style={[currentTripBoxStyle.image]} />

      {/* LIVE badge */}
        <View style={currentTripBoxStyle.liveBadge}>
          <Text style={currentTripBoxStyle.liveText}>• Current Trip</Text>
        </View>

      {/* Arrow button */}
      {/* <TouchableOpacity style={currentTripBoxStyle.arrowButton}>
        <MaterialIcons name="arrow-forward-ios" size={20} color="white" />
      </TouchableOpacity> */}

      {/* City name */}
      <Text style={currentTripBoxStyle.tripName}>{CurrentTripDataService.getCurrentTripName()}</Text>
    </View>
    </View>
  );
};


