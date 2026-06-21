import { StyleSheet } from "react-native";
import { CARD_W, CARD_H, CAP_W, SEP_W, CONN_W, PLUS_W, MONO } from "./types";

const styles = StyleSheet.create({
  // ── Root ──
  root: {
    paddingTop: 11,
    paddingBottom: 14,
  },

  // ── City header ──
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 9,
    height: 26,
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
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 0.2,
  },
  cityTime: {
    fontFamily: MONO,
    fontSize: 10,
    color: "rgba(255,255,255,0.22)",
  },

  // ── Scroll track ──
  track: {
    paddingHorizontal: 16,
    alignItems: "center",
    paddingBottom: 2,
  },

  // ── Memory card ──
  memCard: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 12,
    overflow: "hidden",
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

  // ── Plus button ──
  plusBtn: {
    width: PLUS_W,
    height: PLUS_W,
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

  // ── Connector line ──
  connLine: {
    width: CONN_W,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
  },

  // ── City separator ──
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

  // ── Cap cards (start / end) ──
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
    color: "rgba(255,255,255,0.22)",
  },
  capLabel: {
    fontFamily: MONO,
    fontSize: 8,
    color: "rgba(255,255,255,0.2)",
    textAlign: "center",
    lineHeight: 12,
  },
  endCap: {
    borderColor: "rgba(224,90,58,0.22)",
  },
  endCapIcon: {
    color: "rgba(224,90,58,0.38)",
  },
  endCapLabel: {
    color: "rgba(224,90,58,0.3)",
  },

  // ── Dot track ──
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

export default styles;
