import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, Pressable, Linking } from "react-native";
import * as Location from "expo-location";
import Permission from "../../backend/storage/settings/permissions";

export const LocationPermission = () => {
  const [foregroundGranted, setForegroundGranted] = useState(false);
  const [backgroundGranted, setBackgroundGranted] = useState(false);

  useEffect(() => {
    const init = async () => {
      const fg = await Location.requestForegroundPermissionsAsync();
      setForegroundGranted(fg.status === "granted");
      await Permission.setForeGroundPer(fg.status === "granted" ? "true" : "false");

      const bg = await Location.requestBackgroundPermissionsAsync();
      setBackgroundGranted(bg.status === "granted");
      await Permission.setBackGroundPer(bg.status === "granted" ? "true" : "false");
    };
    init();
  }, []);

  if (foregroundGranted && backgroundGranted) return null;

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {!foregroundGranted && (
        <View style={styles.banner}>
          <Text style={styles.text}>📍 Foreground location off</Text>
          <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]} onPress={() => Linking.openSettings()}>
            <Text style={styles.buttonText}>Enable</Text>
          </Pressable>
        </View>
      )}
      {foregroundGranted && !backgroundGranted && (
        <View style={styles.banner}>
          <Text style={styles.text}>🛰️ Background location off</Text>
          <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]} onPress={() => Linking.openSettings()}>
            <Text style={styles.buttonText}>Enable</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 12,
    zIndex: 1000,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 6,
    gap: 8,
  },
  text: {
    color: "#fff",
    fontSize: 11,
    marginRight: 4,
  },
  button: {
    backgroundColor: "#f0f0ec",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 11,
  },
});