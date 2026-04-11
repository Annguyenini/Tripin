import { StyleSheet, TouchableOpacity, Image, Text, FlatList, Modal, Share } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { tripCardsStyle } from "../../styles/function/tripcards";
import trip_contents_handler from "../../app-core/flow/trip_contents_handler";
import TripDisplayObserver from "../map_box/functions/trip_display_observer";
import CurrentTripDataService from '../../backend/storage/current_trip'
import CurrentDisplayTripMediaObserver from "../map_box/functions/current_display_media_observer";
import Albumdb from "../../backend/album/albumdb";
import TripCustomCard from "./trip_custom_card";
import { useState } from "react";
import TripHandler from "../../app-core/flow/trip_handler";
const default_image = require('../../../assets/icon.png')

export const TripCard = ({ trip, navigateMain }) => {
  const [optionVisible, setOptionVisible] = useState(false)
  const pressHandler = async (trip) => {
    navigateMain()
    if (trip.id === CurrentTripDataService.getCurrentTripId()) return
    // await trip_contents_handler.requestTripCoordinatesHandler(trip.id)
    TripDisplayObserver.setTripSelected(trip)
    return
  }
  const requestTripLink = async () => {
    const { url } = await TripHandler.requestSharedTripLink(trip.trip_id)
    console.log(url)
    await Share.share({
      message: 'Check out my trip!',
      url: url,  // iOS only
    })
  }
  return (
    <TouchableOpacity
      style={tripCardsStyle.tripCard}
      onPress={() => pressHandler(trip)}
      activeOpacity={0.8}
    >
      <Image
        source={trip.image ? { uri: trip.image } : default_image}
        style={tripCardsStyle.tripImage}
      />
      <Text style={tripCardsStyle.tripTitle}>
        {trip.trip_name}
      </Text>

      <TouchableOpacity style={tripCardsStyle.tripCardMenu}
        onPress={() => setOptionVisible(true)}>
        <Text style={tripCardsStyle.tripCardMenuText}>···</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tripCardsStyle.sharedCardMenu}
        onPress={requestTripLink}>
        <Text style={tripCardsStyle.tripCardMenuText}>📤</Text>
      </TouchableOpacity>
      {optionVisible &&
        <Modal>
          <TripCustomCard trip={trip} setOptionVisible={setOptionVisible}></TripCustomCard>
        </Modal>
      }
    </TouchableOpacity>

  );
};

