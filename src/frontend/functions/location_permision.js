import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, Pressable } from "react-native";
import * as Location from "expo-location";

export const LocationPermission = () => {
  const [foregroundGranted, setForegroundGranted] = useState(false);
  const [backgroundGranted, setBackgroundGranted] = useState(false);

  // Ask foreground ONCE
  useEffect(() => {
    const init = async () => {
      const fg = await Location.requestForegroundPermissionsAsync();
      setForegroundGranted(fg.status === "granted");
       if (fg.status!== "granted"){
      console.warn("Location denied")
      } 
      const bg = await Location.requestBackgroundPermissionsAsync()
      setBackgroundGranted(bg.status ==='granted')
      if (bg.status!== "granted"){
      console.warn("Location denied")
      } 
    };

    init();
  }, []);

  const requestForegroundPermission = async()=>{
    const fg = await Location.requestForegroundPermissionsAsync()
    setForegroundGranted(fg.status==="granted")
    if (fg.status!== "granted"){
      console.warn("Location denied")
    } 
  }

  const requestBackgroundPermission = async () => {
    if (!foregroundGranted) return;

    // iOS requires actual usage
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });

    const bg = await Location.requestBackgroundPermissionsAsync();

    if (bg.status === "granted") {
      setBackgroundGranted(true);
    } else {
      console.warn("Background location denied");
    }
  };

  // Hide banner once granted
  if (backgroundGranted) return null;

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {!backgroundGranted&&
      <View style={styles.banner}>
        <Text style={styles.text}>
          Enable background location to track trips automatically.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.7 },
          ]}
          onPress={requestBackgroundPermission}
        >
          <Text style={styles.buttonText}>Enable</Text>
        </Pressable>
      </View>
}
{!foregroundGranted&&
      <View style={styles.banner}>
        <Text style={styles.text}>
          Enable background location.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.7 },
          ]}
          onPress={requestForegroundPermission}
        >
          <Text style={styles.buttonText}>Enable</Text>
        </Pressable>
      </View>
}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: "center",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginHorizontal: 12,
    elevation: 6,
  },
  text: {
    color: "#fff",
    flex: 1,
    fontSize: 13,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 13,
  },
});
