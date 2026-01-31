import { StyleSheet,TouchableOpacity,Image,Text,FlatList } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { tripCardsStyle } from "../../styles/function/tripcards";
import trip_contents_handler from "../../app-core/flow/trip_contents_handler";
import TripSelectedSubject from "../map_box/functions/trip_selected_subject";
import TripDisplayObserver from "../map_box/functions/trip_display_observer";
import CurrentTripDataService from '../../backend/storage/current_trip'
const default_image = require('../../../assets/icon.png')

export const TripCard = ({ trip }) => {
  const pressHandler = async (trip)=>{
    if(trip.id === CurrentTripDataService.getCurrentTripId()) return 
    TripDisplayObserver.setTripState(true,false,trip,trip.id)
    await trip_contents_handler.requestTripCoordinatesHandler(trip.id)
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

