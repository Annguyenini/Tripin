import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Image } from 'expo-image'
import { View, TouchableOpacity, Text, Button, TextInput, Alert, StyleSheet, Dimensions, Modal } from 'react-native';
import { mainScreenStyle, footer } from '../styles/main_screen_styles.js'
import { navigate } from './custom_function/navigationService.js';
import { LocationPermission } from './functions/location_permision.js';
import { UserDataBottomSheet } from './bottom_sheet.js';
import UserDataService from '../../src/backend/storage/user.js'
import { ProfileImagePicker } from './custom_components/profile_image_picker.js'
import { AppState } from 'react-native';
import { startForegroundGPSTracker, endForegroundGPSTracker } from '../backend/gps_logic/foreground_gps_logic.js';
import CurrenTripDataService from '../backend/storage/current_trip.js'
import GPSLogic from '../backend/gps_logic/gps_logic.js';
import { MapBoxLayout } from './map_box/map_box_layout.js';
import { DATA_KEYS } from '../backend/storage/keys/storage_keys.js';
import Setting from '../app-core/setting.js';
import AppFlow from '../app-core/flow/app_flow.js'
import LoadingScreen from './map_box/components/fetching_loading_screen.js';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { BannerManager } from './overlay/banner_manager.js';
import { CameraApp } from './camera/camera_main.js';
import { TripsList } from './trips_list.js';
export const MainScreen = () => {
  // user profile state from local storage
  const [user_id, setUserId] = useState(UserDataService.getUserId())
  const [user_name, setUsername] = useState(UserDataService.getUserName())
  const [display_name, setDisplayName] = useState(UserDataService.getDisplayName())
  const [cameraVisible, setCameraVisible] = useState(false)
  const [tripsListVisible, setTripsListVisible] = useState(false)

  // controls whether map renders — waits for trip data to be ready
  const [tripDataSuccess, setTripDataSuccess] = useState(false)
  const isUserDataReady = useRef(false)

  const [show_profile_picker, set_show_profile_picker] = useState(false)
  const [state, setState] = useState(AppState.currentState)
  const gpsTask = useRef(null)

  // lock orientation, init settings, and fetch trip data on mount
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    const initSetting = async () => {
      await Setting.init()
      GPSLogic.syncGPSTask()
      const isTripDataReady = await AppFlow.onAppReady()
      setTripDataSuccess(isTripDataReady)
    }
    initSetting()
  }, []);

  // clear expo-image disk cache on mount if device storage is low
  useEffect(() => {
    const checkAndClearCache = async () => {
      const info = await FileSystem.getFreeDiskStorageAsync();
      const freeMB = info / 1024 / 1024;
      if (freeMB < 200) {
        await Image.clearDiskCache();
      }
    };
    checkAndClearCache()
  }, [])

  // start GPS tracker on mount, pause/resume based on app state, clean up on unmount
  useEffect(() => {
    const initGps = async () => {
      gpsTask.current = await startForegroundGPSTracker()
    }
    initGps()

    const getState = AppState.addEventListener('change', nextState => {
      setState(nextState)
      if (nextState === 'active') {
        if (!gpsTask.current) {
          gpsTask.current = startForegroundGPSTracker()
        }
      } else {
        endForegroundGPSTracker()
        gpsTask.current = null
      }
      GPSLogic.syncGPSTask()
    });

    return () => {
      getState.remove()
      gpsTask.current = null
      endForegroundGPSTracker()
    }
  }, [])

  const callCamera = () => navigate("Camera")
  const callSetting = () => navigate("Setting")
  const callAlbum = () => navigate('Album')



  // memoized to prevent map re-mounting on unrelated state changes
  const RenderMap = useCallback(() => {
    return <MapBoxLayout />
  }, [])

  return (
    <View style={styles.container}>
      {
        cameraVisible &&
        <Modal>
          <CameraApp onClose={() => setCameraVisible(false)} ></CameraApp>
        </Modal>
      }
      {
        tripsListVisible &&
        <Modal>
          <TripsList onClose={() => setTripsListVisible(false)}></TripsList>
        </Modal>
      }
      {/* <CameraApp></CameraApp> */}
      {/* floating location permission banner */}
      <BannerManager />
      {/* show map once trip data is ready, otherwise show loading */}
      {tripDataSuccess && RenderMap()}
      {!tripDataSuccess && <LoadingScreen />}

      {/* user profile bottom sheet */}
      <UserDataBottomSheet
        userId={user_id}
        userDisplayName={display_name}
        set_show_profile_picker={set_show_profile_picker}
      />

      {/* bottom nav bar */}
      <View style={footer.footerContainer}>
        <View style={footer.fotterrow}>
          <TouchableOpacity style={footer.fotterbutton}>
            <Ionicons name="home-outline" size={24} color="#00000" />
          </TouchableOpacity>
          <TouchableOpacity style={footer.fotterbutton} onPress={() => setTripsListVisible(true)}>
            <Ionicons name="map-outline" size={24} color="#00000" />
          </TouchableOpacity>
          <TouchableOpacity style={footer.fotterbutton} onPress={() => setCameraVisible(true)}>
            <Ionicons name="camera-outline" size={24} color="#00000" />
          </TouchableOpacity>
          <TouchableOpacity style={footer.fotterbutton} onPress={callAlbum}>
            <Ionicons name="images-outline" size={24} color="#00000" />
          </TouchableOpacity>
          <TouchableOpacity style={footer.fotterbutton} onPress={callSetting}>
            <Ionicons name="settings-outline" size={24} color="#00000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* profile image picker overlay */}
      {show_profile_picker && (
        <View style={mainScreenStyle.overlay}>
          <ProfileImagePicker set_show_profile_picker={set_show_profile_picker} />
        </View>
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
  },
  content: {
    padding: 30,
    flexDirection: 'row',
    backgroundColor: '#3d3b3bff',
    borderRadius: 20
  },
  overlay: {
    position: 'absolute',
    left: 10,
    right: 10,
    zIndex: 10,
  },
});