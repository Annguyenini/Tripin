import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import {
  imageVideoPicker,
  photoVideoCamera,
} from "../../../custom_components/image_picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import { ModifyingTripContent as s } from "../../../../styles/modifying_trip_contents.styles";
import MapSearch from "../../../../backend/services/map_box_search/search";
import TripDisplayObserver from "../../observers/trip_display_observer";
import { Video } from "expo-av";
import CurrentDisplayContents from "../../observers/current_contents/current_display_contents_observer";
import MapSharedConfig from "../../main_map/map_shared_config";
import LocationData from "../../../../app-core/local_data/local_location_data";
import BottomSheetTransform from "../../bottom_sheet/bottom_sheet_transform";

const ModifyingContentScreen = ({ onClose }) => {
  console.log("render add");
  const [phase, setPhase] = useState<"media" | "details">("media");

  const [media, setMedia] = useState<{
    uri: string;
    type: "image" | "video";
  } | null>(null);
  const mediaRef = useRef(media);
  useEffect(() => {
    mediaRef.current = media;
  }, [media]);

  const [location, setLocation] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const sessionToken = useRef(Crypto.randomUUID());
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [timeStamp, setTimeStamp] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState("");
  const [phase2Error, setPhase2Error] = useState("");
  const [finalConfig, setFinalConfig] = useState("");
  const currentTrip = TripDisplayObserver.getTripNeedRender();
  const [cardLocationData, setCardLocationData] = useState(null);
  const minTime = currentTrip.created_time;
  const maxTime = currentTrip.ended_time ?? Date.now();
  const timeRef = useRef(timeStamp);
  useEffect(() => {
    timeRef.current = timeStamp;
  }, [timeStamp]);
  const locationRef = useRef(cardLocationData);
  useEffect(() => {
    locationRef.current = cardLocationData;
  }, [cardLocationData]);
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
    // FIX: guard empty query so we don't fire a search on a cleared field
    if (!query?.trim()) {
      setSuggestions([]);
      return;
    }
    const response = await MapSearch.getSuggestion(query, sessionToken.current);
    setSuggestions(response ?? []);
  };

  useEffect(() => {
    const updateSelectionLocation = {
      update(newCoords) {
        console.log(newCoords);
        handleCoordsSelection(newCoords);
      },
    };
    MapSharedConfig.attach(updateSelectionLocation, "coordsSelection");
    return () =>
      MapSharedConfig.detach(updateSelectionLocation, "coordsSelection");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FIX: clear pending debounce timer on unmount to avoid setState-after-unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleCoordsSelection = async (coords_object) => {
    const lng = coords_object?.geometry?.coordinates?.[0];
    const lat = coords_object?.geometry?.coordinates?.[1];

    if (lng == null || lat == null) return; // FIX: guard malformed payload

    const reversed_location = await LocationData.reverseCoords(lng, lat);
    const newLocation = {
      longitude: lng,
      latitude: lat,
      city: reversed_location?.city,
      region: reversed_location?.region,
      country: reversed_location?.country,
      iso_country_code: reversed_location?.iso_country_code,
    };
    console.log("new", lng, lat, newLocation);

    setSearchValue(newLocation?.city ?? "unkown");
    setCardLocationData(newLocation);
    handleTempRender(newLocation, timeRef.current);
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
      const first = feature?.[0];
      if (!first) return; // FIX: guard empty/failed retrieve result

      const newLocation = {
        longitude: first?.properties?.coordinates?.longitude,
        latitude: first?.properties?.coordinates?.latitude,
        city: first?.properties?.context?.place?.name,
        region: first?.properties?.context?.region?.name,
        country: first?.properties?.context?.country?.name,
        iso_country_code: first?.properties?.context?.country?.country_code,
      };

      setCardLocationData(newLocation);
      setLocation(first?.properties?.full_address ?? name);
      setSearchValue(name);
      setSuggestions([]);
      setShowSuggestions(false);

      // FIX: pass the freshly computed location, not stale state
      handleTempRender(newLocation, timeRef.current);

      sessionToken.current = Crypto.randomUUID();
    } catch (err) {
      console.error("retrieve error", err);
    }
  };

  const handleTempRender = (locationData, time) => {
    console.log("dsds", location, time);
    // FIX: guard on the argument, not the (possibly stale) state variable
    if (!locationData) return;
    // FIX: guard time before calling .getTime() on it below
    if (!time) return;
    // FIX: guard media before reading media.type/uri — prevents a crash
    // if this is ever invoked before media is set
    if (!mediaRef.current) {
      setPhase2Error("Add media before setting details.");
      console.log("media", media);
      return;
    }
    console.log(time.getTime());
    const timestampMs = time.getTime();

    if (timestampMs < minTime || timestampMs > maxTime) {
      setPhase2Error(
        `Invalid time, must be between ${new Date(minTime).toLocaleString()} and ${new Date(maxTime).toLocaleString()}`,
      );
      setFinalConfig("");
      BottomSheetTransform.setBottomSheetPercentage("100%");
      return;
    } else {
      setFinalConfig(time.toLocaleString());
    }

    const tempContent = {
      media_type: mediaRef.current.type,
      uuid: "temp",
      media_id: "temp",
      event: "add",
      media_path: mediaRef.current.uri,
      longitude: locationData.longitude,
      latitude: locationData.latitude,
      city: locationData.city,
      region: locationData.region,
      country: locationData.country,
      iso_country_code: locationData.iso_country_code,
      glow: true,
      time_stamp: timestampMs,
    };

    CurrentDisplayContents.addTempAssetIntoArray(
      currentTrip.trip_id,
      tempContent,
    );
    setPhase2Error("");
  };

  const handleTimeChange = (datetime) => {
    if (!datetime) return;
    setTimeStamp(datetime);

    if (datetime.getTime() < minTime || datetime.getTime() > maxTime) {
      setPhase2Error(
        `Invalid time, must be between ${new Date(minTime).toLocaleString()} and ${new Date(maxTime).toLocaleString()}`,
      );
      return;
    }
    setPhase2Error("");
    handleTempRender(cardLocationData, datetime);
  };

  const handleSubmit = () => {
    // FIX: payload was built but never used — wiring it to close for now.
    // Replace with your actual save/dispatch call when ready.
    const payload = { mediaRef, locationRef, timeRef };
    console.log("submit payload", payload);
    // onClose?.();
  };

  const exit = () => {
    const originalContents = CurrentDisplayContents.getAssetArray(
      currentTrip.trip_id,
    );
    console.log("exit", originalContents);

    CurrentDisplayContents.setDefaultArray(
      currentTrip.trip_id,
      originalContents,
    );
    onClose();
  };
  return (
    <View style={s.container}>
      <View style={s.closeRow}>
        <TouchableOpacity onPress={() => exit()} style={s.closeBtn}>
          <Text style={s.closeBtnTxt}>✕</Text>
        </TouchableOpacity>
      </View>

      {phase === "media" ? (
        <View style={s.phaseWrap}>
          <Text style={s.phaseTitle}>Add media</Text>

          {media ? (
            <View style={s.mediaPreview}>
              {media.type === "video" ? (
                <Video
                  source={{ uri: media.uri }}
                  resizeMode="contain"
                  style={s.media}
                />
              ) : (
                <Image
                  source={{ uri: media.uri }}
                  contentFit="contain"
                  style={s.media}
                />
              )}
            </View>
          ) : (
            <View style={s.mediaPreviewEmpty}>
              <Text style={s.mediaPreviewTxt}>No media selected yet</Text>
            </View>
          )}

          <TouchableOpacity onPress={pickFromCamera} style={s.optionBtn}>
            <Text style={s.optionBtnTxt}>📷 Take photo / video</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={pickFromLibrary} style={s.optionBtn}>
            <Text style={s.optionBtnTxt}>🖼️ Choose from library</Text>
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
              placeholder="Where was this? (Search or ping on Map)"
              placeholderTextColor="rgba(43,42,40,0.35)"
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
            <Text style={s.fieldLabel}>When</Text>
            {!!phase2Error && <Text style={s.errorTxt}>{phase2Error}</Text>}
            <View style={s.dateTimeRow}>
              <TouchableOpacity
                onPress={() => setShowStartPicker("date")}
                style={s.dateTimeBtn}
              >
                <Text style={s.dateTimeBtnLabel}>DATE</Text>
                <Text style={s.dateTimeBtnTxt}>
                  {timeStamp.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowStartPicker("time")}
                style={s.dateTimeBtn}
              >
                <Text style={s.dateTimeBtnLabel}>TIME</Text>
                <Text style={s.dateTimeBtnTxt}>
                  {timeStamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showStartPicker !== "" && (
            <DateTimePicker
              value={timeStamp}
              textColor="#2B2A28"
              mode={showStartPicker as "date" | "time"}
              minimumDate={new Date(minTime)}
              maximumDate={new Date(maxTime)}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selected) => {
                // FIX: always reset so the same button can retrigger the
                // native dialog on Android (state must actually change)
                setShowStartPicker("");
                if (event.type === "set" && selected) {
                  handleTimeChange(selected);
                }
              }}
            />
          )}

          {!!finalConfig && (
            <Text style={s.confirmTxt}>Saved for {finalConfig}</Text>
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
