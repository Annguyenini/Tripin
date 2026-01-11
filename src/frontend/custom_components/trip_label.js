import { StyleSheet,TouchableOpacity,Image,Text,FlatList } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

const TripCard = ({ trip, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => onPress(trip)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: trip.image }}
        style={styles.tripImage}
      />
      <Text style={styles.tripTitle}>
        {trip.trip_name}
      </Text>
    </TouchableOpacity>
  );
};

export const renderTrips = (trips, onTripPress) => {
  console.log('trips',trips)
  if(!trips)return
  return (
    <BottomSheetFlatList
      data={trips}
      keyExtractor={(item) => 
        item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <TripCard trip={item} onPress={onTripPress} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};
const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  tripCard: {
    width: '48%',          // 2 per row
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111',
  },

  tripImage: {
    width: '100%',
    height: 120,
  },

  tripTitle: {
    paddingVertical: 8,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
