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
import { Feather } from '@expo/vector-icons';

// ─── Internal Services & Observers ───────────────────────────────────────────
import CurrentTripDataService from "../../../backend/storage/hot_data/current_trip";
import TripDisplayObserver from "../observers/trip_display_observer";
import TripActionsHandler from "../../../app-core/flow/handlers/trip_actions/trip_action_handler";

// ─── UI / Overlay ─────────────────────────────────────────────────────────────
import { UseOverlay } from "../../overlay/overlay_main";
import { BottomSheetSyle } from "../../../styles/bottom_sheet.styles";
import { TripStatCards } from "./compoments/trip_stat";
// import PolaroidGallery from "./compoments/memories";\
import GalleryManager from "./trip_dashboard/stat/memories_manage";
import TripTimeline from "./trip_dashboard/timeline/timeline";
import PolaroidGallery from "./compoments/memories/PolaroidGallery";
import TripCustomCard from "./trips_card/trip_custom_card";
import { Trip_Data } from "../../../types/trip_data.types";
import { TestScreen } from "../../../test_screen";
import TripDashBoard from "./trip_dashboard/dashboard_manager";
import TripStat from "./trip_dashboard/stat/stat";
import TimeLineManager from "./trip_dashboard/timeline/timeline_manager";
import UIeventbus from "../../../backend/bridge/UI_event_bus";
import ModifyingContentScreen from "../components/marker/modifying_contents";
import BottomSheetTransform from "./bottom_sheet_transform";
// ─── Assets ───────────────────────────────────────────────────────────────────
const default_image = require("../../../../assets/icon.png");

// ─────────────────────────────────────────────────────────────────────────────

export const UserDataBottomSheet = () => {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const bottomSheetRef = useRef(null);

  // ── State ─────────────────────────────────────────────────────────────────
  const [test, setTest] = useState(false);
  const [snapIndex, setSnapIndex] = useState(0);
  const [dataKey, setDataKey] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [status, setStatus] = useState("Current");
  const [secondTripDisplay, setSecondTripDisplay] = useState(null);
  const [isModifying, setIsModifying] = useState(false);
  const [viewMode, setViewMode] = useState<"dash" | "timeline">("dash");
  const [displayTrip, setDisplayTrip] = useState(
    CurrentTripDataService.getCurrentTripStatus(),
  );
  const [trip, setTrip] = useState<Trip_Data | null>(
    CurrentTripDataService.getCurrentTripData(),
  );

  const setModifyingTripContents = () => {
    setIsModifying(true);
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

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
      ref={(ref) => BottomSheetTransform.setBottomSheetRef(ref)}
      snapPoints={["20%", "30%", "50%", "100%"]}
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
        {isModifying && (
          <ModifyingContentScreen visible={isModifying}
            onClose={() => setIsModifying(false)}
          ></ModifyingContentScreen>
        )}
        {displayTrip && !isModifying && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                paddingBottom: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#2a2826",
                  borderRadius: 999,
                  marginBottom: 0,
                }}
              >
                <TouchableOpacity
                  onPress={() => setViewMode("dash")}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor:
                      viewMode === "dash" ? "#4a4743" : "transparent",
                  }}
                >
                  <Text style={{ color: "white" }}>Statistic</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setViewMode("timeline")}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor:
                      viewMode === "timeline" ? "#4a4743" : "transparent",
                  }}
                >
                  <Text style={{ color: "white" }}>Timeline</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setModifyingTripContents()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "#2a2826",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 18, lineHeight: 20 }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>

            {viewMode === "dash" && <TripStat TripData={trip}></TripStat>}
            {viewMode === "timeline" && (
              <TimeLineManager trip_id={trip.trip_id}></TimeLineManager>

            )}
            {isModifying && (
              <ModifyingContentScreen visible={isModifying}
                onClose={() => setIsModifying(false)}
              ></ModifyingContentScreen>
            )}
          </>
        )}
      </BottomSheetScrollView>

      <Modal visible={showEdit}>
        <TripCustomCard trip={trip} onClose={() => setShowEdit(false)} />
      </Modal>
    </BottomSheet>
  );
};
