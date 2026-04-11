import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import TripHandler from "../app-core/flow/trip_handler.js";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { TouchableOpacity, Text, StyleSheet, View, ScrollView, Modal } from "react-native";
import { Image } from "expo-image";
import { NewTripFiller } from "./functions/add_new_trip.js";
import TripDataService from "../backend/storage/trips.js";
import UserDataService from "../backend/storage/user.js";
import { DATA_KEYS } from "../backend/storage/keys/storage_keys.js";
import AppFlow from "../app-core/flow/app_flow.js";
import { UseOverlay } from "./overlay/overlay_main.js";
import TripDisplayObserver from "./map_box/functions/trip_display_observer.js";
import CurrentTripDataService from '../backend/storage/current_trip.js'
import { TestScreen } from "../test_screen.js";
const default_user_image = require('../../assets/image/profile_icon.png')
const default_image = require('../../assets/icon.png')

export const UserDataBottomSheet = ({ set_show_profile_picker, userDisplayName }) => {
  const bottomSheetRef = useRef(null)
  const [test, setTest] = useState(false)
  const [snapIndex, setSnapIndex] = useState(0)
  const [showCreateTrip, setShowCreateTrip] = useState(false)
  const [userProfileImage, setUserProfileImage] = useState(UserDataService.getProfileImageUri())
  const [tripImageCover, setTripImageCover] = useState(CurrentTripDataService.getCurrentTripImageUri())
  const [tripName, setTripName] = useState(CurrentTripDataService.getCurrentTripName())
  const [dataKey, setDataKey] = useState(0)
  const { showLoading, hideLoading, showErrorBox } = UseOverlay()
  const [isOnATrip, setIsOnATrip] = useState(false)
  useEffect(() => {
    const onAvatarUpdate = { update: (uri) => { setUserProfileImage(uri); setDataKey(k => k + 1) } }
    const onSnapPointReset = { update: () => { setSnapIndex(0); setDataKey(k => k + 1) } }

    UserDataService.attach(onAvatarUpdate, DATA_KEYS.USER.USER_AVATAR)
    TripDisplayObserver.attach(onSnapPointReset, TripDisplayObserver.EVENTS)
    AppFlow.onRenderUserData()

    return () => {
      UserDataService.detach(onAvatarUpdate, DATA_KEYS.USER.USER_AVATAR)
      TripDisplayObserver.detach(onSnapPointReset, TripDisplayObserver.EVENTS)
    }
  }, [])
  useEffect(() => {
    const updateTripData = {
      update(newTripData) {
        if (!newTripData) {
          setIsOnATrip(false)
        }
        const newName = newTripData.trip_name
        const newImage = newTripData.image
        setTripName(newName)
        setTripImageCover(newImage)
        setIsOnATrip(true)
      }
    }
    CurrentTripDataService.attach(updateTripData, DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA);
    return () => CurrentTripDataService.detach(updateTripData, DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA);

  }, [])


  const handleCreateTrip = useCallback(async (trip_name, imageUri) => {
    showLoading()
    const res = await TripHandler.requestNewTripHandler(trip_name, imageUri ?? null)
    hideLoading()
    if (!res || res.status !== 200) showErrorBox('Error Creating Trip', res.data.message, 6000)
    setShowCreateTrip(false)
  }, [])

  return (
    <BottomSheet
      key={dataKey}
      ref={bottomSheetRef}
      snapPoints={['20%', '50%']}
      index={snapIndex}
      backgroundStyle={s.sheetBg}
      handleIndicatorStyle={s.sheetHandle}
    >
      <BottomSheetScrollView contentContainerStyle={s.container}>

        {/* ── user card ── */}
        <View style={s.userCard}>
          <TouchableOpacity onPress={() => set_show_profile_picker(true)} activeOpacity={0.8} style={s.avatarWrap}>
            <Image
              cachePolicy="memory-disk"
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
          <TouchableOpacity onPress={() => setTest(true)}><Text>test</Text></TouchableOpacity>
          {test &&
            <Modal>
              <TestScreen testScreenHandler={() => setTest(false)}></TestScreen></Modal>}


        </View>
        {!isOnATrip &&
          <>
            <Text style={s.tripName}>No active Trip Add One?</Text>
            <TouchableOpacity style={[s.iconBtn, s.iconBtnPrimary]} onPress={() => setShowCreateTrip(true)} activeOpacity={0.7}>
              <Text style={s.iconBtnTextPrimary}>+</Text>
            </TouchableOpacity>

          </>}
        {/* ── trip title ── */}
        {isOnATrip &&
          <>
            <View style={s.titleRow}>
              <Image
                cachePolicy='memory-disk'
                source={tripImageCover ? { uri: tripImageCover } : default_image}
                style={s.image}
              />
              <View style={s.titleBlock}>

                <Text style={s.tripName}>{tripName}</Text>
                <View style={s.statusRow}>
                  <View style={s.statusDot} />
                  <Text style={s.statusText}>Day 3 of 6 · Heading south</Text>
                </View>
              </View>
              <TouchableOpacity style={s.upBtn} activeOpacity={0.8}>
                <Text style={s.upBtnText}>↑</Text>
              </TouchableOpacity>
            </View>

            {/* ── stat cards ── */}
            <View style={s.statsRow}>
              <View style={[s.statCard, { backgroundColor: '#fef3e2', borderColor: '#f5d8a8' }]}>
                <Text style={s.statEmoji}>🛣️</Text>
                <Text style={[s.statLabel, { color: '#b86a10' }]}>Travel</Text>
                <Text style={s.statValue}>482Km</Text>
              </View>
              <View style={[s.statCard, { backgroundColor: '#e8f4fd', borderColor: '#b8d8f0' }]}>
                <Text style={s.statEmoji}>📸</Text>
                <Text style={[s.statLabel, { color: '#2a6aaa' }]}>Shots taken</Text>
                <Text style={s.statValue}>128</Text>
              </View>
              <View style={[s.statCard, { backgroundColor: '#fde8ef', borderColor: '#f0b8cc' }]}>
                <Text style={s.statEmoji}>🌅</Text>
                <Text style={[s.statLabel, { color: '#a83058' }]}>Days left</Text>
                <Text style={[s.statValue, { color: '#e07a3a' }]}>4</Text>
              </View>
            </View>

            {/* ── memories divider ── */}
            <View style={s.dividerRow}>
              <View style={s.dividerLine} />
              <Text style={s.dividerLabel}>MEMORIES</Text>
              <View style={s.dividerLine} />
            </View>

            {/* ── memory cards ── */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.memoriesScroll}>
              {/* map memories here */}
            </ScrollView>
          </>}
      </BottomSheetScrollView>

      {showCreateTrip && (
        <Modal>
          <NewTripFiller
            set_show_create_trip_filler={setShowCreateTrip}
            request_new_trip={handleCreateTrip}
          />
        </Modal>
      )}
    </BottomSheet>
  )
}

const s = StyleSheet.create({
  sheetBg: { backgroundColor: '#1a1917' },
  sheetHandle: { backgroundColor: '#3a3830', width: 40 },
  container: { paddingHorizontal: 16, paddingBottom: 40 },

  // ── user card ──
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: '#242220',
    borderRadius: 14,
    marginBottom: 16,
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3a3830' },
  avatarEditBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#f0f0ec',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEditText: { fontSize: 9, color: '#1a1a1a' },
  userInfo: { flex: 1, gap: 2 },
  displayName: { fontSize: 15, color: '#f0f0ec', fontFamily: 'DMMono' },
  displaySub: { fontSize: 10, color: '#5a5550', fontFamily: 'DMMono', fontStyle: 'italic' },
  iconBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: '#2a2826',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  iconBtnPrimary: { backgroundColor: '#f0f0ec', borderColor: 'transparent' },
  iconBtnText: { fontSize: 16, color: '#888' },
  iconBtnTextPrimary: { fontSize: 20, color: '#1a1a1a' },
  loadingText: { fontSize: 9, color: '#5a5550', fontFamily: 'DMMono' },

  // ── title ──
  titleRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 16,
  },
  titleBlock: { flex: 1 },
  tripName: { fontSize: 22, color: '#f0f0ec', fontFamily: 'DMMono', marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4caf50' },
  statusText: { fontSize: 12, color: '#a08060', fontFamily: 'DMMono', fontStyle: 'italic' },
  upBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#e07a3a', alignItems: 'center', justifyContent: 'center',
  },
  upBtnText: { color: '#fff', fontSize: 16 },

  // ── stats ──
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 12, borderWidth: 0.5, padding: 10 },
  statEmoji: { fontSize: 18, marginBottom: 4 },
  statLabel: { fontSize: 10, marginBottom: 2, fontFamily: 'DMMono', letterSpacing: 0.4 },
  statValue: { fontSize: 22, color: '#3a2a18', fontFamily: 'DMMono' },

  // ── divider ──
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: '#3a3830' },
  dividerLabel: { fontSize: 9, color: '#5a5550', fontFamily: 'DMMono', letterSpacing: 2 },

  // ── memories ──
  memoriesScroll: { paddingBottom: 8, gap: 10 },
  memCard: {
    width: 110, backgroundColor: '#242220', borderRadius: 8,
    paddingTop: 6, paddingHorizontal: 6, paddingBottom: 22,
  },
  memCardFaded: { opacity: 0.45 },
  memThumb: { width: '100%', height: 70, borderRadius: 6, marginBottom: 6 },
  memLabel: { fontSize: 10, color: '#f0f0ec', fontFamily: 'DMMono', fontStyle: 'italic', marginBottom: 2 },
  memSub: { fontSize: 9, color: '#5a5550', fontFamily: 'DMMono' },
  image: {
    width: '14%',
    height: '130%',
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,

    backgroundColor: '#242220',
  },
})