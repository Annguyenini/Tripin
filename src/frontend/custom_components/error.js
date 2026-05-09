import { useEffect, useRef, useState } from "react";
import { View, Text, Animated, StyleSheet, Easing } from "react-native";

export function ErrorMessageBox({ title, message, duration = 3000 }) {
  const [visible, setVisible] = useState(true);
  const slideY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const accentOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // slide in + fade
    Animated.parallel([
      Animated.spring(slideY, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // shake after landing
      Animated.sequence([
        Animated.timing(shake, {
          toValue: 6,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: -5,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: 4,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: -3,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: 0,
          duration: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // pulse scale
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.025,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();

      // accent bar flicker
      Animated.loop(
        Animated.sequence([
          Animated.timing(accentOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(accentOpacity, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 4 },
      ).start();
    });

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideY, {
          toValue: -80,
          duration: 280,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false));
    }, duration - 300);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        s.container,
        {
          opacity,
          transform: [
            { translateY: slideY },
            { translateX: shake },
            { scale: pulse },
          ],
        },
      ]}
    >
      <Animated.View style={[s.accent, { opacity: accentOpacity }]} />
      <View style={s.content}>
        <Text style={s.title}>{title}</Text>
        {message ? <Text style={s.message}>{message}</Text> : null}
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "absolute",
    top: 52,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#1a1917",
    borderWidth: 1,
    borderColor: "rgba(200,184,152,0.18)",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 8,
    zIndex: 1000,
  },
  accent: {
    width: 3,
    backgroundColor: "#c8603a",
  },
  content: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontFamily: "mainfont",
    fontSize: 15,
    color: "#f0f0ec",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  message: {
    fontFamily: "mainfont",
    fontSize: 11,
    color: "rgba(240,240,236,0.55)",
    letterSpacing: 0.3,
    lineHeight: 16,
  },
});
