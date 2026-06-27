// loading_overlay.jsx
import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import LoadingTracker from "./loading_tracker";

export const LoadingOverlay = ({ threshold = 3 }) => {
  const [count, setCount] = useState(0);
  const [stages, setStages] = useState([]);
  const [visible, setVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const updateStep = {
      update(steps: string[]) {
        const newCount = steps.length;
        setCount(newCount);
        setStages(steps);
        if (newCount >= threshold) {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start(() => setVisible(false));
        }
      },
    };

    LoadingTracker.attach(updateStep);
    return () => LoadingTracker.detach(updateStep);
  }, []);

  if (!visible) return null;

  return (
    <Animated.View style={[{ opacity: fadeAnim }]}>
      <Text style={styles.text}>
        Map Loading {count}/{threshold}
        {stages.length > 0 ? `: ${stages[stages.length - 1]}` : ""}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 75,
    right: 5,
    zIndex: 300,
    backgroundColor: "#1a1917",
    borderWidth: 1,
    borderColor: "#2e2c29",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  text: {
    fontFamily: "DMMono",
    fontSize: 10,
    color: "#a09e99",
  },
});
