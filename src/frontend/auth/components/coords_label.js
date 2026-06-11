import React, { useState, useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import { fr } from "../../../styles/auth_style.js";

const randCoord = () => {
  const lat = (Math.random() * 180 - 90).toFixed(4);
  const lng = (Math.random() * 360 - 180).toFixed(4);
  return `${lat > 0 ? "+" : ""}${lat}° / ${lng > 0 ? "+" : ""}${lng}°`;
};

export function CoordsLabel() {
  const [coords, setCoords] = useState(randCoord());
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const cycle = () => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCoords(randCoord());
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    };
    const t = setInterval(cycle, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <Animated.View style={[fr.coordsWrap, { opacity }]} pointerEvents="none">
      <Text style={fr.coordsLabel}>· coordinates ·</Text>
      <Text style={fr.coordsText}>{coords}</Text>
    </Animated.View>
  );
}
