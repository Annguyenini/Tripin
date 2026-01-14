import { StyleSheet,TouchableOpacity,Image,Text,FlatList } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { tripCardsStyle } from "../../styles/function/tripcards";
export const TripCard = ({ trip, onPress }) => {
  return (
    <TouchableOpacity
      style={tripCardsStyle.tripCard}
      onPress={() => onPress(trip)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: trip.image }}
        style={tripCardsStyle.tripImage}
      />
      <Text style={tripCardsStyle.tripTitle}>
        {trip.trip_name}
      </Text>
    </TouchableOpacity>
  );
};

