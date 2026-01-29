import { StyleSheet,TouchableOpacity,Image,Text,FlatList } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { tripCardsStyle } from "../../styles/function/tripcards";
import marker_subject from "../map_box/functions/marker_subject";
import trip_contents_handler from "../../app-core/flow/trip_contents_handler";
import TripSelectedSubject from "../map_box/functions/trip_selected_subject";
const default_image = require('../../../assets/icon.png')

export const TripCard = ({ trip }) => {
  const pressHandler = async (trip)=>{
    console.log('trip_id',trip.id)
    console.log('trip_d',trip)

    marker_subject.setTripId(trip.id)
    TripSelectedSubject.set(TripSelectedSubject.EVENTS.IS_SELECTED,true)
    TripSelectedSubject.set(TripSelectedSubject.EVENTS.TRIP_ID,trip.id)
    TripSelectedSubject.set(TripSelectedSubject.EVENTS.TRIP_DATA,trip)
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

