import TripHandler from "../app-core/flow/trip_handler.js";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Modal,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import TripDataService from "../backend/storage/database/trips.js";
import UserDataService from "../backend/storage/database/user.js";
import { DATA_KEYS } from "../backend/storage/hot_data/keys/storage_keys.js";
import { TripCard } from "./trip-compoments/bottom_sheet/trips_card/trip_label.js";
import { tripCardsStyle } from "../styles/function/tripcards.js";
import AppFlow from "../app-core/flow/app_flow.js";
import { UseOverlay } from "./overlay/overlay_main.js";
import TripDisplayObserver from "./trip-compoments/observers/trip_display_observer.js";
import { TestScreen } from "../test_screen.js";
const default_user_image = require("../../assets/image/profile_icon.png");
import { TripSkeleton } from "./custom_components/skeleton.js";
export const TripsList = ({ onClose }) => {
  const [trips, setTrips] = useState(null);
  const [loadingText, setLoadingText] = useState(null);
  const [test, setTest] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const { showLoading, hideLoading, showErrorBox } = UseOverlay();
  const tripLoading = () => {
    return showLoading([
      "Getting your trips...",
      "Unpacking the memories...",
      "Dusting off the map...",
      "Almost there...",
    ]);
  };
  const hideTripLoading = () => {
    return hideLoading();
  };
  useEffect(() => {
    const initLoad = () => {
      tripLoading();
      setTimeout(() => hideTripLoading(), 7000);
    };
    initLoad();
  }, []);
  // ── observers ──
  useEffect(() => {
    const onTripsUpdate = {
      update(trips) {
        setTrips(trips);
        hideTripLoading();
      },
    };
    const onAvatarUpdate = {
      update: (uri) => {
        setUserProfileImage(uri);
        setDataKey((k) => k + 1);
      },
    };

    TripDataService.attach(onTripsUpdate, DATA_KEYS.TRIP.ALL_TRIP_LIST);
    UserDataService.attach(onAvatarUpdate, DATA_KEYS.USER.USER_AVATAR);

    AppFlow.onRenderUserData();

    return () => {
      TripDataService.detach(onTripsUpdate, DATA_KEYS.TRIP.ALL_TRIP_LIST);
      UserDataService.detach(onAvatarUpdate, DATA_KEYS.USER.USER_AVATAR);
    };
  }, []);

  // ── handlers ──
  const handleRefresh = useCallback(async () => {
    tripLoading();
    setLoadingText("pulling your trips...");
    try {
      await TripHandler.refreshAllTripsData();
    } catch (err) {
      console.error("failed at refrsh trips");
    } finally {
      hideTripLoading();
    }
    setLoadingText(null);
  }, []);
  const removeTripHandler = (trip_needed_delete) => {
    trips =
      trips.filter((trip) => trip.trip_id !== trip_needed_delete.trip_id) ?? [];
  };
  // ── list header ──
  const ListHeader = (
    <View style={s.sectionHeader}>
      <TouchableOpacity style={s.iconBtn} onPress={onClose} activeOpacity={0.7}>
        <Text style={s.iconBtnText}>←</Text>
      </TouchableOpacity>
      <Text style={s.sectionTitle}>All Trips</Text>

      <View style={s.sectionActions}>
        <TouchableOpacity
          style={s.iconBtn}
          onPress={handleRefresh}
          activeOpacity={0.7}
        >
          <Text style={s.iconBtnText}>↺</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const ErrorScreen = ({ title, message }) => (
    <View style={e.container}>
      <Text style={e.icon}>✕</Text>
      <Text style={e.title}>{title}</Text>
      {message && <Text style={e.message}>{message}</Text>}
    </View>
  );
  return (
    <FlatList
      style={s.background}
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
      contentContainerStyle={s.listContent}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={
        initialLoad ? (
          <TripSkeleton></TripSkeleton>
        ) : (
          <View style={s.emptyState}>
            <Text style={s.emptyIcon}>🗺️</Text>
            <Text style={s.emptyText}>no trips yet</Text>
            <Text style={s.emptySub}>tap + to start one</Text>
          </View>
        )
      }
    />
  );
};

const s = StyleSheet.create({
  sheetBg: { backgroundColor: "#1a1917" },
  background: { backgroundColor: "#3a3830" },
  listContent: { paddingBottom: 80, paddingHorizontal: 12 },

  // ── user card ──
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    backgroundColor: "#242220",
    borderRadius: 16,
    marginBottom: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#333",
  },

  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#f0f0ec",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarEditText: {
    fontSize: 9,
    color: "#1a1a1a",
  },

  userInfo: {
    flex: 1,
    gap: 3,
  },

  displayName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#f0f0ec",
    fontFamily: "DMMono",
  },

  displaySub: {
    fontSize: 10,
    color: "#5a5550",
    letterSpacing: 0.12,
    fontFamily: "DMMono",
  },

  // ── section header ──
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 70,
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f0f0ec",
    fontFamily: "DMMono",
    letterSpacing: 0.04,
  },

  sectionActions: {
    flexDirection: "row",
    gap: 8,
  },

  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#2a2826",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  iconBtnPrimary: {
    backgroundColor: "#f0f0ec",
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 3,
  },

  iconBtnText: { fontSize: 18, color: "#888" },
  iconBtnTextPrimary: { color: "#1a1a1a" },

  // ── loading ──
  loadingRow: {
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 11,
    color: "#5a5550",
    fontFamily: "DMMono",
    letterSpacing: 0.1,
  },

  // ── empty state ──
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyIcon: { fontSize: 40 },
  emptyText: {
    fontSize: 15,
    color: "#f0f0ec",
    fontFamily: "DMMono",
  },
  emptySub: {
    fontSize: 11,
    color: "#5a5550",
    fontFamily: "DMMono",
    letterSpacing: 0.1,
  },
});
