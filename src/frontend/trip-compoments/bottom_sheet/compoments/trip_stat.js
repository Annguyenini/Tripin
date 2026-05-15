import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useMemo } from "react";
import CurrentDisplayContentsObserver from "../../observers/current_display_contents_observer";
import { useEffect, useState } from "react";
import TripDisplayObserver from "../../observers/trip_display_observer";
import CurrentDisplayCoordinateObserver from "../../observers/legacy/current_display_coordinates_observer";
import * as CoordinatesCal from "../../../../backend/coordinates/coordinates_cal";
export const TripStatCards = () => {
  const [createdTime, setCreatedTime] = useState(null);
  const [endedTime, setEndedTime] = useState(null);
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 });
  const [coordinates, setCoordinates] = useState([]);
  const [contents, setContents] = useState([]);
  const [city, setCity] = useState(null);
  const [currentTripDisplay, setCurrentTripDisplay] = useState(
    TripDisplayObserver.getTripNeedRender() ?? null,
  );
  const [distance, setDistance] = useState({ km: 0, m: 0 });

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
        console.log("new_trip", new_trip);
        setCurrentTripDisplay(new_trip);
      },
    };
    TripDisplayObserver.attach(update_trip_display, TripDisplayObserver.EVENTS);
    CurrentDisplayContentsObserver.attach(
      updateContents,
      CurrentDisplayContentsObserver.GENERATE_KEY(currentTripDisplay.trip_id),
    );

    return () => {
      CurrentDisplayCoordinateObserver.detach(
        updateContents,
        CurrentDisplayCoordinateObserver.GENERATE_KEY(
          currentTripDisplay.trip_id,
        ),
      );
      TripDisplayObserver.detach(
        update_trip_display,
        TripDisplayObserver.EVENTS,
      );
    };
  }, []);
  useEffect(() => {
    if (!createdTime) {
      return;
    }
    if (endedTime) {
      const dur = Number(endedTime) - Number(createdTime);
      console.log(dur);
      const hour = dur / 3600000;
      const hours_floor = Math.floor(hour);
      const minutes = Math.floor((hour - hours_floor) * 60);

      setDuration({ hours: hours_floor, minutes: minutes });
    } else {
      const interval = setInterval(() => {
        const dur = Date.now() - createdTime;
        const hour = dur / 3600000;
        const hours_floor = Math.floor(hour);
        const minutes = Math.floor((hour - hours_floor) * 60);
        setDuration({ hours: hours_floor, minutes: minutes });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [createdTime]);

  const totalDistanceTravel = useMemo(() => {
    // const filtedArray = [...coordinates.map((coord)=>{
    //     return[coord.latitude,coord.longitude]
    // })]
    const distance_m = CoordinatesCal.TotalDistanceTravel([
      ...contents.map((coord) => {
        return [coord.latitude, coord.longitude];
      }),
    ]);
    const km = distance_m / 1000;
    const km_floor = Math.floor(km);
    const m = Math.floor((km - km_floor) * 1000);
    console.log(km_floor, m);
    setDistance({ km: km_floor, m: m });
  }, [contents, currentTripDisplay]);

  return (
    <View style={s.statsRow}>
      {/* <View style={[s.statCard, { backgroundColor: '#fde8ef', borderColor: '#f0b8cc' }]}>
                <Text style={s.statEmoji}>🏙️</Text>
                <Text style={[s.statLabel, { color: '#a83058' }]}>Current Location</Text>
                <Text adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.3} style={[s.statValue, { color: '#e07a3a' }]}>{city ?? 'You lost some where'}</Text>
            </View> */}
      <View
        style={[
          s.statCard,
          { backgroundColor: "#fef3e2", borderColor: "#f5d8a8" },
        ]}
      >
        <Text style={s.statEmoji}>⏰</Text>
        <Text style={[s.statLabel, { color: "#b86a10" }]}>Duration</Text>
        <Text style={s.statValue}>
          {duration.hours ?? 0}h {duration.minutes ?? 0}m
        </Text>
      </View>
      <View
        style={[
          s.statCard,
          { backgroundColor: "#e8f4fd", borderColor: "#b8d8f0" },
        ]}
      >
        <Text style={s.statEmoji}>📸</Text>
        <Text style={[s.statLabel, { color: "#2a6aaa" }]}>Shots taken</Text>
        <Text style={s.statValue}>{contents.length}</Text>
      </View>
      <View
        style={[
          s.statCard,
          { backgroundColor: "#fde8ef", borderColor: "#f0b8cc" },
        ]}
      >
        <Text style={s.statEmoji}>🌅</Text>
        <Text style={[s.statLabel, { color: "#a83058" }]}>Distance</Text>
        <Text style={[s.statValue, { color: "#e07a3a" }]}>
          {distance.km !== 0 ? distance.km + " km " : 0}
          {distance.m !== 0 ? distance.m + " m" : 0}
        </Text>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 12, borderWidth: 0.5, padding: 10 },
  statEmoji: { fontSize: 18, marginBottom: 4 },
  statLabel: {
    fontSize: 10,
    marginBottom: 2,
    fontFamily: "DMMono",
    letterSpacing: 0.4,
  },
  statValue: { fontSize: 22, color: "#3a2a18", fontFamily: "DMMono" },
});
