import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  PanResponder,
  Modal,
} from "react-native";
import { navigate, navigateToAuth } from "../navigation/navigationService";
import { settingStyle } from "../../styles/setting_style";
import CurrentTripDataService from "../../backend/storage/hot_data/current_trip";
import UserDataService from "../../backend/storage/async_storage/user";
import TripService from "../../backend/gps_logic/gps_logic";
import TokenService from "../../backend/storage/tokens/token_service";
import LocalStorage from "../../backend/storage/async_storage/localStorage";
import safeRun from "../../app-core/helpers/safe_run";
import ProfileScreen from "./profile";
import GPSSetting from "./gps";
import { Linking } from "react-native";
const Localstorage = new LocalStorage();
export const SettingScreen = ({ onclose }) => {
  const [profileVisible, setProfileVisible] = useState(false);
  const [GPSVisible, setGPSVisible] = useState(false);

  const callLogout = async () => {
    // await AuthService.requestLogout();
    navigateToAuth();
    // console.log("signout");
    await safeRun(
      () => TokenService.deleteToken("access_token"),
      "failed_at_delete_access_token",
    );
    await safeRun(
      () => TokenService.deleteToken("refresh_token"),
      "failed_at_delete_refresh_token",
    );
    await safeRun(
      () => UserDataService.deleteAllUserData(),
      "failed_at_delete_user_data",
    );
    await safeRun(
      () => CurrentTripDataService.endCurrentTrip(),
      "failed_at_reset_trip_data",
    );
    await safeRun(() => TripService.endGPSLogic(), "failed_at_end_gps_logic");
    await safeRun(
      () => Localstorage.clearAllStorage(),
      "failed_at_clear_storage",
    );
    // console.log("signout1");
  };
  return (
    <View style={settingStyle.container}>
      <View style={settingStyle.header}>
        <TouchableOpacity onPress={onclose} style={settingStyle.closeBtn}>
          <Text style={settingStyle.closeText}>✕ close</Text>
        </TouchableOpacity>
        <Text style={settingStyle.screenTitle}>Settings</Text>
      </View>

      <View style={settingStyle.profileSection}>
        {/* <Text style={settingStyle.avatarEmoji}>🧭</Text>
                <Text style={settingStyle.username}>Traveler</Text>
                <Text style={settingStyle.email}>user@email.com</Text> */}
      </View>

      <Text style={settingStyle.sectionLabel}>PROFILE</Text>
      <SettingRow
        onPress={() => setProfileVisible(true)}
        icon="🪪"
        label="Profile"
        sub="name, photo, bio"
      />

      <Text style={settingStyle.sectionLabel}>NAVIGATION</Text>
      <SettingRow
        onPress={() => setGPSVisible(true)}
        icon="📍"
        label="GPS"
        sub="accuracy, interval, background"
      />
      <Text style={settingStyle.sectionLabel}>POLICIES</Text>
      <TouchableOpacity
        onPress={() => Linking.openURL("https://tripping.live/privacy")}
        style={settingStyle.PoliciesItems}
      >
        <Text style={settingStyle.logoutText}>Privacy</Text>
      </TouchableOpacity>

      <Text style={settingStyle.sectionLabel}>APP</Text>
      {/* <SettingRow icon="🌐" label="Language" sub="English" /> */}
      {/* <SettingRow icon="🔔" label="Notifications" sub="trips, reminders" /> */}

      <TouchableOpacity onPress={callLogout} style={settingStyle.logoutRow}>
        <View style={[settingStyle.iconBox, { backgroundColor: "#fde8d8" }]}>
          <Text style={settingStyle.iconText}>👋</Text>
        </View>
        <Text style={settingStyle.logoutText}>Log out</Text>
      </TouchableOpacity>
      {profileVisible && (
        <View style={settingStyle.profileOverlay}>
          <ProfileScreen onClose={() => setProfileVisible(false)} />
        </View>
      )}

      <Modal
        visible={GPSVisible}
        animationType="slide"
        onRequestClose={() => setGPSVisible(false)}
      >
        <GPSSetting onClose={() => setGPSVisible(false)} />
      </Modal>
    </View>
  );
};
const SettingRow = ({ icon, label, sub, onPress }) => (
  <TouchableOpacity style={settingStyle.row} onPress={onPress}>
    <View style={settingStyle.rowLeft}>
      <View style={settingStyle.iconBox}>
        <Text style={settingStyle.iconText}>{icon}</Text>
      </View>
      <View>
        <Text style={settingStyle.rowLabel}>{label}</Text>
        <Text style={settingStyle.rowSub}>{sub}</Text>
      </View>
    </View>
    <Text style={settingStyle.arrow}>›</Text>
  </TouchableOpacity>
);

const UserDataScreen = () => {
  const [username, setUsername] = useState(
    UserDataService.getUserName() ?? null,
  );
  const [displayName, setdisplayName] = useState(
    UserDataService.getDisplayName() ?? null,
  );
  const [avatar, setAvatar] = useState(
    UserDataService.getProfileImageUri() ?? null,
  );
  useEffect(() => {});
};
