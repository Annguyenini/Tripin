import { useRef, useState } from "react";
import { OverlayCard } from "../../../overlay/overlay_card";
import {
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
} from "react-native";
import {
  imagePicker,
  takePicture,
} from "../../../custom_components/image_picker";
import { UseOverlay } from "../../../overlay/overlay_main";
import TripHandler from "../../../../app-core/flow/handlers/trip_actions/trip_action_handler";
import { colors } from "../../../../styles/function/trip_style";

const PRIVACY_OPTIONS = [
  { key: "private", label: "Private", bg: colors.rose, text: colors.roseDark },
  { key: "friend", label: "Friends", bg: colors.sky, text: colors.skyDark },
  { key: "public", label: "Public", bg: colors.sage, text: colors.sageDark },
];

const TripCustomCard = ({ trip, onClose }) => {
  const [tripName, setTripName] = useState(trip.trip_name);
  const [tripImage, setTripImage] = useState(trip.image);
  const [privacy, setPrivacy] = useState(trip.privacy ?? "private");
  let _imageChanged = useRef(false);
  const { showErrorBox, hideErrorBox, showLoading, hideLoading } = UseOverlay();
  const loadingRef = useRef(null);
  const loadingSteps = ["Modifing your memories", "Nanana"];
  const Loading = () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    showLoading(() => HideLoading, loadingSteps);
  };
  const HideLoading = () => {
    console.log("end", loadingRef.current);
    if (!loadingRef.current) return;
    console.log("end");

    hideLoading();
    loadingRef.current = false;
  };
  const callImagePicker = async () => {
    const pic = await imagePicker();
    _imageChanged.current = true;
    setTripImage(pic.assets[0].uri);
  };

  const callCamera = async () => {
    const pic = await takePicture();
    _imageChanged.current = true;

    setTripImage(pic.assets[0].uri);
  };
  const requestTripModify = async () => {
    Loading();
    onClose(false);
    let new_name = null;
    if (trip.trip_name != tripName) new_name = tripName;
    let new_privacy = null;
    if (trip.privacy != privacy) new_privacy = privacy;
    const update = await TripHandler.modifyTripDataHandler(
      trip.trip_id,
      new_name,
      _imageChanged.current ? tripImage : null,
      new_privacy,
    );
    HideLoading();

    if (!update.success) {
      console.log(update);
      showErrorBox("Failed", update.message, 3600);
    }
  };
  return (
    <Modal>
      <OverlayCard
        title={trip.trip_name + " — edit"}
        onClose={() => onClose(false)}
      >
        {/* cover image */}
        <TouchableOpacity
          style={s.imageWrap}
          onPress={callImagePicker}
          activeOpacity={0.85}
        >
          <Image
            source={
              tripImage
                ? { uri: tripImage }
                : require("../../../../../assets/icon.png")
            }
            style={s.image}
          />
          <View style={s.imageOverlay}>
            <Text style={s.imageOverlayText}>CHANGE COVER</Text>
          </View>
        </TouchableOpacity>

        {/* image buttons */}
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

        {/* name input */}
        <TextInput
          style={s.input}
          placeholder={tripName}
          placeholderTextColor={colors.textHint}
          value={tripName}
          onChangeText={(text) => setTripName(text)}
        />

        {/* privacy toggle */}
        <Text style={s.privacyLabel}>Who can see this trip?</Text>
        <View style={s.privacyToggle}>
          {PRIVACY_OPTIONS.map(({ key, label, bg, text }) => {
            const active = privacy === key;
            return (
              <TouchableOpacity
                key={key}
                style={[
                  s.privacyOption,
                  active && { backgroundColor: bg, borderColor: bg },
                ]}
                onPress={() => setPrivacy(key)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    s.privacyOptionText,
                    active && [s.privacyOptionTextActive, { color: text }],
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* save */}
        <TouchableOpacity
          style={s.btnPrimary}
          activeOpacity={0.8}
          onPress={requestTripModify}
        >
          <Text style={s.btnPrimaryText}>SAVE CHANGES</Text>
        </TouchableOpacity>
      </OverlayCard>
    </Modal>
  );
};

const s = StyleSheet.create({
  imageWrap: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  imageOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(122,74,42,0.4)", // peachDark, translucent — sits on top of any cover photo
    alignItems: "center",
    justifyContent: "center",
  },

  imageOverlayText: {
    color: colors.bg,
    fontSize: 11,
    letterSpacing: 0.15,
    fontFamily: "DMMono-Regular",
    fontWeight: "600",
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
    borderWidth: 1,
    borderColor: colors.peachMid,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.peach,
  },

  btnSecondaryText: {
    color: colors.peachDark,
    fontSize: 11,
    letterSpacing: 0.08,
    fontFamily: "DMMono-Regular",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    height: 46,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 14,
    color: colors.text,
    fontFamily: "DMMono-Regular",
    fontSize: 13,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: 16,
  },

  // Privacy toggle — base look is neutral surface, active state gets its
  // color (bg/text) applied inline per-option from PRIVACY_OPTIONS, same
  // pattern as NewTripFiller so both create/edit flows stay in sync.
  privacyLabel: {
    fontSize: 12,
    fontFamily: "DMMono-Regular",
    color: colors.textMuted,
    marginBottom: 6,
  },
  privacyToggle: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  privacyOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  privacyOptionText: {
    fontFamily: "DMMono-Regular",
    fontWeight: "600",
    fontSize: 13,
    color: colors.textMuted,
  },
  privacyOptionTextActive: {
    fontWeight: "700",
  },

  btnPrimary: {
    width: "100%",
    height: 46,
    backgroundColor: colors.peachMid,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  btnPrimaryText: {
    color: colors.peachDark,
    fontSize: 13,
    letterSpacing: 0.12,
    fontFamily: "DMMono-Regular",
    fontWeight: "700",
  },
});

export default TripCustomCard;
