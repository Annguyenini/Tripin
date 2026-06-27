import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { Image } from "expo-image";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { mainScreenStyle, footer } from "../styles/main_screen_styles";
import { navigate } from "./navigation/navigationService";
import { UserDataBottomSheet } from "./trip-components/bottom_sheet/bottom_sheet";
import { AppState } from "react-native";
import {
  startForegroundGPSTracker,
  endForegroundGPSTracker,
} from "../backend/gps_logic/foreground_gps_logic";
import GPSLogic from "../backend/gps_logic/gps_logic";
import { MapBoxLayout } from "./trip-components/map_box_layout";
import { DATA_KEYS } from "../backend/storage/hot_data/keys/storage_keys";
import Setting from "../app-core/setting";
import AppFlow from "../app-core/flow/app_flow.ts";
import LoadingScreen from "./overlay/fetching_loading_screen";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import { BannerManager } from "./overlay/banner_manager";
import { CameraApp } from "./camera/camera_main";
import { TripsList } from "./trips_list";
import { SettingScreen } from "./setting/setting_screen";
import CurrentTripDataService from "../backend/storage/hot_data/current_trip";
import { NewTripFiller } from "./trip-components/components/helpers/add_new_trip";
import AlbumScreen from "./albums/album";
const Map = React.memo(({}) => {
  return <MapBoxLayout></MapBoxLayout>;
});
export const MainScreen = () => {
  // user profile state from local storage

  const [cameraVisible, setCameraVisible] = useState(false);
  const [tripsListVisible, setTripsListVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [albumVisible, setAlbumVisible] = useState(false);
  // controls whether map renders — waits for trip data to be ready
  const [tripDataSuccess, setTripDataSuccess] = useState(false);
  const isUserDataReady = useRef(false);
  const [isOnATrip, setIsOnATrip] = useState(
    CurrentTripDataService.getCurrentTripStatus(),
  );
  // const [show_profile_picker, set_show_profile_picker] = useState(false)
  const [state, setState] = useState(AppState.currentState);
  const [createTripScreen, setCreateTripScreen] = useState(false);
  const gpsTask = useRef(null);

  // lock orientation, init settings, and fetch trip data on mount
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    const initSetting = async () => {
      // await Setting.init();
      // GPSLogic.syncGPSTask();
      const isTripDataReady = await AppFlow.onAppReady();
      setTripDataSuccess(isTripDataReady);
    };
    initSetting();
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
    checkAndClearCache();
  }, []);

  // start GPS tracker on mount, pause/resume based on app state, clean up on unmount
  useEffect(() => {
    const initGps = async () => {
      try {
        gpsTask.current = await startForegroundGPSTracker();
      } catch (err) {
        console.error(`fail to start foreground GPS Tracker: ${err}`);
      }
    };
    initGps();

    const getState = AppState.addEventListener("change", async (nextState) => {
      setState(nextState);
      if (nextState === "active") {
        if (!gpsTask.current) {
          try {
            gpsTask.current = await startForegroundGPSTracker();
          } catch (err) {
            console.error(`fail to start foreground GPS Tracker: ${err}`);
          }
        }
      } else {
        try {
          gpsTask.current = await endForegroundGPSTracker();
        } catch (err) {
          console.error(`fail to end foreground GPS Tracker: ${err}`);
        }
        gpsTask.current = null;
      }
      // GPSLogic.syncGPSTask();
    });

    return async () => {
      getState.remove();
      gpsTask.current = null;
      try {
        gpsTask.current = await endForegroundGPSTracker();
      } catch (err) {
        console.error(`fail to end foreground GPS Tracker: ${err}`);
      }
    };
  }, []);

  useEffect(() => {
    const updateTripStatus = {
      update(newTripData) {
        if (newTripData) {
          setIsOnATrip(true);
          return;
        }
        setIsOnATrip(false);
      },
    };
    CurrentTripDataService.attach(
      updateTripStatus,
      DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA,
    );
    return () =>
      CurrentTripDataService.detach(
        updateTripStatus,
        DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA,
      );
  }, []);
  const callAlbum = () => navigate("Album");

  // memoized to prevent map re-mounting on unrelated state changes

  const hideAllScreen = () => {
    setCameraVisible(false);
    setSettingVisible(false);
    setTripsListVisible(false);
  };

  return (
    <View style={styles.container}>
      <BannerManager />
      {cameraVisible && (
        <Modal>
          <CameraApp onClose={() => setCameraVisible(false)}></CameraApp>
        </Modal>
      )}
      {tripsListVisible && (
        <View style={styles.tripsOverlay}>
          <TripsList onClose={() => setTripsListVisible(false)} />
        </View>
      )}
      {settingVisible && (
        <View style={styles.settingOverlay}>
          <SettingScreen
            onclose={() => setSettingVisible(false)}
          ></SettingScreen>
        </View>
      )}
      {albumVisible && (
        <View style={styles.albumOverlay}>
          <AlbumScreen onClose={() => setAlbumVisible(false)}></AlbumScreen>
        </View>
      )}
      {/* show map once trip data is ready, otherwise show loading */}
      {/* {tripDataSuccess && RenderMap()}*/}
      <Map></Map>
      {!tripDataSuccess && <LoadingScreen />}

      {/* user profile bottom sheet */}
      <UserDataBottomSheet />

      {/* bottom nav bar */}
      {/* bottom nav bar */}
      <View style={footer.footerContainer}>
        <View style={footer.fotterrow}>
          <TouchableOpacity
            style={footer.fotterbutton}
            onPress={() => hideAllScreen()}
          >
            <Ionicons name="home-outline" size={22} color="#888" />
            <Text style={footer.footerText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={footer.fotterbutton}
            onPress={() => setTripsListVisible((prev) => !prev)}
          >
            <Ionicons name="map-outline" size={22} color="#888" />
            <Text style={footer.footerText}>Trips</Text>
          </TouchableOpacity>

          {/* hero buttons */}
          <View style={footer.heroGroup}>
            <View style={footer.heroItem}>
              <TouchableOpacity
                style={footer.heroButton}
                onPress={() => setCameraVisible(true)}
              >
                <Ionicons name="camera-outline" size={24} color="#0d0c0a" />
              </TouchableOpacity>
              <Text style={footer.heroText}>Camera</Text>
            </View>
            {!isOnATrip && (
              <View style={footer.heroItem}>
                <TouchableOpacity
                  style={footer.heroButton}
                  onPress={() => setCreateTripScreen(true)}
                >
                  <Ionicons name="add" size={26} color="#0d0c0a" />
                </TouchableOpacity>
                <Text style={footer.heroText}>New Trip</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={footer.fotterbutton}
            onPress={() => setAlbumVisible((prev) => !prev)}
          >
            <Ionicons name="images-outline" size={22} color="#888" />
            <Text style={footer.footerText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={footer.fotterbutton}
            onPress={() => setSettingVisible((prev) => !prev)}
          >
            <Ionicons name="settings-outline" size={22} color="#888" />
            <Text style={footer.footerText}>Setting</Text>
          </TouchableOpacity>
        </View>
      </View>
      {createTripScreen && (
        <Modal>
          <NewTripFiller
            set_show_create_trip_filler={() => setCreateTripScreen(false)}
          ></NewTripFiller>
        </Modal>
      )}
      {/* profile image picker overlay */}
      {/* {show_profile_picker && (
        <View style={mainScreenStyle.overlay}>
          <ProfileImagePicker set_show_profile_picker={set_show_profile_picker} />
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
  },
  content: {
    padding: 30,
    flexDirection: "row",
    backgroundColor: "#3d3b3bff",
    borderRadius: 20,
  },
  overlay: {
    position: "absolute",
    left: 10,
    right: 10,
    zIndex: 10,
  },
  tripsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: Dimensions.get("window").height * 0.01, // adjust to clear your bottom sheet + bottom nav height
    zIndex: 500,
    backgroundColor: "#1a1917",
  },
  settingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: Dimensions.get("window").height * 0.01, // adjust to clear your bottom sheet + bottom nav height
    zIndex: 500,
    backgroundColor: "#1a1917",
  },
  albumOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: Dimensions.get("window").height * 0.01, // adjust to clear your bottom sheet + bottom nav height
    zIndex: 500,
    backgroundColor: "#1a1917",
  },
});
