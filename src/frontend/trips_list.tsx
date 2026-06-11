import TripHandler from "../app-core/flow/handlers/trip_handler";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { TouchableOpacity, Text, View, FlatList } from "react-native";
import TripDataService from "../backend/storage/database/trips";
import { DATA_KEYS } from "../backend/storage/hot_data/keys/storage_keys";
import { TripCard } from "./trip-components/bottom_sheet/trips_card/trip_label";
import { tripCardsStyle } from "../styles/function/tripcards";
import { UseOverlay } from "./overlay/overlay_main";
import { TripListStyle } from "../styles/trip-components/trips_list";
import { TripSkeleton } from "./custom_components/skeleton";
import { Trip_Data } from "../types/trip_data.types";
export const TripsList = ({ onClose }) => {
  const [trips, setTrips] = useState(null);
  const [initialLoad, setInitialLoad] = useState(false);
  const { showLoading, hideLoading, showErrorBox } = UseOverlay();
  const loadingRef = useRef(null);
  //---------Custom loading-----------------------
  const loadingSteps = [
    "Getting your trips...",
    "Look like There are NOTHING",
    "Unpacking the memories...",
    "Dusting off the map...",
    "Almost there...",
  ];

  const TripLoading = () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    showLoading(() => HideTripLoading, loadingSteps);
  };
  const HideTripLoading = () => {
    console.log("end", loadingRef.current);
    if (!loadingRef.current) return;
    console.log("end");

    hideLoading();
    loadingRef.current = false;
  };

  //----------------------initial load and update handler--------------
  const requestTripsData = async () => {
    await TripHandler.requestAllTripHandler();
  };
  // initial loading
  useEffect(() => {
    const initLoad = async () => {
      TripLoading();
      await requestTripsData().then(() => {
        HideTripLoading();
      });
    };
    initLoad();
  }, []);
  // ── observers (update new data ) ──
  useEffect(() => {
    const onTripsUpdate = {
      update(trips: Trip_Data) {
        setTrips(trips);
      },
    };

    TripDataService.attach(onTripsUpdate, DATA_KEYS.TRIP.ALL_TRIP_LIST);

    return () => {
      TripDataService.detach(onTripsUpdate, DATA_KEYS.TRIP.ALL_TRIP_LIST);
    };
  }, []);

  // ── -----------------------------refresh handlers ──--------------------
  const handleRefresh = useCallback(async () => {
    TripLoading();
    await TripHandler.refreshAllTripsData().then(() => {
      HideTripLoading();
    });
  }, []);
  //------------------------------remove trip handler--------------------------
  const removeTripHandler = (trip_needed_delete: Trip_Data) => {
    const trip =
      trips.filter(
        (trip: Trip_Data) => trip.trip_id !== trip_needed_delete.trip_id,
      ) ?? [];
  };
  // ── list header ──
  const ListHeader = (
    <View style={TripListStyle.sectionHeader}>
      <TouchableOpacity
        style={TripListStyle.iconBtn}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <Text style={TripListStyle.iconBtnText}>←</Text>
      </TouchableOpacity>
      <Text style={TripListStyle.sectionTitle}>All Trips</Text>

      <View style={TripListStyle.sectionActions}>
        <TouchableOpacity
          style={TripListStyle.iconBtn}
          onPress={handleRefresh}
          activeOpacity={0.7}
        >
          <Text style={TripListStyle.iconBtnText}>↺</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      style={TripListStyle.background}
      data={trips ?? []}
      keyExtractor={(item, index) => (item?.id ?? index).toString()}
      numColumns={2}
      columnWrapperStyle={tripCardsStyle.row}
      renderItem={({ item }) => (
        <TripCard
          trip={item}
          navigateMain={onClose}
          removeTripLabel={removeTripHandler}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={TripListStyle.listContent}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={
        initialLoad ? (
          <TripSkeleton></TripSkeleton>
        ) : (
          <View style={TripListStyle.emptyState}>
            <Text style={TripListStyle.emptyIcon}>🗺️</Text>
            <Text style={TripListStyle.emptyText}>no trips yet</Text>
            <Text style={TripListStyle.emptySub}>tap + to start one</Text>
          </View>
        )
      }
    />
  );
};
