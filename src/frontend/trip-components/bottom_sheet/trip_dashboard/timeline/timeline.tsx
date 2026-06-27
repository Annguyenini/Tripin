import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { flyToMarker, flyToOnTopMarker } from "../../../../utils/map_ref";
import { ContentCard } from "../../../../../types/content_card.types";
import Video from "react-native-video";
import MediaViewCard from "../../../../albums/viewer_card";
import MapTransform from "../../../main_map/map_transform";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TripTimelineProps {
  cards: ContentCard[];
  /** Called when user taps the + button. Receives the index to insert after (-1 = before first card) */
  onAddPress?: (afterIndex: number) => void;
  /** Called when the focused card changes */
  onCardFocus?: (card: ContentCard, index: number) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CARD_W = 170;
const CARD_H = 270;
const CAP_W = 100;
const SEP_W = 50;
const CONN_W = 7;
const ARROW_W = 20;
// One "gap unit" between items: line + arrow + line
const GAP_UNIT = CONN_W + ARROW_W + CONN_W;
const MONO = Platform.OS === "ios" ? "Courier New" : "monospace";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getFlag = (iso?: string) => {
  if (!iso) return "";
  return iso
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
};

const formatTime = (ts?: number) => {
  if (!ts) return "";
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatTimeShort = (ts?: number) => {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PulseDot() {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  return <Animated.View style={[s.liveDot, { opacity: anim }]} />;
}

function MemCard({
  card,
  isMain,
  onPress,
  onPressFullScreen,
}: {
  card: ContentCard;
  isMain: boolean;
  onPress: () => void;
  onPressFullScreen: () => void;
}) {
  const scale = useRef(new Animated.Value(isMain ? 1 : 0.95)).current;
  const opacity = useRef(new Animated.Value(isMain ? 1 : 0.42)).current;
  const footerY = useRef(new Animated.Value(isMain ? 0 : 20)).current;
  const footerOpacity = useRef(new Animated.Value(isMain ? 1 : 0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: isMain ? 1 : 0.8,
        useNativeDriver: true,
        friction: 8,
        tension: 100,
      }),
      Animated.timing(opacity, {
        toValue: isMain ? 1 : 0.7,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(footerOpacity, {
        toValue: isMain ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(footerY, {
        toValue: isMain ? 0 : 20,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isMain]);
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Animated.View
        style={[
          s.memCard,
          isMain && s.memCardMain,
          { transform: [{ scale }], opacity },
        ]}
      >
        {card.media_path ? (
          card.media_type === "video" ? (
            <Video
              source={{ uri: card.media_path }}
              style={StyleSheet.absoluteFill}
              repeat
              muted
              resizeMode="contain"
            ></Video>
          ) : (
            <Image
              cachePolicy="memory-disk"
              source={{ uri: card.media_path }}
              style={StyleSheet.absoluteFill}
              contentFit="contain"
            />
          )
        ) : (
          <View style={[StyleSheet.absoluteFill, s.memPlaceholder]} />
        )}
        <View style={s.memShade} />
        {card.time_stamp && (
          <Text style={s.memStamp}>{formatTimeShort(card.time_stamp)}</Text>
        )}
        <Text style={s.memTypeIcon}>
          {card.media_type === "video" ? "▶" : "◎"}
        </Text>
        <View style={s.overlay}>
          {isMain && (
            <Animated.View
              style={[
                s.overlayFooter,
                {
                  opacity: footerOpacity,
                  transform: [{ translateY: footerY }],
                },
              ]}
            >
              <TouchableOpacity onPress={onPressFullScreen}>
                <Text style={s.fullscreenBtn}>⛶ Fullscreen</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

function PlusButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={s.plusBtn} onPress={onPress} activeOpacity={0.7}>
      <Text style={s.plusIcon}>+</Text>
    </TouchableOpacity>
  );
}

function ArrowConnector() {
  return (
    <View style={s.arrowWrap}>
      <View style={s.connLine} />
      <Text style={s.arrowIcon}>→</Text>
      <View style={s.connLine} />
    </View>
  );
}

function Connector() {
  return <View style={s.connLine} />;
}

function CityDivider({ cityName }: { cityName: string }) {
  return (
    <View style={s.sepWrap}>
      <View style={s.sepLine} />
      <View style={s.sepPill}>
        <Text style={s.sepPillTxt} numberOfLines={1}>
          {cityName}
        </Text>
      </View>
    </View>
  );
}

function StartCap() {
  return (
    <View style={s.cap}>
      <Text style={s.capIcon}>⊙</Text>
      <Text style={s.capLabel}>{"trip\nstart"}</Text>
    </View>
  );
}

function EndCap() {
  return (
    <View style={[s.cap, s.endCap]}>
      <Text style={[s.capIcon, s.endCapIcon]}>⚑</Text>
      <Text style={[s.capLabel, s.endCapLabel]}>{"trip\nend"}</Text>
    </View>
  );
}

function DotTrack({ count, mainIndex }: { count: number; mainIndex: number }) {
  return (
    <View style={s.dotRow}>
      <View style={s.dotLine} />
      <View style={s.dotGroup}>
        {Array.from({ length: count }).map((_, i) => (
          <View key={i} style={[s.dot, i === mainIndex && s.dotOn]} />
        ))}
      </View>
      <View style={s.dotLine} />
    </View>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function TimeProgressBar({
  cards,
  mainIndex,
}: {
  cards: ContentCard[];
  mainIndex: number;
}) {
  const timestamps = cards.map((c) => c.time_stamp ?? 0).filter(Boolean);
  if (timestamps.length === 0) return null;

  const minTs = Math.min(...timestamps);
  const maxTs = Math.max(...timestamps);
  const range = maxTs - minTs || 1;

  const mainTs = cards[mainIndex]?.time_stamp ?? minTs;
  const progressPct = (mainTs - minTs) / range;

  const progressAnim = useRef(new Animated.Value(progressPct)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPct,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progressPct]);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={s.progressTrack}>
      <Animated.View style={[s.progressFill, { width: widthInterpolated }]} />
      {cards.map((c, i) => {
        if (!c.time_stamp) return null;
        const pct = ((c.time_stamp - minTs) / range) * 100;
        return (
          <View
            key={c.uuid ?? i}
            style={[
              s.progressDot,
              { left: `${pct}%` as any },
              i === mainIndex && s.progressDotMain,
            ]}
          />
        );
      })}
    </View>
  );
}

// ─── Offset Calculator ────────────────────────────────────────────────────────

function computeCardOffsets(cards: ContentCard[]): number[] {
  const offsets: number[] = [];
  let x = CAP_W + GAP_UNIT;

  cards.forEach((card, i) => {
    if (i > 0 && card.city !== cards[i - 1].city) {
      x += CONN_W + SEP_W + CONN_W + ARROW_W + CONN_W;
    }
    offsets.push(x);
    x += CARD_W;
    if (i < cards.length - 1) {
      x += GAP_UNIT;
    }
  });

  return offsets;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TripTimeline({
  cards,
  onAddPress,
  onCardFocus,
}: TripTimelineProps) {
  const [mainIndex, setMainIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const cardOffsets = useRef<number[]>([]);
  const [isCardView, setIsCardView] = useState(false);
  useEffect(() => {
    cardOffsets.current = computeCardOffsets(cards);
  }, [cards]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollX = e.nativeEvent.contentOffset.x;
      const offsets = cardOffsets.current;

      let best = 0;
      for (let i = 0; i < offsets.length; i++) {
        if (offsets[i] - scrollX >= -10) {
          best = i;
          break;
        }
        best = i;
      }

      if (best !== mainIndex) {
        setMainIndex(best);
        const focused = cards[best];
        onCardFocus?.(focused, best);
        if (focused.latitude != null && focused.longitude != null) {
          MapTransform.flyTo([focused.longitude, focused.latitude], 16);
        }
      }
    },
    [mainIndex, cards, onCardFocus],
  );

  const scrollToCard = useCallback(
    (i: number) => {
      const offset = cardOffsets.current[i];
      if (offset !== undefined) {
        scrollRef.current?.scrollTo({
          x: Math.max(0, offset - 16),
          animated: true,
        });
      }
      setMainIndex(i);
      onCardFocus?.(cards[i], i);
    },
    [cards, onCardFocus],
  );
  if (!cards.length) return null;

  const mainCard = cards[mainIndex];
  const flag = getFlag(mainCard.iso_country_code);

  // ── Build track ───────────────────────────────────────────────────────────
  const trackItems: React.ReactNode[] = [];

  trackItems.push(<StartCap key="cap-start" />);
  trackItems.push(<Connector key="c-s0" />);
  trackItems.push(<ArrowConnector key={`arrow-${"add"}`} />);

  // trackItems.push(<PlusButton key="plus-s" onPress={() => onAddPress?.(-1)} />);
  trackItems.push(<Connector key="c-s1" />);

  cards.forEach((card, i) => {
    if (i > 0 && card.city !== cards[i - 1].city) {
      trackItems.push(<Connector key={`c-sep-l-${i}`} />);
      trackItems.push(
        <CityDivider key={`sep-${i}`} cityName={card.city ?? ""} />,
      );
      trackItems.push(<Connector key={`c-sep-r-${i}`} />);
      // trackItems.push(
      //   <PlusButton
      //     key={`plus-sep-${i}`}
      //     onPress={() => onAddPress?.(i - 1)}
      //   />,
      // );
      trackItems.push(<ArrowConnector key={`arrow-${i}`} />);

      trackItems.push(<Connector key={`c-sep-rr-${i}`} />);
    }

    trackItems.push(
      <MemCard
        key={card.uuid ?? String(i)}
        card={card}
        isMain={i === mainIndex}
        onPress={() => scrollToCard(i)}
        onPressFullScreen={() => setIsCardView(true)}
      />,
    );

    if (i < cards.length - 1) {
      // Use ArrowConnector between cards instead of PlusButton
      trackItems.push(<ArrowConnector key={`arrow-${i}-dup`} />);
    }
  });

  trackItems.push(<Connector key="c-e0" />);
  // trackItems.push(
  //   <PlusButton
  //     key="plus-end"
  //     onPress={() => onAddPress?.(cards.length - 1)}
  //   />,
  // );
  trackItems.push(<ArrowConnector key={`arrow-${"end"}`} />);

  trackItems.push(<Connector key="c-e1" />);
  trackItems.push(<EndCap key="cap-end" />);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      {/* City header row */}
      <View style={s.cityRow}>
        <PulseDot />
        {!!flag && <Text style={s.cityFlag}>{flag}</Text>}
        <Text style={s.cityName} numberOfLines={1}>
          {mainCard.city ?? "Unknown"}
        </Text>
        {!!mainCard.time_stamp && (
          <Text style={s.cityTime}>{formatTime(mainCard.time_stamp)}</Text>
        )}
      </View>

      {/* Animated time progress bar */}
      <TimeProgressBar cards={cards} mainIndex={mainIndex} />

      {/* Timeline scroll */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={s.track}
      >
        {trackItems}
      </ScrollView>
      {isCardView && (
        <MediaViewCard
          uri={cards[mainIndex].media_path}
          visible={isCardView}
          onClose={() => setIsCardView(false)}
          AssetArray={cards}
          isBottomList={true}
          propButton={null}
        ></MediaViewCard>
      )}
      {/* Dot progress indicator */}

      <DotTrack count={cards.length} mainIndex={mainIndex} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    paddingTop: 0,
    paddingBottom: 25,
  },
  memFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
  },

  fullscreenBtn: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 7,
    height: 50,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#e05a3a",
    flexShrink: 0,
  },
  cityFlag: {
    fontSize: 13,
    lineHeight: 16,
  },
  cityName: {
    flex: 1,
    fontFamily: MONO,
    fontSize: 12,
    color: "#1a1917",
    letterSpacing: 0.2,
  },
  cityTime: {
    fontFamily: MONO,
    fontSize: 10,
    color: "#1a1917",
  },

  // ── Progress bar ───────────────────────────────────────────────────────────
  progressTrack: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 2,
    marginHorizontal: 16,
    marginBottom: 10,
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#e05a3a",
    borderRadius: 2,
  },
  progressDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    top: -1.5,
    marginLeft: -2.5,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  progressDotMain: {
    backgroundColor: "#e05a3a",
  },

  track: {
    paddingHorizontal: 16,
    alignItems: "center",
    paddingBottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  overlayFooter: {
    padding: 12,
    // backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  memCard: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#252220",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.08)",
  },
  memCardMain: {
    borderColor: "rgba(255,255,255,0.32)",
  },
  memPlaceholder: {
    backgroundColor: "#252220",
  },
  memShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  memStamp: {
    position: "absolute",
    bottom: 6,
    left: 7,
    fontFamily: MONO,
    fontSize: 8,
    color: "rgba(255,255,255,0.65)",
  },
  memTypeIcon: {
    position: "absolute",
    top: 6,
    right: 7,
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
  },

  // ── Arrow connector (replaces plus between cards) ──────────────────────────
  arrowWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrowIcon: {
    width: ARROW_W,
    fontSize: 20,
    color: "#161514",
    fontFamily: MONO,
    textAlign: "center",
  },

  plusBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#161514",
    borderWidth: 0.5,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    fontSize: 13,
    color: "rgba(255,255,255,0.28)",
    lineHeight: 15,
    includeFontPadding: false,
  },

  connLine: {
    width: CONN_W,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
  },

  sepWrap: {
    width: SEP_W,
    height: CARD_H,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  sepLine: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  sepPill: {
    position: "absolute",
    backgroundColor: "#1c1b1a",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    maxWidth: 68,
  },
  sepPillTxt: {
    fontFamily: MONO,
    fontSize: 8,
    color: "rgba(255,255,255,0.3)",
  },

  cap: {
    width: CAP_W,
    height: CARD_H,
    borderRadius: 12,
    borderWidth: 0.5,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "#161514",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  capIcon: {
    fontSize: 14,
    color: "rgba(255,255,255,1)",
  },
  capLabel: {
    fontFamily: MONO,
    fontSize: 10,
    color: "rgba(255,255,255,1)",
    textAlign: "center",
    lineHeight: 15,
  },
  endCap: {
    borderColor: "rgba(224,90,58,1)",
  },
  endCapIcon: {
    color: "rgba(224,90,58,1)",
  },
  endCapLabel: {
    color: "rgba(224,90,58,1)",
  },

  dotRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  dotLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  dotGroup: {
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  dotOn: {
    backgroundColor: "#fff",
    transform: [{ scale: 1.4 }],
  },
});
