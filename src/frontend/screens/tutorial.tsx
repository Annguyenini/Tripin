import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ViewToken,
} from "react-native";
import UserSettingsLoader from "../../app-core/flow/user_settings/user_setting";

const { width, height } = Dimensions.get("window");

// ─── Types ───────────────────────────────────────────────────────────────────

type Slide = {
  id: string;
  image: any; // replace with ImageSourcePropType
  title: string;
  description: string;
};

// ─── Slide Data ──────────────────────────────────────────────────────────────

const SLIDES: Slide[] = [
  {
    id: "1",
    image: require("../../../assets/tutorial/1_mainscreen.png"),
    title: "Welcome to Tripping ✈️",
    description:
      "Your travel diary lives on the map. See your GPS status, switch map styles, and jump to any feature from the bottom bar.",
  },
  {
    id: "2",
    image: require("../../../assets/tutorial/2_background_tracking_on.png"),
    title: "Background Tracking: On",
    description:
      "When the GPS icon is active, Tripping records your journey in the background — even when the app is closed.",
  },
  {
    id: "3",
    image: require("../../../assets/tutorial/3_background_tracking_off.png"),
    title: "Background Tracking: Off",
    description:
      "To Disable Background Tracking On, You can do it in the setting. Great for saving battery when you're done exploring for the day.",
  },
  {
    id: "4",
    image: require("../../../assets/tutorial/4_create_new_trip.png"),
    title: "Start a New Trip",
    description:
      "Tap the + button to create a new trip. Give it a name, pick a cover photo, and choose your tracking mode.",
  },
  {
    id: "5",
    image: require("../../../assets/tutorial/5_create_new_trip_unfill.png"),
    title: "Fill in Your Trip Details",
    description:
      "Upload a cover image, enter your trip name, and select a tracking mode. You can change these later anytime.",
  },
  {
    id: "6",
    image: require("../../../assets/tutorial/6_create_new_trip_fill.png"),
    title: "Ready to Go",
    description:
      "Once everything looks good, hit Submit. Your trip is created and tracking begins automatically.",
  },
  {
    id: "7",
    image: require("../../../assets/tutorial/7_after_create_trip.png"),
    title: "Trip Panel",
    description:
      "After creating a trip, a panel slides up showing your trip name, start time, and live stats. Tap End Trip when you're done.",
  },
  {
    id: "8",
    image: require("../../../assets/tutorial/8_camera.png"),
    title: "Snap & Record",
    description:
      "Tap the shutter to snap a photo. Hold it down to record a video. Every shot is tagged with your current location.",
  },
  {
    id: "9",
    image: require("../../../assets/tutorial/9_display_on_map.png"),
    title: "See It on the Map",
    description:
      "Photos and videos appear as pins on the globe right where you captured them. Tap a cluster to explore.",
  },
  {
    id: "10",
    image: require("../../../assets/tutorial/10_slideshow.png"),
    title: "Slideshow Mode",
    description:
      "Tap any photo to enter fullscreen slideshow. Swipe through your memories one by one.",
  },
  {
    id: "11",
    image: require("../../../assets/tutorial/11_timeline.png"),
    title: "Timeline View",
    description:
      "Switch to Timeline to see your shots grouped by city and day. Tap any card to jump to it on the map.",
  },
  {
    id: "12",
    image: require("../../../assets/tutorial/12_statistic.png"),
    title: "Trip Statistics",
    description:
      "The Statistic tab shows your trip duration, shots taken, distance covered, and a polaroid gallery of every city you visited.",
  },
  {
    id: "13",
    image: require("../../../assets/tutorial/13_statistic_2.png"),
    title: "Memories by City",
    description:
      "Scroll down in Statistics to browse all your shots grouped by city and date. Your whole journey, beautifully organized.",
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  onDone: () => void; // call your markOnboardingSeen() here
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function TutorialScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const onDone = () => {
    UserSettingsLoader._onFinishBoarding();
    return;
  };
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      onDone();
    }
  };

  const isLast = activeIndex === SLIDES.length - 1;

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={() => onDone()}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Bottom: dots + button */}
      <View style={styles.footer}>
        {/* Dot indicators */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Next / Get Started button */}
        <TouchableOpacity
          style={[styles.button, isLast && styles.buttonLast]}
          onPress={goNext}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            {isLast ? "Get Started 🎒" : "Next"}
          </Text>
        </TouchableOpacity>

        {/* Slide counter */}
        <Text style={styles.counter}>
          {activeIndex + 1} / {SLIDES.length}
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const PEACH = "#E8956D";
const BG = "#fdf6ee";
const TEXT_DARK = "#fdf6ee";
const TEXT_MUTED = "#7A6355";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0c0a",
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 28,
  },
  skipButton: {
    position: "absolute",
    top: 56,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  skipText: {
    fontFamily: "DMMono-Regular", // swap to your font
    fontSize: 13,
    color: TEXT_MUTED,
  },
  slide: {
    width,
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  image: {
    width: width * 0.72,
    height: height * 0.52,
    borderRadius: 20,
    // subtle polaroid shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  textContainer: {
    marginTop: 28,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  title: {
    fontFamily: "PermanentMarker-Regular", // swap to your font
    fontSize: 22,
    color: TEXT_DARK,
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontFamily: "DMMono-Regular", // swap to your font
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 12,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 22,
    backgroundColor: PEACH,
  },
  dotInactive: {
    width: 6,
    backgroundColor: "#D9C4B5",
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: PEACH,
    alignItems: "center",
  },
  buttonLast: {
    backgroundColor: "#C0674A", // slightly deeper for the final CTA
  },
  buttonText: {
    fontFamily: "DMMono-Medium", // swap to your font
    fontSize: 16,
    color: "#fff",
    letterSpacing: 0.4,
  },
  counter: {
    fontFamily: "DMMono-Regular",
    fontSize: 12,
    color: TEXT_MUTED,
  },
});
