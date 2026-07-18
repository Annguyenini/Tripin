import { View, TouchableOpacity, Text, Image, Animated } from "react-native";
import { useState, useRef, useEffect } from "react";
import { helpBarMapStyle } from "../../styles/function/help_bar_map";
import LocationDataService from "../../backend/storage/hot_data/current_location_data_service";
import { Ionicons } from "@expo/vector-icons";
import MapSharedConfig from "./main_map/map_shared_config";
import MapTransform from "./main_map/map_transform";
import LoadingTracker from "./observers/loading_tracker";

const MAP_STYLES = [
  { style: "satellite", color: "#3B6D11" },
  // { style: "dark", color: "#2C2C2A" },
  { style: "street", color: "#e8c9a0" },
];

const BTN = 42; // button size, matches helpBarMapStyle.btn
const GAP = 8; // gap between buttons
const STEP = BTN + GAP;

export const HelpBarMap = ({ setStyles }) => {
  const navigation_icon = require("../../../assets/image/navigation_notoutline_icon.png");
  const navigation_outline_icon = require("../../../assets/image/navigation_outline_icon.png");

  const [styleVisible, setStyleVisible] = useState(false);
  const [locationExpanded, setLocationExpanded] = useState(false);
  const [isoCountryCode, setIsoCountryCode] = useState("");
  const [location, setLocation] = useState(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const styleAnim = useRef(new Animated.Value(0)).current; // 0=hidden 1=visible
  const locationAnim = useRef(new Animated.Value(0)).current;

  const followingUser = async () => {
    await MapTransform.followingUser();
  };
  const setMapStyle = (style) => {
    setStyles(style);
  };

  useEffect(() => {
    const initialFollowing = () => {
      const initial = MapSharedConfig.getIsFollowingUser();
      if (isFollowingUser !== initial) {
        setIsFollowingUser(initial);
      }
    };
    initialFollowing();
    const updateIsFollowing = {
      update(value) {
        if (isFollowingUser !== value) {
          setIsFollowingUser(value);
        }
      },
    };
    MapSharedConfig.attach(updateIsFollowing, "isFollowingUser");
    return () => MapSharedConfig.detach(updateIsFollowing, "isFollowingUser");
  }, []);

  useEffect(() => {
    const observer = {
      update(newLocation) {
        setLocation(newLocation);
        setIsoCountryCode(newLocation.isoCountryCode);
      },
    };
    LocationDataService.attach(observer, LocationDataService.location_key);
    return () => {
      LocationDataService.detach(observer, LocationDataService.location_key);
    };
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
    outputRange: [0, 148],
  });
  const locationOpacity = locationAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  LoadingTracker.notifyReady("help bar map");

  const colors = helpBarMapStyle.colors;

  return (
    <View style={helpBarMapStyle.container}>
      {/* Layer 1: recenter — filled with primary when actively following the user */}
      <View style={{ position: "absolute", top: 0, right: 0 }}>
        <TouchableOpacity
          style={[helpBarMapStyle.btn, isFollowingUser && helpBarMapStyle.btnActive]}
          onPress={() => followingUser()}
        >
          <Image
            style={[
              helpBarMapStyle.icon,
              isFollowingUser && helpBarMapStyle.iconActive,
            ]}
            source={isFollowingUser ? navigation_outline_icon : navigation_icon}
          />
        </TouchableOpacity>
      </View>

      {/* Layer 2: style toggle */}
      <View style={{ position: "absolute", top: STEP, right: 0 }}>
        <TouchableOpacity
          style={[helpBarMapStyle.btn, styleVisible && helpBarMapStyle.btnActive]}
          onPress={toggleStyle}
        >
          <Ionicons
            name="reorder-three-outline"
            size={20}
            color={styleVisible ? "#FFFDF8" : colors.ink}
          />
        </TouchableOpacity>
      </View>

      {/* Layer 3: style options (slide left from toggle) */}
      <Animated.View
        pointerEvents={styleVisible ? "auto" : "none"}
        style={{
          position: "absolute",
          top: STEP + 1,
          right: BTN + 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
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
            style={helpBarMapStyle.styleOption}
          >
            <View
              style={[
                helpBarMapStyle.styleOptionSwatch,
                { backgroundColor: color },
              ]}
            />
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Layer 4: location toggle */}
      <View style={{ position: "absolute", top: STEP * 2, right: 0 }}>
        <TouchableOpacity
          style={[
            helpBarMapStyle.btn,
            locationExpanded && helpBarMapStyle.btnActive,
          ]}
          onPress={toggleLocation}
        >
          <Text style={{ fontSize: 16, lineHeight: 20 }}>
            {_getFlag(isoCountryCode) || "🌐"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Layer 5: location pill — secondary tint, since secondary is reserved for place/location UI */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: STEP * 2 + 1,
            right: BTN + 8,
            width: locationWidth,
            opacity: locationOpacity,
          },
          helpBarMapStyle.locationPill,
        ]}
      >
        <Ionicons name="location-outline" size={13} color={colors.secondaryDark} />
        <Text numberOfLines={2} style={helpBarMapStyle.locationPillText}>
          {location?.city && location?.region
            ? `${location.city}, ${location.region}`
            : "Locating…"}
        </Text>
      </Animated.View>
    </View>
  );
};
