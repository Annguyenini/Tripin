import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const SkeletonCard = () => {
  const shimmer = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return <Animated.View style={[s.card, { opacity: shimmer }]} />;
};

export const TripSkeleton = () => (
  <View style={s.grid}>
    {[...Array(6)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </View>
);

const s = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 2,
    paddingTop: 8,
  },
  card: {
    width: "47%",
    height: 180,
    backgroundColor: "#2a2826",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a3835",
  },
});
