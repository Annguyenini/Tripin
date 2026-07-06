import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  FlatList,
  ScrollView,
} from "react-native";
import {
  imageVideoPicker,
  photoVideoCamera,
} from "../../../custom_components/image_picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import { ModifyingTripContent as s } from "../../../../styles/modifying_trip_contents.styles";
import MapSearch from "../../../../backend/services/map_box_search/search";
import TripDisplayObserver from "../../observers/trip_display_observer";

const MAPBOX_TOKEN = process.env.EXPO_MAPBOX_PUBLIC_TOKEN;

const ModifyingContentScreen = ({ onClose }) => {
  const [phase, setPhase] = useState<"media" | "details">("media");

  const [media, setMedia] = useState<{
    uri: string;
    type: "image" | "video";
  } | null>(null);

  const [location, setLocation] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const sessionToken = useRef(Crypto.randomUUID());
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState("");
  const [showEndPicker, setShowEndPicker] = useState<"date" | "time" | null>(
    null,
  );
  const currentTrip = TripDisplayObserver.getTripNeedRender();
  const pickFromCamera = async () => {
    const result = await photoVideoCamera();
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setMedia({
        uri: asset.uri,
        type: asset.type === "video" ? "video" : "image",
      });
    }
  };

  const pickFromLibrary = async () => {
    const result = await imageVideoPicker();
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setMedia({
        uri: asset.uri,
        type: asset.type === "video" ? "video" : "image",
      });
    }
  };

  const goToDetails = () => {
    if (!media) return;
    setPhase("details");
  };

  const goBackToMedia = () => setPhase("media");

  const fetchSuggestions = async (query: string) => {
    const response = await MapSearch.getSuggestion(query, sessionToken.current);
    setSuggestions(response);
  };

  const handleSearchChange = (text: string) => {
    setSearchValue(text);
    setShowSuggestions(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 250);
  };

  const handleSelectSuggestion = async (mapboxId: string, name: string) => {
    try {
      const feature = await MapSearch.retrive(mapboxId, sessionToken.current);
      const city = feature[0]?.properties?.context?.place?.name;
      const region = feature[0]?.properties?.context?.region?.name;
      const country = feature[0]?.properties?.context?.country?.name;
      const iso_code = feature[0]?.properties?.context?.country?.country_code;
      const longitude = feature[0]?.properties?.coordinates?.longitude;
      const latitude = feature[0]?.properties?.coordinates?.latitude;

      console.log(city, region, country, iso_code);

      setLocation(feature?.properties?.full_address ?? name);
      setSearchValue(name);
      setSuggestions([]);
      setShowSuggestions(false);
      sessionToken.current = Crypto.randomUUID(); // fresh session for next search
    } catch (err) {
      console.error("retrieve error", err);
    }
  };

  const handleSubmit = () => {
    const payload = { media, location, startDate, endDate };
    console.log("submit content", payload);
  };

  return (
    <View style={s.container}>
      <View style={s.closeRow}>
        <TouchableOpacity onPress={onClose} style={s.closeBtn}>
          <Text style={s.closeBtnTxt}>✕</Text>
        </TouchableOpacity>
      </View>
      {phase === "media" ? (
        <View style={s.phaseWrap}>
          <Text style={s.phaseTitle}>Add media</Text>

          {media && (
            <View style={s.mediaPreview}>
              <Text style={s.mediaPreviewTxt}>
                {media.type === "video" ? "Video selected" : "Image selected"}
              </Text>
            </View>
          )}

          <TouchableOpacity onPress={pickFromCamera} style={s.optionBtn}>
            <Text style={s.optionBtnTxt}>📷 Take Photo / Video</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={pickFromLibrary} style={s.optionBtn}>
            <Text style={s.optionBtnTxt}>🖼️ Choose from Library</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToDetails}
            disabled={!media}
            style={[
              s.continueBtn,
              media ? s.continueBtnActive : s.continueBtnDisabled,
            ]}
          >
            <Text style={s.continueBtnTxt}>Continue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={s.phaseWrap}>
          <View style={s.detailsHeader}>
            <TouchableOpacity onPress={goBackToMedia}>
              <Text style={s.backTxt}>← Back</Text>
            </TouchableOpacity>
            <Text style={s.phaseTitle}>Details</Text>
            <View style={s.detailsHeaderSpacer} />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Location</Text>
            <TextInput
              value={searchValue}
              onChangeText={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Where was this?"
              placeholderTextColor="rgba(255,255,255,0.3)"
              style={s.input}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ScrollView
                style={s.suggestList}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                {suggestions.map((item) => (
                  <TouchableOpacity
                    key={item.mapbox_id}
                    style={s.suggestItem}
                    onPress={() =>
                      handleSelectSuggestion(item.mapbox_id, item.name)
                    }
                  >
                    <Text style={s.suggestItemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {item.place_formatted && (
                      <Text style={s.suggestItemAddress} numberOfLines={1}>
                        {item.place_formatted}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Start</Text>
            <View style={s.dateTimeRow}>
              <TouchableOpacity
                onPress={() => setShowStartPicker("date")}
                style={s.dateTimeBtn}
              >
                <Text style={s.dateTimeBtnTxt}>
                  {startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowStartPicker("time")}
                style={s.dateTimeBtn}
              >
                <Text style={s.dateTimeBtnTxt}>
                  {startDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              textColor="black"
              mode={showStartPicker}
              minimumDate={new Date(currentTrip.created_time)} // today and later only
              maximumDate={new Date(currentTrip.ended_time)}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selected) => {
                if (selected) setStartDate(selected);
              }}
            />
          )}

          <TouchableOpacity onPress={handleSubmit} style={s.saveBtn}>
            <Text style={s.saveBtnTxt}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ModifyingContentScreen;
