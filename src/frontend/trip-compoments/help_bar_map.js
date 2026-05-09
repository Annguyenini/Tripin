import { View, TouchableOpacity, Text, Image, Animated } from "react-native";
import { useState, useRef } from "react";
import { helpBarMapStyle } from "../../styles/function/help_bar_map";
import LocationDataService from "../../backend/storage/hot_data/current_location_data_service";
import { Ionicons } from "@expo/vector-icons";

const MAP_STYLES = [
  { style: "satellite", color: "#3B6D11" },
  { style: "dark", color: "#2C2C2A" },
  { style: "street", color: "#e8c9a0" },
];

const BTN = 40; // button size
const GAP = 6; // gap between buttons
const STEP = BTN + GAP;

export const HelpBarMap = ({
  isFollowingUser,
  setIsFollowingUser,
  setMapStyle,
}) => {
  const navigation_icon = require("../../../assets/image/navigation_notoutline_icon.png");
  const navigation_outline_icon = require("../../../assets/image/navigation_outline_icon.png");

  const [styleVisible, setStyleVisible] = useState(false);
  const [locationExpanded, setLocationExpanded] = useState(false);
  const [isoCountryCode, setIsoCountryCode] = useState("");
  const [location, setLocation] = useState(null);

  // style options: slide in from right (translateX: 80 → 0, opacity: 0 → 1)
  const styleAnim = useRef(new Animated.Value(0)).current; // 0=hidden 1=visible
  // location pill: width 0 → 140
  const locationAnim = useRef(new Animated.Value(0)).current;

  useState(() => {
    const observer = {
      update(newLocation) {
        setLocation(newLocation);
        setIsoCountryCode(newLocation.isoCountryCode);
      },
    };
    LocationDataService.attach(observer, LocationDataService.location_key);
    return () =>
      LocationDataService.detach(observer, LocationDataService.location_key);
  }, []);

  const _getFlag = (isoCode) => {
    if (!isoCode) return "";
    return isoCode
      .toUpperCase()
      .split("")
      .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
      .join("");
  };

  const toggleStyle = () => {
    const toValue = styleVisible ? 0 : 1;
    Animated.spring(styleAnim, {
      toValue,
      useNativeDriver: true,
      friction: 7,
      tension: 80,
    }).start();
    setStyleVisible((p) => !p);
  };

  const toggleLocation = () => {
    const toValue = locationExpanded ? 0 : 1;
    Animated.spring(locationAnim, {
      toValue,
      useNativeDriver: false,
      friction: 6,
      tension: 80,
    }).start();
    setLocationExpanded((p) => !p);
  };

  const styleTranslateX = styleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 0],
  });
  const styleOpacity = styleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const locationWidth = locationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 130],
  });
  const locationOpacity = locationAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={helpBarMapStyle.container}>
      {/* ── Layer 1: recenter ── */}
      <View style={{ position: "absolute", top: 0, right: 0 }}>
        <TouchableOpacity
          style={helpBarMapStyle.btn}
          onPress={() => setIsFollowingUser(true)}
        >
          <Image
            style={helpBarMapStyle.icon}
            source={isFollowingUser ? navigation_outline_icon : navigation_icon}
          />
        </TouchableOpacity>
      </View>

      {/* ── Layer 2: style toggle ── */}
      <View style={{ position: "absolute", top: STEP, right: 0 }}>
        <TouchableOpacity style={helpBarMapStyle.btn} onPress={toggleStyle}>
          <Ionicons name="reorder-three-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* ── Layer 3: style options (slide left from button) ── */}
      <Animated.View
        pointerEvents={styleVisible ? "auto" : "none"}
        style={{
          position: "absolute",
          top: STEP + 2,
          right: BTN + 8, // sits to the left of the toggle button
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          opacity: styleOpacity,
          transform: [{ translateX: styleTranslateX }],
        }}
      >
        {MAP_STYLES.map(({ style, color }) => (
          <TouchableOpacity
            key={style}
            onPress={() => {
              setMapStyle(style);
              toggleStyle();
            }}
            style={{
              width: BTN,
              height: BTN,
              borderRadius: BTN / 2,
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 3,
            }}
          >
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: color,
              }}
            />
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* ── Layer 4: location toggle button ── */}
      <View style={{ position: "absolute", top: STEP * 2, right: 0 }}>
        <TouchableOpacity style={helpBarMapStyle.btn} onPress={toggleLocation}>
          <Text style={{ fontSize: 16, lineHeight: 20 }}>
            {_getFlag(isoCountryCode) || "🌐"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Layer 5: location pill (slides left from button) ── */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: STEP * 2 + 2,
          right: BTN + 8,
          flexDirection: "row",
          alignItems: "center",
          overflow: "hidden",
          width: locationWidth,
          opacity: locationOpacity,
          height: BTN,
          borderRadius: BTN / 2,
          backgroundColor: "#fff",
          paddingHorizontal: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 3,
        }}
      >
        <Ionicons name="location-outline" size={12} color="#555" />
        <Text
          numberOfLines={3}
          style={{ fontSize: 11, color: "#1a1917", marginLeft: 4 }}
        >
          {`${location?.city} - ${location?.region} Tz: ${location?.timezone}`}
        </Text>
      </Animated.View>
    </View>
  );
};
