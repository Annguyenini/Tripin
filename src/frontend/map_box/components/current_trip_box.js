import { View, Text, Image,StyleSheet,TouchableOpacity,AppState } from 'react-native';
import { useEffect, useState } from "react";
import CurrentTripDataService from '../../../backend/storage/current_trip'
import { DATA_KEYS } from '../../../backend/storage/keys/storage_keys';
import {currentTripBoxStyle} from '../../../styles/function/current_trip_box_style';
const default_image = require('../../../../assets/icon.png')
export const CurrentTripBox = ({isMinimize})=>{
    const[tripImageCover,setTripImageCover] = useState(CurrentTripDataService.getCurrentTripImageUri())
    const[tripName,setTripName]=useState(CurrentTripDataService.getCurrentTripName())
    useEffect(()=>{
      const updateTripData={
        update(newTripData){
          if (!newTripData) return
          const newName = newTripData.trip_name
          const newImage = newTripData.image
          setTripName(newName)
          setTripImageCover(newImage)
        }
      }
      CurrentTripDataService.attach(updateTripData,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA);
      return ()=>CurrentTripDataService.detach(updateTripData,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA);

    },[])
    return (
        <View style={currentTripBoxStyle.wrapper}>
    <View style={[currentTripBoxStyle.card]}>
      {/* Background layer */}
      <View style={currentTripBoxStyle.background} />

      {/* Image */}
      <Image source={ tripImageCover ? {uri:tripImageCover} :{uri:default_image}} style={[currentTripBoxStyle.image]} />

      {/* LIVE badge */}
        <View style={currentTripBoxStyle.liveBadge}>
          <Text style={currentTripBoxStyle.liveText}>• Current Trip</Text>
        </View>

      {/* Arrow button */}
      {/* <TouchableOpacity style={currentTripBoxStyle.arrowButton}>
        <MaterialIcons name="arrow-forward-ios" size={20} color="white" />
      </TouchableOpacity> */}

      {/* City name */}
      <Text style={currentTripBoxStyle.tripName}>{tripName}</Text>
    </View>
    </View>
  );
};


