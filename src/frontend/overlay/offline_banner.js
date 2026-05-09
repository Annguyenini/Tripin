import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import network_observer from "../../app-core/flow/sync/network_observer";

export const OfflineBanner = () => {
  const dotOpacity = useRef(new Animated.Value(0.4)).current;
  const slashOpacity = useRef(new Animated.Value(1)).current;
  const arcOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // dot flicker — irregular feel
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

    // arcs slow fade in/out — dying signal
    Animated.loop(
      Animated.sequence([
        Animated.timing(arcOpacity, {
          toValue: 0.2,
          duration: 1200,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
        Animated.timing(arcOpacity, {
          toValue: 0.8,
          duration: 1200,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // slash pulse — draws attention
    Animated.loop(
      Animated.sequence([
        Animated.timing(slashOpacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
        Animated.timing(slashOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sine),
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
        <Animated.View style={[styles.wifiDot, { opacity: dotOpacity }]} />
        <Animated.View style={[styles.slash, { opacity: slashOpacity }]} />
      </View>
      <View>
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
