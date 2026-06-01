import { View, TouchableOpacity, Text, TextInput, Image } from "react-native";
import { tripStyle } from "../../../../styles/function/trip_style";
import { OverlayCard } from "../../../overlay/overlay_card";
import {
  imagePicker,
  takePicture,
} from "../../../custom_components/image_picker";
import { useState } from "react";
import { TrackingModePicker } from "../tracking_modes/tracking_mode_picker";
import { TRACKING_MODE } from "../../../../backend/tracking/tracking_mode";
import Setting from "../../../../app-core/setting";
import { UseOverlay } from "../../../overlay/overlay_main";
import TripActionsHandler from "../../../../app-core/flow/handlers/trip_actions/trip_action_handler";

export const NewTripFiller = ({ set_show_create_trip_filler }) => {
  const [tripName, setTripName] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [alert, setAlert] = useState(null);
  const { showLoading, hideLoading, showErrorBox } = UseOverlay();
  const CreateTripShowLoading = () => {
    return showLoading(["Checking Trip Nameeeeee", "Almost there", "Nananana"]);
  };
  const CreateTripHideLoading = () => {
    return hideLoading();
  };
  const callImagePicker = async () => {
    const pic = await imagePicker();
    setImageUri(pic.assets[0].uri);
  };
  const callCamera = async () => {
    const pic = await takePicture();
    setImageUri(pic.assets[0].uri);
  };
  const requestHandler = async () => {
    let res = null;
    try {
      if (!tripName) {
        setAlert("Trip name couldn't be empty!");
        return;
      }
      set_show_create_trip_filler(false);

      CreateTripShowLoading();
      res = await TripActionsHandler.requestNewTripHandler(
        tripName,
        imageUri ?? null,
      );
    } catch (err) {
      console.error(err);
    } finally {
      CreateTripHideLoading();
    }
    if (!res) {
      showErrorBox("Error Creating Trip", "failed", 6000);
    } else if (res.status !== 200) {
      showErrorBox("Error Creating Trip", res.data.message, 6000);
    }
  };
  const trackingModeHandler = async (mode) => {
    if (mode === "normal") {
      await Setting.setTrackingMode(TRACKING_MODE.NORMAL);
    } else {
      await Setting.setTrackingMode(TRACKING_MODE.MEDIAS_ONLY);
    }
  };
  return (
    <OverlayCard
      title="Create New Trip"
      onClose={() => set_show_create_trip_filler(false)}
    >
      {alert && <Text style={{ fontSize: 12, color: "red" }}>{alert}</Text>}
      <View style={tripStyle.imageFrame}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={tripStyle.image} />
        ) : (
          <Text style={tripStyle.placeholder}>
            No image (recomment rotate your phone){" "}
          </Text>
        )}
      </View>

      <View style={tripStyle.imageButtons}>
        <TouchableOpacity
          style={tripStyle.secondaryButton}
          onPress={callImagePicker}
        >
          <Text style={tripStyle.secondaryButtonText}>Choose Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tripStyle.secondaryButton}
          onPress={callCamera}
        >
          <Text style={tripStyle.secondaryButtonText}>Take Picture</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Enter your trip name!"
        onChangeText={(text) => setTripName(text)}
        style={tripStyle.input}
      />
      <TrackingModePicker
        value={"media_only"}
        onChange={trackingModeHandler}
      ></TrackingModePicker>
      <TouchableOpacity style={tripStyle.submitButton} onPress={requestHandler}>
        <Text style={tripStyle.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </OverlayCard>
  );
};
