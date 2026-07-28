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
import { BottomSheetSyle } from "../../../styles/bottom_sheet.styles";
import { TestScreen } from "../../../test_screen";
import TripCustomCard from "./trips_card/trip_custom_card";
import { Trip_Data } from "../../../types/trip_data.types";

import TripStat from "./trip_dashboard/stat/stat";
import TimeLineManager from "./trip_dashboard/timeline/timeline_manager";
import ModifyingContentScreen from "../components/marker/modifying_contents";
import BottomSheetTransform from "./bottom_sheet_transform";
import UserDataService from "../../../backend/storage/async_storage/user";
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
        console.log(new_data)
        if (!new_data) {
          setDisplayTrip(false);
          setSnapIndex(0);
          return;
        }

        setTrip(new_data);
        setDisplayTrip(true);
        setSnapIndex(1);
        setDataKey((k) => k + 1);
      },
    };

    TripDisplayObserver.attach(updateTripData, TripDisplayObserver.EVENTS);
    return () => {
      TripDisplayObserver.detach(updateTripData, TripDisplayObserver.EVENTS);
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <BottomSheet
      key={dataKey}
      ref={(ref) => BottomSheetTransform.setBottomSheetRef(ref)}
      snapPoints={['10%',"20%", "30%", "50%", "100%"]}
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
              <View style={BottomSheetSyle.segmentGroup}>
                <TouchableOpacity
                  onPress={() => setViewMode("dash")}
                  style={[
                    BottomSheetSyle.segmentBtn,
                    viewMode === "dash" && BottomSheetSyle.segmentBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      BottomSheetSyle.segmentBtnText,
                      viewMode === "dash" && BottomSheetSyle.segmentBtnTextActive,
                    ]}
                  >
                    Statistic
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setViewMode("timeline")}
                  style={[
                    BottomSheetSyle.segmentBtn,
                    viewMode === "timeline" && BottomSheetSyle.segmentBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      BottomSheetSyle.segmentBtnText,
                      viewMode === "timeline" && BottomSheetSyle.segmentBtnTextActive,
                    ]}
                  >
                    Timeline
                  </Text>
                </TouchableOpacity>
              </View>
              {trip?.user_id === UserDataService.getUserId()? (<TouchableOpacity
                onPress={() => setModifyingTripContents()}
                style={BottomSheetSyle.addBtn}
              >
                <Text style={BottomSheetSyle.addBtnText}>
                  +
                </Text>
              </TouchableOpacity>) : (
                <Text style={BottomSheetSyle.byLine}> By - @{trip.author}
                </Text>
              )}

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
