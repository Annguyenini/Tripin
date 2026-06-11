import React from "react";
import Svg, { Line, Path, Defs, Marker } from "react-native-svg";
import {
  CARD_W,
  SLOT_W,
  STRING_Y,
  STRING_COLOR,
  ACCENT,
  HANG_LEN,
  GALLERY_H,
} from "./constants";

function center(locations, i) {
  const x = i * SLOT_W + 36 + CARD_W / 2;
  const y = locations[i].hang
    ? STRING_Y + HANG_LEN + CARD_W / 2
    : STRING_Y + CARD_W / 2;
  return { x, y };
}

export default function GalleryOverlay({ width, locationArray }) {
  return (
    <Svg
      width={width}
      height={GALLERY_H}
      style={{ position: "absolute" }}
      pointerEvents="none"
    >
      <Defs>
        <Marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3">
          <Path d="M0,0 L6,3 L0,6 Z" fill={ACCENT} opacity="0.7" />
        </Marker>
      </Defs>

      {/* main string */}
      <Line
        x1="0"
        y1={STRING_Y}
        x2={width}
        y2={STRING_Y}
        stroke={STRING_COLOR}
        strokeWidth="1.5"
        opacity="0.5"
      />

      {/* hanging threads */}
      {locationArray.map((loc, i) =>
        loc.hang ? (
          <Line
            key={i}
            x1={i * SLOT_W + 36 + CARD_W / 2}
            y1={STRING_Y}
            x2={i * SLOT_W + 36 + CARD_W / 2}
            y2={STRING_Y + HANG_LEN}
            stroke={STRING_COLOR}
            strokeWidth="1"
            opacity="0.4"
          />
        ) : null,
      )}

      {/* curved connections */}
      {locationArray.map((_, i) => {
        if (i === locationArray.length - 1) return null;

        const a = center(locationArray, i);
        const b = center(locationArray, i + 1);

        const cx = (a.x + b.x) / 2;
        const cy = Math.min(a.y, b.y) - 50;

        return (
          <Path
            key={`c-${i}`}
            d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
            fill="none"
            stroke={ACCENT}
            strokeWidth="1"
            strokeDasharray="5 4"
            opacity="0.6"
            markerEnd="url(#arrow)"
          />
        );
      })}
    </Svg>
  );
}
