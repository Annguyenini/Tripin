import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import TripHandler from "../app-core/flow/trip_handler.js";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import { NewTripFiller } from "./functions/add_new_trip.js";
import TripDataService from "../backend/storage/trips.js";
import UserDataService from "../backend/storage/user.js";
import { DATA_KEYS } from "../backend/storage/keys/storage_keys.js";
import { TripCard } from "./custom_components/trip_label.js";
import { tripCardsStyle } from "../styles/function/tripcards.js";
import AppFlow from "../app-core/flow/app_flow.js";
import { UseOverlay } from "./overlay/overlay_main.js";
import TripDisplayObserver from "./map_box/functions/trip_display_observer.js";

const default_user_image = require('../../assets/image/profile_icon.png')

export const UserDataBottomSheet = ({ set_show_profile_picker, userDisplayName }) => {
  const bottomSheetRef = useRef(null)
  const snapPoints     = useMemo(() => ['20%', '95%'], [])

  const [snapIndex,            setSnapIndex]            = useState(0)
  const [showCreateTrip,       setShowCreateTrip]       = useState(false)
  const [trips,                setTrips]                = useState(null)
  const [userProfileImage,     setUserProfileImage]     = useState(UserDataService.getProfileImageUri())
  const [loadingText,          setLoadingText]          = useState(null)
  const [dataKey,              setDataKey]              = useState(0)

  const { showLoading, hideLoading, showErrorBox } = UseOverlay()

  // ── observers ──
  useEffect(() => {
    const onTripsUpdate    = { update: (trips) => setTrips(trips) }
    const onAvatarUpdate   = { update: (uri)   => { setUserProfileImage(uri); setDataKey(k => k + 1) } }
    const onSnapPointReset = { update: ()      => { setSnapIndex(0);          setDataKey(k => k + 1) } }

    TripDataService.attach(onTripsUpdate,    DATA_KEYS.TRIP.ALL_TRIP_LIST)
    UserDataService.attach(onAvatarUpdate,   DATA_KEYS.USER.USER_AVATAR)
    TripDisplayObserver.attach(onSnapPointReset, TripDisplayObserver.EVENTS)

    AppFlow.onRenderUserData()

    return () => {
      TripDataService.detach(onTripsUpdate,    DATA_KEYS.TRIP.ALL_TRIP_LIST)
      UserDataService.detach(onAvatarUpdate,   DATA_KEYS.USER.USER_AVATAR)
      TripDisplayObserver.detach(onSnapPointReset, TripDisplayObserver.EVENTS)
    }
  }, [])

  // ── handlers ──
  const handleRefresh = useCallback(async () => {
    setLoadingText("pulling your trips...")
    await TripHandler.refreshAllTripsData()
    setLoadingText(null)
  }, [])

  const handleCreateTrip = useCallback(async (trip_name, imageUri) => {
    showLoading()
    const res = await TripHandler.requestNewTripHandler(trip_name, imageUri ?? null)
    hideLoading()
    if (!res || res.status !== 200) {
      showErrorBox('Error Creating Trip', 'Please try again shortly!', 6000)
    }
    setShowCreateTrip(false)
  }, [])

  // ── list header ──
  const ListHeader = (
    <>
      {/* user card */}
      <View style={s.userCard}>
        <TouchableOpacity onPress={() => set_show_profile_picker(true)} activeOpacity={0.8}>
          <Image
            key={dataKey}
            source={userProfileImage ? { uri: userProfileImage } : default_user_image}
            style={s.avatar}
          />
          <View style={s.avatarEditBadge}>
            <Text style={s.avatarEditText}>✎</Text>
          </View>
        </TouchableOpacity>

        <View style={s.userInfo}>
          <Text style={s.displayName}>{userDisplayName}</Text>
          <Text style={s.displaySub}>your journeys</Text>
        </View>
      </View>

      {/* section header */}
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>All Trips</Text>
        <View style={s.sectionActions}>
          <TouchableOpacity style={s.iconBtn} onPress={handleRefresh} activeOpacity={0.7}>
            <Text style={s.iconBtnText}>↺</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.iconBtn, s.iconBtnPrimary]} onPress={() => setShowCreateTrip(true)} activeOpacity={0.7}>
            <Text style={[s.iconBtnText, s.iconBtnTextPrimary]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* loading text */}
      {loadingText && (
        <View style={s.loadingRow}>
          <Text style={s.loadingText}>{loadingText}</Text>
        </View>
      )}
    </>
  )

  return (
    <BottomSheet
      key={dataKey}
      ref={bottomSheetRef}
      index={snapIndex}
      snapPoints={snapPoints}
      backgroundStyle={s.sheetBg}
      handleIndicatorStyle={s.sheetHandle}
    >
      <BottomSheetFlatList
        data={trips ?? []}
        keyExtractor={(item, index) => (item?.id ?? index).toString()}
        numColumns={2}
        columnWrapperStyle={tripCardsStyle.row}
        renderItem={({ item }) => <TripCard trip={item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={s.listContent}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyIcon}>🗺️</Text>
            <Text style={s.emptyText}>no trips yet</Text>
            <Text style={s.emptySub}>tap + to start one</Text>
          </View>
        }
      />

      {showCreateTrip && (
        <NewTripFiller
          set_show_create_trip_filler={setShowCreateTrip}
          request_new_trip={handleCreateTrip}
        />
      )}
    </BottomSheet>
  )
}

const s = StyleSheet.create({
  // ── sheet ──
  sheetBg:     { backgroundColor: '#1a1917' },
  sheetHandle: { backgroundColor: '#3a3830', width: 40 },
  listContent: { paddingBottom: 80, paddingHorizontal: 12 },

  // ── user card ──
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: '#242220',
    borderRadius: 16,
    marginBottom: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#333',
  },

  avatarEditBadge: {
    position: 'absolute',
    bottom: 0, right: 0,
    width: 18, height: 18,
    borderRadius: 9,
    backgroundColor: '#f0f0ec',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarEditText: {
    fontSize: 9,
    color: '#1a1a1a',
  },

  userInfo: {
    flex: 1,
    gap: 3,
  },

  displayName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#f0f0ec',
    fontFamily: 'DMMono',
  },

  displaySub: {
    fontSize: 10,
    color: '#5a5550',
    letterSpacing: 0.12,
    fontFamily: 'DMMono',
  },

  // ── section header ──
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f0f0ec',
    fontFamily: 'DMMono',
    letterSpacing: 0.04,
  },

  sectionActions: {
    flexDirection: 'row',
    gap: 8,
  },

  iconBtn: {
    width: 32, height: 32,
    borderRadius: 8,
    backgroundColor: '#2a2826',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconBtnPrimary: {
    backgroundColor: '#f0f0ec',
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 3,
  },

  iconBtnText:        { fontSize: 18, color: '#888' },
  iconBtnTextPrimary: { color: '#1a1a1a' },

  // ── loading ──
  loadingRow: {
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 11,
    color: '#5a5550',
    fontFamily: 'DMMono',
    letterSpacing: 0.1,
  },

  // ── empty state ──
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyIcon: { fontSize: 40 },
  emptyText: {
    fontSize: 15,
    color: '#f0f0ec',
    fontFamily: 'DMMono',
  },
  emptySub: {
    fontSize: 11,
    color: '#5a5550',
    fontFamily: 'DMMono',
    letterSpacing: 0.1,
  },
})