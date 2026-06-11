import { mediaCardStyle } from "../../styles/function/media_card";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import Video from "react-native-video";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useEffect, useState, useRef } from "react";
import { scheduleOnRN } from "react-native-worklets";
import { MaterialIcons } from "@expo/vector-icons";
import TripContentHandler from "../../app-core/flow/handlers/trip_contents/trip_contents_handler";
import { OverlayCard } from "../overlay/overlay_card";
import safeRun from "../../app-core/helpers/safe_run";

const { width, height } = Dimensions.get("window");

// ── Inline Detail Panel ──────────────────────────────────────────────────────
function DetailPanel({ asset, onClose, onDelete }) {
  // Fake sync status for now
  const syncStatus = "synced"; // "synced" | "pending" | "error"
  const syncLabel = {
    synced: "Synced",
    pending: "Pending",
    error: "Sync Error",
  };
  const syncColor = { synced: "#7cad4a", pending: "#e8b84b", error: "#c97a6a" };

  const formatted = asset.time_stamp
    ? new Date(Math.floor(asset.time_stamp)).toLocaleString()
    : asset.creationTime
      ? new Date(Math.floor(asset.creationTime)).toLocaleString()
      : "—";

  return (
    <Animated.View style={detailStyle.panel}>
      {/* Header */}
      <View style={detailStyle.header}>
        <Text style={detailStyle.panelTitle}>Media Info</Text>
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="close" size={18} color="#c8b89a" />
        </TouchableOpacity>
      </View>

      {/* Trip Name */}
      <View style={detailStyle.section}>
        <Text style={detailStyle.sectionLabel}>TRIP</Text>
        <Text style={detailStyle.sectionValue} numberOfLines={1}>
          {asset.trip_name ?? "Unnamed Trip"}
        </Text>
      </View>

      <View style={detailStyle.divider} />

      {/* Image Data */}
      <View style={detailStyle.section}>
        <Text style={detailStyle.sectionLabel}>IMAGE DATA</Text>
        <View style={detailStyle.dataRow}>
          <Text style={detailStyle.dataKey}>City</Text>
          <Text style={detailStyle.dataValue}>
            {asset.city != null ? asset.city : "Earth"}
          </Text>
        </View>
        <View style={detailStyle.dataRow}>
          <Text style={detailStyle.dataKey}>Country</Text>
          <Text style={detailStyle.dataValue}>
            {asset.country != null ? asset.country : "Earth"}
          </Text>
        </View>
        <View style={detailStyle.dataRow}>
          <Text style={detailStyle.dataKey}>Taken</Text>
          <Text style={detailStyle.dataValue}>{formatted}</Text>
        </View>
        <View style={detailStyle.dataRow}>
          <Text style={detailStyle.dataKey}>Type</Text>
          <Text style={detailStyle.dataValue}>
            {asset.media_type === "video" ? "Video" : "Photo"}
          </Text>
        </View>
      </View>

      {/* <View style={detailStyle.divider} />*/}

      {/* Sync Status */}
      {/* <View style={detailStyle.syncRow}>
        <View
          style={[
            detailStyle.syncDot,
            { backgroundColor: syncColor[syncStatus] },
          ]}
        />
        <Text style={[detailStyle.syncText, { color: syncColor[syncStatus] }]}>
          {syncLabel[syncStatus]}
        </Text>
        <Text style={detailStyle.syncSub}>· Server</Text>
      </View>*/}
      {/* Delete */}
      <View style={detailStyle.divider} />
      <TouchableOpacity
        style={detailStyle.deleteBtn}
        onPress={() => onDelete(asset)}
      >
        <MaterialIcons name="delete-outline" size={15} color="#c97a6a" />
        <Text style={detailStyle.deleteText}>Delete Media</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function MediaViewCard({
  uri,
  visible,
  onClose,
  AssetArray,
  isBottomList,
  propButton,
}) {
  if (!AssetArray || AssetArray.length <= 0) return null;

  const currentAssetsArray = AssetArray;
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(
      currentAssetsArray.findIndex((a) => a.media_path === uri),
      0,
    ),
  );
  const [detailVisible, setDetailVisible] = useState(false);
  const [isFullScreen, setFullScreen] = useState(false);

  // ── Slide animation ──
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const prevIndex = useRef(currentIndex);

  useEffect(() => {
    if (prevIndex.current === currentIndex) return;
    const dir = currentIndex > prevIndex.current ? 1 : -1;
    prevIndex.current = currentIndex;
    slideAnim.setValue(dir * 60);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const changeMedia = Gesture.Pan().onEnd((e) => {
    if (e.velocityX >= 250) {
      scheduleOnRN(
        setCurrentIndex,
        Math.min(currentIndex + 1, currentAssetsArray.length - 1),
      );
    } else if (e.velocityX <= -250) {
      scheduleOnRN(setCurrentIndex, Math.max(currentIndex - 1, 0));
    }
  });

  const deleteImageHandler = async (asset) => {
    try {
      let temp_asset = { ...asset, event: "remove", modified_time: Date.now() };
      await TripContentHandler.tripContentHandler(
        temp_asset,
        temp_asset?.trip_id,
      );
    } catch (err) {
      console.error(err);
    } finally {
      onClose();
    }
    // await TripContentHandler.deleteMediaHandler(
    //   current_media.trip_id,
    //   current_media.media_id,
    //   current_media.media_path,
    // );
    // if (current_media.coordinate_id) {
    //   await safeRun(() =>
    //     TripContentHandler.deleteCoordinateHandler(
    //       current_media.trip_id,
    //       current_media.coordinate_id,
    //     ),
    //   );
    // }
  };

  const currentAsset = currentAssetsArray[currentIndex];

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <GestureDetector gesture={changeMedia}>
        <View style={mediaCardStyle.overlayContainer}>
          <View
            style={isFullScreen ? mediaCardStyle.fullCard : mediaCardStyle.card}
          >
            {propButton}

            {/* ── 3-Button Toolbar ── */}
            <View style={toolbarStyle.bar}>
              {/* Fullscreen */}
              <TouchableOpacity
                style={toolbarStyle.btn}
                onPress={() => setFullScreen((p) => !p)}
              >
                <MaterialIcons
                  name={isFullScreen ? "fullscreen-exit" : "fullscreen"}
                  size={20}
                  color="#f5f0e8"
                />
              </TouchableOpacity>

              {/* Detail */}
              <TouchableOpacity
                style={[
                  toolbarStyle.btn,
                  detailVisible && toolbarStyle.btnActive,
                ]}
                onPress={() => setDetailVisible((p) => !p)}
              >
                <MaterialIcons name="info-outline" size={20} color="#f5f0e8" />
              </TouchableOpacity>

              {/* Close */}
              <TouchableOpacity style={toolbarStyle.btn} onPress={onClose}>
                <MaterialIcons name="close" size={20} color="#f5f0e8" />
              </TouchableOpacity>
            </View>

            {/* ── Media ── */}
            <Animated.View
              style={{
                flex: 1,
                transform: [{ translateX: slideAnim }],
                opacity: fadeAnim,
              }}
            >
              {currentAsset.media_type === "video" ? (
                <Video
                  style={
                    isFullScreen
                      ? mediaCardStyle.fullVideo
                      : mediaCardStyle.video
                  }
                  source={{ uri: currentAsset.media_path }}
                  controls
                  resizeMode="cover"
                  paused={false}
                />
              ) : (
                <Image
                  style={
                    isFullScreen
                      ? mediaCardStyle.fullImage
                      : mediaCardStyle.image
                  }
                  source={{ uri: currentAsset.media_path }}
                />
              )}
            </Animated.View>

            {/* ── Detail Panel (inline, over the card) ── */}
            {detailVisible && (
              <DetailPanel
                asset={currentAsset}
                onClose={() => setDetailVisible(false)}
                onDelete={deleteImageHandler}
              />
            )}
          </View>

          {/* ── Bottom List ── */}
          {isBottomList && !isFullScreen && (
            <View style={mediaCardStyle.bottomListContainer}>
              <FlatList
                data={AssetArray}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.media_id.toString()}
                contentContainerStyle={{ paddingHorizontal: 12 }}
                renderItem={({ item, index }) => (
                  <View style={mediaCardStyle.clusterCard}>
                    <TouchableOpacity onPress={() => setCurrentIndex(index)}>
                      <Image
                        source={{
                          uri:
                            item.media_type === "video"
                              ? item.thumb_nail
                              : item.media_path,
                        }}
                        style={[
                          mediaCardStyle.imageList,
                          index === currentIndex && listStyle.selected,
                        ]}
                      />
                      {item.media_type === "video" && (
                        <View style={mediaCardStyle.ImageListOverlay}>
                          <Text style={mediaCardStyle.playButton}>▶</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </GestureDetector>
    </Modal>
  );
}

// ── Toolbar styles ───────────────────────────────────────────────────────────
const toolbarStyle = StyleSheet.create({
  bar: {
    position: "absolute",
    top: 40,
    right: 10,
    flexDirection: "column",
    gap: 8,
    zIndex: 20,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#1a1917",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 4,
  },
  btnActive: {
    backgroundColor: "#3B6D11",
    borderColor: "rgba(124,173,74,0.3)",
  },
});

// ── Detail panel styles ──────────────────────────────────────────────────────
const detailStyle = StyleSheet.create({
  panel: {
    position: "absolute",
    opacity: 0.7,
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: "#141310",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderColor: "rgba(200,184,154,0.15)",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    zIndex: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  panelTitle: {
    fontFamily: "DMMono",
    fontSize: 11,
    letterSpacing: 1.5,
    color: "#888780",
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontFamily: "DMMono",
    fontSize: 10,
    letterSpacing: 1.2,
    color: "#888780",
    marginBottom: 6,
  },
  sectionValue: {
    fontFamily: "PermanentMarker",
    fontSize: 18,
    color: "#e8c9a0",
    letterSpacing: 0.3,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  dataKey: {
    fontFamily: "DMMono",
    fontSize: 12,
    color: "#888780",
    width: 50,
  },
  dataValue: {
    fontFamily: "DMMono",
    fontSize: 12,
    color: "#c8b89a",
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(200,184,154,0.1)",
    marginVertical: 12,
  },
  syncRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  syncDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  syncText: {
    fontFamily: "DMMono",
    fontSize: 12,
    fontWeight: "500",
  },
  syncSub: {
    fontFamily: "DMMono",
    fontSize: 12,
    color: "#888780",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
  },
  deleteText: {
    fontFamily: "DMMono",
    fontSize: 12,
    color: "#c97a6a",
  },
});

// ── Bottom list selected highlight ──────────────────────────────────────────
const listStyle = StyleSheet.create({
  selected: {
    borderWidth: 2,
    borderColor: "#7cad4a",
    borderRadius: 8,
  },
});
