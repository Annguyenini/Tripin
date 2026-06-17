import { View, TouchableOpacity, Text } from "react-native";
import { useState, useEffect } from "react";
import TripStat from "./stat/stat";
import TripTimeline from "./timeline/timeline";
import StatManager from "./stat/memories_manage";
import CurrentTripDataService from "../../../../backend/storage/hot_data/current_trip";
import TripDisplayObserver from "../../observers/trip_display_observer";
import { Trip_Data } from "../../../../types/trip_data.types";
import TimeLineManager from "./timeline/timeline_manager";
const TripDashBoard = () => {
  console.log("dash");
  const [viewMode, setViewMode] = useState<"dash" | "timeline">("dash");
  const [isDisplay, setIsDisplay] = useState(
    CurrentTripDataService.getCurrentTripStatus(),
  );
  const [trip, setTrip] = useState(CurrentTripDataService.getCurrentTripData());
  useEffect(() => {
    const updateTripData = {
      update(new_data: Trip_Data) {
        console.log(new_data);
        if (!new_data) {
          setIsDisplay(false);
          return;
        }
        setTrip(new_data);
        setIsDisplay(true);
      },
    };

    TripDisplayObserver.attach(updateTripData, TripDisplayObserver.EVENTS);
    return () => {
      TripDisplayObserver.detach(updateTripData, TripDisplayObserver.EVENTS);
    };
  }, []);
  return (
    <View
      style={{
        flexDirection: "row",
        alignSelf: "center",
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
          backgroundColor: viewMode === "dash" ? "#4a4743" : "transparent",
        }}
      >
        <Text style={{ color: "white" }}>Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setViewMode("timeline")}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 999,
          backgroundColor: viewMode === "timeline" ? "#4a4743" : "transparent",
        }}
      >
        <Text style={{ color: "white" }}>Timeline</Text>
      </TouchableOpacity>
      {trip && (
        <>
          {viewMode === "dash" ? (
            <TripStat TripData={trip}></TripStat>
          ) : (
            <TimeLineManager trip_id={trip.trip_id}></TimeLineManager>
          )}
        </>
      )}
    </View>
  );
};

export default TripDashBoard;
