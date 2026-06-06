import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Pressable,
  Linking,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import Permission from "../../backend/storage/settings/permissions";
import network_observer from "../../app-core/flow/sync/network_observer";
import { _registerNetworkCallback } from "../../app-core/flow/sync/network_observer";
import TripContentsSync from "../../app-core/flow/sync/trip_content_sync";
import { SyncBanner } from "./syncing_banner";
import {
  SatelliteOffIcon,
  SatelliteOnIcon,
} from "../../styles/icons/satellite";
import { LocationOffIcon } from "../../styles/icons/navigation";

// ── Offline ──────────────────────────────────────────────────────────────────
const OfflineBanner = () => {
  const dotOpacity = useRef(new Animated.Value(0.4)).current;
  const slashOpacity = useRef(new Animated.Value(1)).current;
  const arcOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 0.1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.4,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(arcOpacity, {
          toValue: 0.2,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(arcOpacity, {
          toValue: 0.8,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(slashOpacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slashOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.banner}>
      <View style={styles.wifiIcon}>
        <Animated.View
          style={[styles.arc, styles.arc1, { opacity: arcOpacity }]}
        />
        <Animated.View
          style={[styles.arc, styles.arc2, { opacity: arcOpacity }]}
        />
        <Animated.View
          style={[
            styles.wifiDot,
            { opacity: dotOpacity, backgroundColor: "#1a1917" },
          ]}
        />
        <Animated.View
          style={[
            styles.slash,
            { opacity: slashOpacity, backgroundColor: "#1a1917" },
          ]}
        />
      </View>
      <View style={styles.offlineBanner}>
        <Text style={styles.bannerTitle}>Offline</Text>
        <Text style={styles.bannerSub}>
          Not from the world —{" "}
          <Text style={styles.bannerSubAccent}>just the server.</Text>
        </Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => network_observer.callServer()}
        >
          <Text style={styles.retryText}>Wake them up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── Location permission missing ───────────────────────────────────────────────
const LocationBanner = () => {
  const pulseOpacity = useRef(new Animated.Value(1)).current;
  const pinScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pinScale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pinScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(800),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.banner}>
      <Animated.View
        style={{ opacity: pulseOpacity, transform: [{ scale: pinScale }] }}
      >
        <LocationOffIcon />
      </Animated.View>
      <View>
        <Text style={styles.bannerTitle}>No location</Text>
        <Text style={styles.bannerSub}>
          Map can't place you{" "}
          <Text style={styles.bannerSubAccent}>without permission.</Text>
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.retryBtn,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.retryText}>Enable in settings</Text>
        </Pressable>
      </View>
    </View>
  );
};

// ── Satellite OFF ─────────────────────────────────────────────────────────────
const SatelliteOffBanner = () => {
  const iconOpacity = useRef(new Animated.Value(1)).current;
  const signalOpacity = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);

  const CONTENT_WIDTH = 190;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconOpacity, {
          toValue: 0.25,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacity, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(signalOpacity, {
          toValue: 0.6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(signalOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1800),
        Animated.timing(signalOpacity, {
          toValue: 0.4,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(signalOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2400),
      ]),
    ).start();
  }, []);

  const toggle = () => {
    const toValue = expanded ? 0 : 1;
    Animated.spring(expandAnim, {
      toValue,
      useNativeDriver: true,
      friction: 7,
      tension: 80,
    }).start();
    setExpanded((p) => !p);
  };

  const scaleX = expandAnim;
  const translateX = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-CONTENT_WIDTH / 2, 0],
  });
  const opacity = expandAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
      <View style={styles.banner}>
        <Animated.View
          style={{
            backgroundColor: "#1a1917",
            borderRadius: 5,
            paddingVertical: 2,
            paddingHorizontal: 3,
            opacity: iconOpacity,
          }}
        >
          <SatelliteOffIcon />
        </Animated.View>
        {/* fixed-width clip wrapper — no layout change */}
        <View
          style={{
            // backgroundColor: "black",
            width: CONTENT_WIDTH,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={{
              opacity,
              backgroundColor: "#1a1917",
              borderRadius: 5,
              paddingVertical: 5,

              transform: [{ scaleX }, { translateX }],
              transformOrigin: "left",
            }}
          >
            <Text style={styles.bannerTitle} numberOfLines={1}>
              Background tracking disabled
            </Text>
            {/* <Text style={styles.bannerSub} numberOfLines={2}>
              Trips won't record{" "}
              <Text style={styles.bannerSubAccent}>while app is closed.</Text>
            </Text>*/}
            {/* <Pressable
              style={({ pressed }) => [
                styles.retryBtn,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => Linking.openSettings()}
            >
              <Text style={styles.retryText}>Enable always-on</Text>
            </Pressable>*/}
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ── Satellite ON ──────────────────────────────────────────────────────────────
const SatelliteOnBanner = () => {
  const pingScale = useRef(new Animated.Value(1)).current;
  const pingOpacity = useRef(new Animated.Value(0.8)).current;
  const iconOpacity = useRef(new Animated.Value(0.6)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);

  const CONTENT_WIDTH = 190;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pingScale, {
            toValue: 1.8,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pingOpacity, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(pingScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(pingOpacity, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacity, {
          toValue: 0.6,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const toggle = () => {
    const toValue = expanded ? 0 : 1;
    Animated.spring(expandAnim, {
      toValue,
      useNativeDriver: true,
      friction: 7,
      tension: 80,
    }).start();
    setExpanded((p) => !p);
  };

  const scaleX = expandAnim;
  const translateX = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-CONTENT_WIDTH / 2, 0],
  });
  const opacity = expandAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
      <View style={styles.banner}>
        <View
          style={{
            width: 20,
            height: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              width: 20,
              height: 20,
              backgroundColor: "#1a1917",
              paddingVertical: 5,

              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#4a9e6b",
              opacity: pingOpacity,
              transform: [{ scale: pingScale }],
            }}
          />
          <Animated.View style={{ opacity: iconOpacity }}>
            <SatelliteOnIcon />
          </Animated.View>
        </View>
        {/* fixed-width clip wrapper — no layout change */}
        <View style={{ width: CONTENT_WIDTH, overflow: "hidden" }}>
          <Animated.View
            style={{
              opacity,
              backgroundColor: "#1a1917",
              borderRadius: 5,
              paddingVertical: 5,

              transform: [{ scaleX }, { translateX }],
              transformOrigin: "left",
            }}
          >
            <Text style={styles.bannerTitle} numberOfLines={1}>
              Tracking active
            </Text>
            <Text style={styles.bannerSub} numberOfLines={2}>
              Recording your trip{" "}
              <Text style={[styles.bannerSubAccent, { color: "#4a9e6b" }]}>
                in the background.
              </Text>
            </Text>
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
// ── Manager ───────────────────────────────────────────────────────────────────
export const BannerManager = () => {
  const [foregroundGranted, setForegroundGranted] = useState(false);
  const [backgroundGranted, setBackgroundGranted] = useState(false);
  const [isOffline, setIsOffline] = useState(network_observer.isReachable);
  const [sync, setSync] = useState(false);

  useEffect(() => {
    const init = async () => {
      const fg = await Location.requestForegroundPermissionsAsync();
      setForegroundGranted(fg.status === "granted");
      await Permission.setForeGroundPer(
        fg.status === "granted" ? "true" : "false",
      );

      const bg = await Location.requestBackgroundPermissionsAsync();
      setBackgroundGranted(bg.status === "granted");
      await Permission.setBackGroundPer(
        bg.status === "granted" ? "true" : "false",
      );
    };
    init();
    _registerNetworkCallback(setIsOffline);
    TripContentsSync.registerSyncingCallback(setSync);
  }, []);

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {!isOffline && <OfflineBanner />}
      {!foregroundGranted && <LocationBanner />}
      {!backgroundGranted && <SatelliteOffBanner />}
      {backgroundGranted && <SatelliteOnBanner />}
      <SyncBanner visible={sync} />
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 12,
    zIndex: 300,
    gap: 6,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#1a1917",
    // borderWidth: 1,
    // borderColor: "#2e2c29",
    // borderRadius: 10,
    paddingVertical: 7,
    // paddingHorizontal: 12,
    gap: 10,
  },
  offlineBanner: {
    // flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1917",
    borderWidth: 1,
    borderColor: "#2e2c29",
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    // gap: ,
  },
  bannerTitle: {
    fontFamily: "DMMono",
    fontSize: 12,
    color: "#f0f0ec",
    fontWeight: "600",
  },
  bannerSub: {
    fontFamily: "DMMono",
    fontSize: 10,
    color: "#6b6860",
    marginTop: 2,
    lineHeight: 14,
  },
  bannerSubAccent: { color: "#a09e99" },
  retryBtn: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#2e2c29",
    alignSelf: "flex-start",
  },
  retryText: {
    fontFamily: "DMMono",
    fontSize: 10,
    color: "#a09e99",
  },
  wifiIcon: {
    width: 16,
    height: 14,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  arc: {
    borderWidth: 1.5,
    borderColor: "#3a3835",
    borderBottomWidth: 0,
    borderRadius: 20,
  },
  arc1: { width: 16, height: 8 },
  arc2: { width: 10, height: 5 },
  wifiDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#f0f0ec",
    opacity: 0.4,
  },
  slash: {
    position: "absolute",
    width: 1.5,
    height: 18,
    backgroundColor: "#6b6860",
    borderRadius: 1,
    transform: [{ rotate: "25deg" }],
    top: -2,
    left: 7,
  },
  text: {
    fontFamily: "DMMono",
    fontSize: 11,
    color: "#f0f0ec",
  },
  button: {
    backgroundColor: "#f0f0ec",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  buttonText: {
    fontFamily: "DMMono",
    color: "#0d0c0a",
    fontWeight: "600",
    fontSize: 11,
  },
});
