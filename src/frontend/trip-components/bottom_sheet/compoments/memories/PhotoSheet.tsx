import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import Video from "react-native-video";
import { FRAME_W, TEXT_MUTED, TEXT_PRIMARY, mono, BG } from "./constants";
import { flyToMarker } from "../../../../utils/map_ref";

const { width } = Dimensions.get("window");

/* ---------------- FRAME ---------------- */
function Frame({ media, index, isSelected, onPress, onLeft, onRight }) {
  const scale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: isSelected ? 1.2 : 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [isSelected]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View style={[styles.heroFrame, { transform: [{ scale }] }]}>
        {media.media_type === "video" ? (
          <Video
            source={{ uri: media.media_path }}
            style={styles.media}
            resizeMode="cover"
            muted
            repeat
          />
        ) : (
          <Image source={{ uri: media.media_path }} style={styles.media} />
        )}

        <Text style={styles.index}>{String(index + 1).padStart(2, "0")}</Text>

        {isSelected && (
          <View style={styles.overlayActions}>
            <TouchableOpacity style={styles.btn} onPress={() => onLeft(media)}>
              <Text style={styles.btnText}>←</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnAdd}
              onPress={() => onRight(media)}
            >
              <Text style={styles.btnText}>＋</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => onRight(media)}>
              <Text style={styles.btnText}>→</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

/* ---------------- SHEET ---------------- */
export default function PhotoSheet({
  location,
  onClose,
  onLeftPress,
  onRightPress,
}) {
  const [index, setIndex] = useState(0);
  const [focus, setFocus] = useState(null);

  const activeIndex = focus ?? index;
  const media = location.medias[activeIndex];

  const ts = media?.time_stamp
    ? new Date(media.time_stamp).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <View style={styles.overlay}>
      {/* BACKDROP */}
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />

      <View style={styles.sheet}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.city}>
            {location.city} {_flag(location.iso_country_code)}
          </Text>
          <Text style={styles.sub}>
            {location.region} • {location.country}
          </Text>
        </View>

        {/* BODY */}
        <View style={styles.body}>
          {/* LEFT PANEL */}
          <View style={styles.left}>
            <Text style={styles.label}>MEMORY</Text>
            <Text style={styles.value}>{ts ?? "—"}</Text>

            <Text style={styles.label}>MEDIA</Text>
            <Text style={styles.value}>
              {activeIndex + 1} / {location.medias.length}
            </Text>

            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() =>
                flyToMarker([media?.longitude, media?.latitude], 20)
              }
            >
              <Text style={styles.mapTxt}>View Map</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* RIGHT PANEL */}
          <View style={styles.right}>
            <FlatList
              data={location.medias}
              keyExtractor={(item, i) => i.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              bounces={false}
              decelerationRate="fast"
              getItemLayout={(_, i) => ({
                length: width,
                offset: width * i,
                index: i,
              })}
              onMomentumScrollEnd={(e) => {
                const i = Math.round(e.nativeEvent.contentOffset.x / width);
                setIndex(i);
                setFocus(null);
              }}
              renderItem={({ item, index }) => (
                <View style={[styles.page, { width }]}>
                  <Frame
                    media={item}
                    index={index}
                    isSelected={index === activeIndex}
                    onPress={() => setFocus(focus === index ? null : index)}
                    onLeft={onLeftPress}
                    onRight={onRightPress}
                  />
                </View>
              )}
            />

            {/* DOTS */}
            <View style={styles.dots}>
              {location.medias.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === index && styles.dotActive]}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

/* ---------------- HELPERS ---------------- */
const _flag = (code) =>
  !code
    ? ""
    : code
        .toUpperCase()
        .split("")
        .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
        .join("");

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: BG,
    height: "100%",
    padding: 16,
  },

  header: {
    marginBottom: 10,
  },

  city: {
    fontSize: 24,
    fontFamily: mono,
    color: TEXT_PRIMARY,
  },

  sub: {
    fontSize: 12,
    color: TEXT_MUTED,
  },

  body: {
    flexDirection: "row",
    flex: 1,
    alignItems: "stretch",
  },

  /* LEFT PANEL (FIXED SEPARATION) */
  left: {
    width: 110,
    paddingRight: 10,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "rgba(0,0,0,0.1)",
  },

  label: {
    fontSize: 10,
    color: "#999",
    marginTop: 12,
    fontFamily: mono,
  },

  value: {
    fontSize: 12,
    color: TEXT_PRIMARY,
    fontFamily: mono,
  },

  mapBtn: {
    marginTop: 20,
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 6,
  },

  mapTxt: {
    color: "#fff",
    fontSize: 11,
    textAlign: "center",
  },

  close: {
    marginTop: 12,
    color: TEXT_MUTED,
  },

  /* RIGHT PANEL */
  right: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 8,
  },

  page: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  heroFrame: {
    width: FRAME_W,
    height: 260,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#111",
  },

  media: {
    width: "100%",
    height: "100%",
  },

  index: {
    position: "absolute",
    bottom: 6,
    right: 6,
    color: "#fff",
    fontSize: 10,
  },

  overlayActions: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },

  btn: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
    borderRadius: 6,
  },

  btnAdd: {
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 8,
  },

  btnText: {
    color: "#fff",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#bbb",
    marginHorizontal: 3,
  },

  dotActive: {
    backgroundColor: "#000",
    width: 7,
    height: 7,
  },
});
