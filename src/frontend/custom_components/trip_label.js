import { StyleSheet,TouchableOpacity,Image,Text,FlatList } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { tripCardsStyle } from "../../styles/function/tripcards";
import trip_contents_handler from "../../app-core/flow/trip_contents_handler";
import TripDisplayObserver from "../map_box/functions/trip_display_observer";
import CurrentTripDataService from '../../backend/storage/current_trip'
import CurrentDisplayTripMediaObserver from "../map_box/functions/current_display_media_observer";
import Albumdb from "../../backend/album/albumdb";
const default_image = require('../../../assets/icon.png')

export const TripCard = ({ trip }) => {
  const pressHandler = async (trip)=>{
    if(trip.id === CurrentTripDataService.getCurrentTripId()) return 
    // await trip_contents_handler.requestTripCoordinatesHandler(trip.id)
    TripDisplayObserver.setTripSelected(trip)
    return
  }
  return (
    <TouchableOpacity
      style={tripCardsStyle.tripCard}
      onPress={()=>pressHandler(trip)}
      activeOpacity={0.8}
    >
      <Image
        source={trip.image ? { uri: trip.image} : default_image }
        style={tripCardsStyle.tripImage}
      />
      <Text style={tripCardsStyle.tripTitle}>
        {trip.trip_name}
      </Text>
    </TouchableOpacity>
  );
};

