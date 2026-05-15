import * as Application from "expo-application";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as API from "../../config/config_api";

const IOS_URL = process.env.APP_IOS_URL;

const requestAppVersion = async () => {
  try {
    const respond = await fetch(API.APP_VERSION, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });
    const data = await respond.json();
    return data?.version;
  } catch (err) {
    console.error(err);
    return null;
  }
};

function isOutdated(local, server) {
  const l = local.split(".").map(Number);
  const s = server.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (s[i] > l[i]) return true;
    if (s[i] < l[i]) return false;
  }
  return false;
}

export default function AppVersionValidation() {
  const [needsUpdate, setNeedsUpdate] = useState(false);

  useEffect(() => {
    const updateValidation = async () => {
      const local_version = Application.nativeApplicationVersion;
      const app_version = await requestAppVersion();
      if (
        local_version &&
        app_version &&
        isOutdated(local_version, app_version)
      ) {
        setNeedsUpdate(true);
      }
    };
    updateValidation();
  }, []);

  const handleUpdate = () => {
    Linking.openURL(Platform.OS === "ios" ? IOS_URL : ANDROID_URL);
  };

  return (
    <Modal visible={needsUpdate} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>New Version Available</Text>
          <Text style={styles.message}>
            Please update the app to get the latest features and fixes.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fdf6ee",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 32,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontFamily: "DMMono",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#0d0c0a",
  },
  message: {
    fontFamily: "DMMono",
    fontSize: 13,
    color: "#555",
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#0d0c0a",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "DMMono",
    color: "#fdf6ee",
    fontSize: 14,
    fontWeight: "600",
  },
});
