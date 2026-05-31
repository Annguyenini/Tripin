import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  Modal,
  Share,
  View,
} from "react-native";
import { tripCardsStyle } from "../../../../styles/function/tripcards";
import TripDisplayObserver from "../../observers/trip_display_observer";
import CurrentTripDataService from "../../../../backend/storage/hot_data/current_trip";
import TripCustomCard from "./trip_custom_card";
import { useState } from "react";
import TripHandler from "../../../../app-core/flow/handlers/trip_handler";
import { MaterialIcons } from "@expo/vector-icons";
import { UseOverlay } from "../../../overlay/overlay_main";
const default_image = require("../../../../../assets/icon.png");

export const TripCard = ({ trip, navigateMain, removeTripLabel }) => {
  const [optionVisible, setOptionVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const { showErrorBox, hideErrorBox, showLoading, hideLoading } = UseOverlay();
  const pressHandler = async (trip) => {
    navigateMain();
    if (trip.trip_id === CurrentTripDataService.getCurrentTripId()) return;
    // await trip_contents_handler.requestTripCoordinatesHandler(trip.id)
    const trip_data = await TripHandler.requestTripDataHandler(trip.trip_id);
    TripDisplayObserver.setTripSelected(trip_data);
    return;
  };
  const requestTripLink = async () => {
    const { url } = await TripHandler.requestSharedTripLink(trip.trip_id);
    // console.log(url);
    await Share.share({
      message: "Check out my trip!",
      url: url, // iOS only
    });
  };
  const requestRemove = async (trip) => {
    showLoading();
    setDeleteVisible(false);
    // console.log(trip, CurrentTripDataService.getCurrentTripId());
    if (trip.trip_id === CurrentTripDataService.getCurrentTripId()) {
      hideLoading();
      showErrorBox(
        "Failed to remove trip",
        "Can not remove the active trip, make sure to end it first!",
        3600,
      );
      return;
    }
    let respond;
    try {
      respond = await TripHandler.requestRemoveTrip(trip.trip_id);
      if (!respond.status) {
        hideLoading();
        showErrorBox("Failed to remove trip", respond.message, 3600);
        return;
      }
      hideLoading();
    } catch (err) {
      console.error(err);
    } finally {
      removeTripLabel(trip);
      hideLoading();
      showErrorBox("Failed to remove trip", respond.message, 3600);
    }
    return;
  };

  return (
    <TouchableOpacity
      style={tripCardsStyle.tripCard}
      onPress={() => pressHandler(trip)}
      activeOpacity={0.8}
    >
      <View style={tripCardsStyle.tripImageView}>
        <Image
          source={trip.image ? { uri: trip.image } : default_image}
          style={tripCardsStyle.tripImage}
        />
        <Text style={tripCardsStyle.tripTitle}>{trip.trip_name}</Text>

        <TouchableOpacity
          style={tripCardsStyle.tripCardMenu}
          onPress={() => setOptionVisible(true)}
        >
          <Text style={tripCardsStyle.tripCardMenuText}>···</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tripCardsStyle.tripCardDelete}
          onPress={() => setDeleteVisible(true)}
        >
          <MaterialIcons name="delete" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={tripCardsStyle.sharedCardMenu}
          onPress={requestTripLink}
        >
          <Text style={tripCardsStyle.tripCardMenuText}>📤</Text>
        </TouchableOpacity>
        {optionVisible && (
          <Modal>
            <TripCustomCard
              trip={trip}
              onClose={setOptionVisible}
            ></TripCustomCard>
          </Modal>
        )}
        {
          <Modal visible={deleteVisible} transparent animationType="fade">
            <View style={tripCardsStyle.backdrop}>
              <View style={tripCardsStyle.card}>
                <Text style={tripCardsStyle.warning}>⚠</Text>
                <Text style={tripCardsStyle.title}>Are you sure?</Text>
                <Text style={tripCardsStyle.body}>
                  ALL data (EVERYTHING) will be gone from your memories forever.
                </Text>

                <View style={tripCardsStyle.btnRow}>
                  <TouchableOpacity
                    style={[tripCardsStyle.btn, tripCardsStyle.btnNo]}
                    onPress={() => setDeleteVisible(false)}
                  >
                    <Text style={tripCardsStyle.btnNoText}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[tripCardsStyle.btn, tripCardsStyle.btnYes]}
                    onPress={() => requestRemove(trip)}
                  >
                    <Text style={tripCardsStyle.btnYesText}>Yes, delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        }
      </View>
    </TouchableOpacity>
  );
};
