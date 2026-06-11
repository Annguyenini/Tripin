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
import CurrentTripDataService from "../../../backend/storage/hot_data/current_trip";
import TripDisplayObserver from "../observers/trip_display_observer";
import TripActionsHandler from "../../../app-core/flow/handlers/trip_actions/trip_action_handler";

// ─── UI / Overlay ─────────────────────────────────────────────────────────────
import { UseOverlay } from "../../overlay/overlay_main";
import { BottomSheetSyle } from "../../../styles/bottom_sheet.styles";
import { TripStatCards } from "./compoments/trip_stat";
import PolaroidGallery from "./compoments/memories";
import TripCustomCard from "./trips_card/trip_custom_card";
import { Trip_Data } from "../../../types/trip_data.types";
import { TestScreen } from "../../../test_screen";
// ─── Assets ───────────────────────────────────────────────────────────────────
const default_image = require("../../../../assets/icon.png");

// ─────────────────────────────────────────────────────────────────────────────

export const UserDataBottomSheet = ({ userDisplayName }) => {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const bottomSheetRef = useRef(null);

  // ── State ─────────────────────────────────────────────────────────────────
  const [test, setTest] = useState(false);
  const [snapIndex, setSnapIndex] = useState(0);
  const [dataKey, setDataKey] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [status, setStatus] = useState("Current");
  const [secondTripDisplay, setSecondTripDisplay] = useState(null);

  const [displayTrip, setDisplayTrip] = useState(
    CurrentTripDataService.getCurrentTripStatus(),
  );
  const [trip, setTrip] = useState<Trip_Data | null>(
    CurrentTripDataService.getCurrentTripData(),
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
    const updateTripData = {
      update(new_data: Trip_Data) {
        if (!new_data) {
          setDisplayTrip(false);
          return;
        }

        if (new_data.trip_id === CurrentTripDataService.getCurrentTripId()) {
          setSecondTripDisplay(false);
          const formatted = new_data.created_time
            ? new Date(Math.floor(new_data.created_time)).toLocaleString()
            : "—";
          setStatus(`${formatted} -> Current`);
        } else {
          const formatted_created = new_data.created_time
            ? new Date(Math.floor(new_data.created_time)).toLocaleString()
            : "—";
          const formatted_ended = new_data.ended_time
            ? new Date(Math.floor(new_data.ended_time)).toLocaleString()
            : "—";
          setStatus(`${formatted_created} - ${formatted_ended}`);
          setSecondTripDisplay(true);
        }

        setTrip(new_data);
        setDisplayTrip(true);
        setSnapIndex(0);
        setDataKey((k) => k + 1);
      },
    };

    TripDisplayObserver.attach(updateTripData, TripDisplayObserver.EVENTS);
    return () => {
      TripDisplayObserver.detach(updateTripData, TripDisplayObserver.EVENTS);
    };
  }, []);
  console.log(trip);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <BottomSheet
      key={dataKey}
      ref={bottomSheetRef}
      snapPoints={["20%", "50%"]}
      index={snapIndex}
      backgroundStyle={BottomSheetSyle.sheetBg}
      handleIndicatorStyle={BottomSheetSyle.sheetHandle}
    >
      <BottomSheetScrollView contentContainerStyle={BottomSheetSyle.container}>
        {/*<TouchableOpacity onPress={() => setTest(true)}>
          <Text>test</Text>
        </TouchableOpacity>
        <>
          <Modal visible={test}>
            <TestScreen testScreenHandler={() => setTest(false)}></TestScreen>
          </Modal>
        </>*/}
        {displayTrip && (
          <>
            {/* ── Trip Title ── */}
            <View style={BottomSheetSyle.titleRow}>
              <Image
                source={trip.image ? { uri: trip.image } : default_image}
                style={BottomSheetSyle.image}
              />

              <View style={BottomSheetSyle.titleBlock}>
                <View style={BottomSheetSyle.tripNameRow}>
                  <Text style={BottomSheetSyle.tripName}>{trip.trip_name}</Text>
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

            {/* ── Memory Cards ── */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={BottomSheetSyle.memoriesScroll}
            >
              <PolaroidGallery trip_id={trip.trip_id} />
            </ScrollView>
          </>
        )}
      </BottomSheetScrollView>

      <Modal visible={showEdit}>
        <TripCustomCard trip={trip} onClose={() => setShowEdit(false)} />
      </Modal>
    </BottomSheet>
  );
};
