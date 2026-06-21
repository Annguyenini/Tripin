import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Video from "react-native-video";
import {
  CARD_W,
  CARD_H,
  SLOT_W,
  STRING_Y,
  HANG_LEN,
  TAPE_COLOR,
  mono,
} from "./constants";

export default function PolaroidCard({ location, index, isSelected, onPress }) {
  const left = index * SLOT_W + 36;
  const top = location.hang ? STRING_Y + HANG_LEN : STRING_Y;
  const rot = location.rot ?? (index % 2 === 0 ? -5 : 5);
  const media = location.medias?.[0];

  return (
    <TouchableOpacity
      style={[styles.slot, { left }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* tape */}
      <View style={styles.tape} />

      {/* polaroid */}
      <View
        style={[
          styles.card,
          { top, transform: [{ rotate: `${rot}deg` }] },
          isSelected && styles.cardSelected,
        ]}
      >
        {media?.media_type === "video" ? (
          <Video
            source={{ uri: media.media_path }}
            style={styles.media}
            muted
          />
        ) : media ? (
          <Image
            source={{ uri: media.media_path }}
            style={styles.media}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.media, { backgroundColor: "#ccc" }]} />
        )}

        <View style={styles.bottom}>
          <Text style={styles.city}>{location.city?.toLowerCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  slot: {
    position: "absolute",
    width: CARD_W * 2,
  },
  tape: {
    position: "absolute",
    top: STRING_Y - 8,
    left: CARD_W / 2 - 13,
    width: 26,
    height: 13,
    backgroundColor: TAPE_COLOR,
    opacity: 0.85,
    zIndex: 10,
  },
  card: {
    position: "absolute",
    width: CARD_W,
    height: CARD_H,
    backgroundColor: "#f2ece0",
    padding: 7,
    paddingBottom: 0,
    borderRadius: 3,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  cardSelected: {
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 2,
    borderColor: "#1a1a1a",
  },
  media: {
    flex: 1,
    borderRadius: 2,
  },
  bottom: {
    paddingTop: 4,
    paddingBottom: 5,
    alignItems: "center",
  },
  city: {
    fontFamily: mono,
    fontSize: 9,
    fontWeight: "700",
    color: "#2a201a",
  },
});
