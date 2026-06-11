import React, { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import { fr } from "../../../styles/auth_style.js";

export function SnapLabel() {
  const opacity = useRef(new Animated.Value(0)).current;
  const slideX = useRef(new Animated.Value(-16)).current;

  useEffect(() => {
    const loop = () => {
      opacity.setValue(0);
      slideX.setValue(-16);
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(slideX, {
            toValue: 0,
            tension: 80,
            friction: 11,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(2600),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(500),
      ]).start(({ finished }) => {
        if (finished) loop();
      });
    };
    loop();
  }, []);

  return (
    <Animated.View
      style={[fr.snapWrap, { opacity, transform: [{ translateX: slideX }] }]}
      pointerEvents="none"
    >
      <Text style={fr.snapText}>Snap your trip.</Text>
    </Animated.View>
  );
}
