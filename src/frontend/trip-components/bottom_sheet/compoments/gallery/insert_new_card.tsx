import { useRef, useState } from "react";
import { OverlayCard } from "../../../../overlay/overlay_card";
import {
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";
import {
  imagePicker,
  takePicture,
  imageVideoPicker,
  photoVideoCamera,
} from "../../../../custom_components/image_picker";
import { UseOverlay } from "../../../../overlay/overlay_main";
import TripHandler from "../../../../../app-core/flow/handlers/trip_actions/trip_action_handler";
const InsertNewCard = ({ onClose }) => {
  const [content, setContent] = useState(null);
  let _imageChanged = useRef(false);
  const callImagePicker = async () => {
    const pic = await imageVideoPicker();
    _imageChanged.current = true;
    setContent(pic.assets[0].uri);
  };

  const callCamera = async () => {
    const pic = await photoVideoCamera();
    _imageChanged.current = true;

    setContent(pic.assets[0].uri);
  };
  const requestTripModify = async () => {
    onClose(false);
    // const update = await TripHandler.modifyTripDataHandler(
    //   trip.trip_id,
    //   new_name,
    //   _imageChanged.current ? tripImage : null,
    // );
  };
  return (
    <OverlayCard title={"Insert new card"} onClose={() => onClose(false)}>
      <View style={s.row}>
        <TouchableOpacity
          style={s.btnSecondary}
          onPress={callImagePicker}
          activeOpacity={0.75}
        >
          <Text style={s.btnSecondaryText}>📁 gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.btnSecondary}
          onPress={callCamera}
          activeOpacity={0.75}
        >
          <Text style={s.btnSecondaryText}>📷 camera</Text>
        </TouchableOpacity>
      </View>

      {/* save */}
      <TouchableOpacity
        style={s.btnPrimary}
        activeOpacity={0.8}
        onPress={requestTripModify}
      >
        <Text style={s.btnPrimaryText}>INSERT</Text>
      </TouchableOpacity>
    </OverlayCard>
  );
};
const s = StyleSheet.create({
  imageWrap: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#1a1a1a",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  imageOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  imageOverlayText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    letterSpacing: 0.15,
    fontFamily: "DMMono",
  },

  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  btnSecondary: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
  },

  btnSecondaryText: {
    color: "#888",
    fontSize: 11,
    letterSpacing: 0.08,
    fontFamily: "DMMono",
  },

  input: {
    width: "100%",
    height: 46,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingHorizontal: 14,
    color: "#f0f0ec",
    fontFamily: "DMMono",
    fontSize: 13,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 16,
  },

  btnPrimary: {
    width: "100%",
    height: 46,
    backgroundColor: "#f0f0ec",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 4,
  },

  btnPrimaryText: {
    color: "#1a1a1a",
    fontSize: 13,
    letterSpacing: 0.12,
    fontFamily: "DMMono",
    fontWeight: "500",
  },
});

export default InsertNewCard;
