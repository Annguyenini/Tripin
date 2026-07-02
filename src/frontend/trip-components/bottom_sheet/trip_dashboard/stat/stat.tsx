// ─── External Libraries ───────────────────────────────────────────────────────
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRef, useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Modal,
  Image,
} from "react-native";

// ─── Internal Services & Observers ───────────────────────────────────────────
import CurrentTripDataService from "../../../../../backend/storage/hot_data/current_trip";
import TripDisplayObserver from "../../../observers/trip_display_observer";
import TripActionsHandler from "../../../../../app-core/flow/handlers/trip_actions/trip_action_handler";

// ─── UI / Overlay ─────────────────────────────────────────────────────────────
import { UseOverlay } from "../../../../overlay/overlay_main";
import { BottomSheetSyle } from "../../../../../styles/bottom_sheet.styles";
import { TripStatCards } from "../../compoments/trip_stat";
// import PolaroidGallery from "./compoments/memories";\
import GalleryManager from "./memories_manage";

import TripCustomCard from "../../trips_card/trip_custom_card";
import { Trip_Data } from "../../../../../types/trip_data.types";
import MemoryManager from "./memories_manage";
// ─── Assets ───────────────────────────────────────────────────────────────────
const default_image = require("../../../../../../assets/icon.png");

// ─────────────────────────────────────────────────────────────────────────────

const TripStat = ({ TripData }) => {
  console.log(TripData);
  // ── Refs ──────────────────────────────────────────────────────────────────
  const bottomSheetRef = useRef(null);

  // ── State ─────────────────────────────────────────────────────────────────
  const [dataKey, setDataKey] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [status, setStatus] = useState("Current");
  const [secondTripDisplay, setSecondTripDisplay] = useState(null);
  const [displayTrip, setDisplayTrip] = useState(
    CurrentTripDataService.getCurrentTripStatus(),
  );

  const loadingRef = useRef(null);
  // ── Overlay ───────────────────────────────────────────────────────────────
  const { showLoading, hideLoading, showErrorBox } = UseOverlay();

  const EndLoadingSteps = [
    "Getting your trips...",
    "Look like There are NOTHING",
    "Unpacking the memories...",
    "Dusting off the map...",
    "Almost there...",
  ];

  const TripLoading = () => {
    if (loadingRef.current) return;
    loadingRef.current = showLoading(HideTripLoading(), EndLoadingSteps);
  };
  const HideTripLoading = () => {
    if (!loadingRef.current) return;
    hideLoading();
    loadingRef.current = null;
  };
  // ── Handlers ──────────────────────────────────────────────────────────────
  const goBack = () => {
    TripDisplayObserver.deleteTripSelected();
  };

  const end_trip = async () => {
    TripLoading();
    const status = await TripActionsHandler.endTripHandler();
    hideLoading();
    await goBack();
  };

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (TripData?.trip_id === CurrentTripDataService.getCurrentTripId()) {
      setSecondTripDisplay(false);
      const formatted = TripData.created_time
        ? new Date(Math.floor(TripData.created_time)).toLocaleString()
        : "—";
      setStatus(`${formatted} -> Current`);
    } else {
      const formatted_created = TripData.created_time
        ? new Date(Math.floor(TripData.created_time)).toLocaleString()
        : "—";
      const formatted_ended = TripData.ended_time
        ? new Date(Math.floor(TripData.ended_time)).toLocaleString()
        : "—";
      setStatus(`${formatted_created} - ${formatted_ended}`);
      setSecondTripDisplay(true);
    }

    setDataKey((k) => k + 1);
  }, []);
  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1 }}>
      <View style={BottomSheetSyle.titleRow}>
        <Image
          source={TripData.image ? { uri: TripData.image } : default_image}
          style={BottomSheetSyle.image}
        />

        <View style={BottomSheetSyle.titleBlock}>
          <View style={BottomSheetSyle.tripNameRow}>
            <Text style={BottomSheetSyle.tripName}>{TripData.trip_name}</Text>
            <TouchableOpacity
              style={BottomSheetSyle.moreBtn}
              onPress={() => setShowEdit(true)}
            >
              <Text style={BottomSheetSyle.moreBtnText}>•••</Text>
            </TouchableOpacity>
          </View>
          <View style={BottomSheetSyle.statusRow}>
            <View style={BottomSheetSyle.statusDot} />
            <Text style={BottomSheetSyle.statusText}>{status}</Text>
          </View>
        </View>

        <View
          style={[
            BottomSheetSyle.endTripCover,
            secondTripDisplay && { backgroundColor: "#2a2826" },
          ]}
        >
          {secondTripDisplay ? (
            <TouchableOpacity
              onPress={() => {
                setSecondTripDisplay(null);
                goBack();
              }}
              activeOpacity={0.8}
            >
              <Text style={BottomSheetSyle.upBtnText}>← GoBack</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={end_trip} activeOpacity={0.8}>
              <Text style={BottomSheetSyle.upBtnText}>End trip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Stat Cards ── */}
      <TripStatCards />

      {/* ── Memories Divider ── */}
      <View style={BottomSheetSyle.dividerRow}>
        <View style={BottomSheetSyle.dividerLine} />
        <Text style={BottomSheetSyle.dividerLabel}>MEMORIES</Text>
        <View style={BottomSheetSyle.dividerLine} />
      </View>

      {showEdit && (
        <TripCustomCard
          trip={TripData}
          onClose={() => setShowEdit(false)}
        ></TripCustomCard>
      )}
      {/* ── Memory Cards ── */}
      {/*<ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={BottomSheetSyle.memoriesScroll}
            >
              <PolaroidGallery trip_id={trip.trip_id} />
            </ScrollView>*/}
      <MemoryManager trip_id={TripData.trip_id}></MemoryManager>
    </View>
  );
};

export default TripStat;
