import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  PanResponder,
  StyleSheet,
  Dimensions,
} from "react-native";
import CurrentDisplayContentsObserver from "../../../observers/current_contents/current_display_contents_observer";
import GalleryOverlay from "./GalleryOverlay";
import PolaroidCard from "./PolaroidCard";
import PhotoSheet from "./PhotoSheet";
import { SLOT_W, GALLERY_H } from "./constants";
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export default function PolaroidGallery({ data }) {
  const [locations, setLocations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const selectedRef = useRef(0);
  const locationsRef = useRef([]);
  const sheetOpenRef = useRef(false);

  useEffect(() => {
    selectedRef.current = selectedIndex;
  }, [selectedIndex]);
  useEffect(() => {
    locationsRef.current = locations;
  }, [locations]);
  useEffect(() => {
    sheetOpenRef.current = sheetOpen;
  }, [sheetOpen]);

  // ── group by city
  useEffect(() => {
    const grouped = [];
    for (const m of data || []) {
      let g = grouped.find((x) => x.city === m.city);
      if (!g) {
        g = {
          city: m.city,
          region: m.region,
          country: m.country,
          iso_country_code: m.iso_country_code,
          hang: grouped.length % 2,
          rot: grouped.length % 2 ? 6 : -5,
          medias: [],
          notes: [],
        };
        grouped.push(g);
      }
      if (m.media_type === "note") g.notes.push(m);
      else g.medias.push(m);
    }
    setLocations(grouped);
    setSelectedIndex(0);
  }, [data]);

  // ── pan responder — blocked while sheet is open
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !sheetOpenRef.current,
      onMoveShouldSetPanResponder: (_, g) =>
        !sheetOpenRef.current && Math.abs(g.dx) > 8,
      onPanResponderRelease: (_, g) => {
        if (sheetOpenRef.current) return;
        const dx = g.dx;
        const locs = locationsRef.current;
        const cur = selectedRef.current;
        if (dx < -30 && cur < locs.length - 1) setSelectedIndex(cur + 1);
        else if (dx > 30 && cur > 0) setSelectedIndex(cur - 1);
      },
    }),
  ).current;

  const scrollWidth = Math.max(600, locations.length * SLOT_W + 80);

  if (!locations.length) return null;

  return (
    // Explicit screen dimensions so absoluteFillObject on the sheet
    // resolves to actual screen size, not an unconstrained flex child
    <View style={{ width: SCREEN_W, height: SCREEN_H * 0.35 }}>
      {/* ── GALLERY ── */}
      <View
        style={{ width: SCREEN_W, height: GALLERY_H }}
        {...panResponder.panHandlers}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        >
          <View style={{ width: scrollWidth, height: GALLERY_H }}>
            <GalleryOverlay width={scrollWidth} locationArray={locations} />
            {locations.map((loc, i) => (
              <PolaroidCard
                key={loc.city}
                location={loc}
                index={i}
                isSelected={i === selectedIndex}
                onPress={() => {
                  if (i === selectedIndex) setSheetOpen(true);
                  else setSelectedIndex(i);
                }}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* ── SHEET — sibling of the gallery, absolutely positioned over it ── */}
      {sheetOpen && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <PhotoSheet
            location={locations[selectedIndex]}
            onClose={() => setSheetOpen(false)}
          />
        </View>
      )}
    </View>
  );
}
