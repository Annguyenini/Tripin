import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useMemo, useEffect, useState } from "react";
import CurrentDisplayContentsObserver from "../../observers/current_contents/current_display_contents_observer";
import TripDisplayObserver from "../../observers/trip_display_observer";
import * as CoordinatesCal from "../../../../backend/coordinates/coordinates_cal";
import { Ionicons } from "@expo/vector-icons";

export const TripStatCards = () => {
  const [createdTime, setCreatedTime] = useState(null);
  const [endedTime, setEndedTime] = useState(null);
  const [duration, setDuration] = useState({ hours: 0, minutes: 0, days: 0 });
  const [contents, setContents] = useState([]);
  const [currentTripDisplay, setCurrentTripDisplay] = useState(
    TripDisplayObserver.getTripNeedRender() ?? null,
  );
  const [distance, setDistance] = useState({ km: 0, m: 0 });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchDurration = async () => {
      setCreatedTime(currentTripDisplay.created_time);
      setEndedTime(currentTripDisplay.ended_time);
    };
    const fetchTripContents = async () => {
      let contents = CurrentDisplayContentsObserver.getAssetArray(
        currentTripDisplay.trip_id,
      );
      setContents(contents);
    };

    fetchDurration();
    fetchTripContents();
  }, []);

  useEffect(() => {
    const updateContents = {
      update(newAssets) {
        setContents(newAssets);
      },
    };

    const update_trip_display = {
      update(new_trip) {
        setCurrentTripDisplay(new_trip);
      },
    };
    TripDisplayObserver.attach(update_trip_display, TripDisplayObserver.EVENTS);
    CurrentDisplayContentsObserver.attach(
      updateContents,
      CurrentDisplayContentsObserver.GENERATE_KEY(currentTripDisplay.trip_id),
    );

    return () => {
      CurrentDisplayContentsObserver.detach(
        updateContents,
        CurrentDisplayContentsObserver.GENERATE_KEY(currentTripDisplay.trip_id),
      );
      TripDisplayObserver.detach(
        update_trip_display,
        TripDisplayObserver.EVENTS,
      );
    };
  }, []);

  useEffect(() => {
    if (!createdTime) return;

    const calcDuration = (dur) => {
      const totalMinutes = Math.floor(dur / 60000);
      const totalHours = Math.floor(totalMinutes / 60);
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      const minutes = totalMinutes % 60;
      return { days, hours, minutes };
    };

    if (endedTime) {
      const dur = Number(endedTime) - Number(createdTime);
      setDuration(calcDuration(dur));
    } else {
      const interval = setInterval(() => {
        setDuration(calcDuration(Date.now() - createdTime));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [createdTime]);

  const totalDistanceTravel = useMemo(() => {
    const distance_m = CoordinatesCal.TotalDistanceTravel([
      ...contents.map((coord) => {
        return [coord.latitude, coord.longitude];
      }),
    ]);
    const km = distance_m / 1000;
    const km_floor = Math.floor(km);
    const m = Math.floor((km - km_floor) * 1000);
    setDistance({ km: km_floor, m: m });
  }, [contents, currentTripDisplay]);

  const durationText = `${duration.days ?? 0}d ${duration.hours ?? 0}h ${duration.minutes ?? 0}m`;
  const distanceText =
    distance.km !== 0 ? `${distance.km} km ${distance.m} m` : `${distance.m} m`;

  return (
    <View style={s.card}>
      <View style={s.row}>
        <Ionicons name="time-outline" size={16} color="#b86a10" />
        <Text style={s.label}>Duration</Text>
        <Text style={s.value}>{durationText}</Text>
      </View>
      <View style={s.divider} />
      <View style={s.row}>
        <Ionicons name="navigate-outline" size={16} color="#a83058" />
        <Text style={s.label}>Distance</Text>
        <Text style={s.value}>{distanceText}</Text>
      </View>

      {expanded && (
        <>
          <View style={s.divider} />
          <View style={s.row}>
            <Ionicons name="camera-outline" size={16} color="#2a6aaa" />
            <Text style={s.label}>Shots taken</Text>
            <Text style={s.value}>{contents.length}</Text>
          </View>
        </>
      )}

      <TouchableOpacity
        style={s.expandToggle}
        onPress={() => setExpanded((prev) => !prev)}
      >
        <Text style={s.expandText}>
          {expanded ? "Show less" : "Show 1 more stat"}
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={12}
          color="#a09e99"
        />
      </TouchableOpacity>
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#e8e3d8",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  divider: {
    height: 0.5,
    backgroundColor: "#efebe2",
  },
  label: {
    flex: 1,
    fontSize: 11,
    color: "#5f5e5a",
    fontFamily: "DMMono",
  },
  value: {
    fontSize: 12,
    color: "#1a1917",
    fontFamily: "DMMono",
    fontWeight: "600",
  },
  expandToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#efebe2",
  },
  expandText: {
    fontSize: 10,
    color: "#a09e99",
    fontFamily: "DMMono",
  },
});
