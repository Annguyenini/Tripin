import { StyleSheet } from "react-native";
import { colors } from "./function/trip_style";

// Bottom sheet + trip stat header styles — album theme.
// NOTE: this file didn't exist in what was shared, so it's built fresh here
// to satisfy every BottomSheetSyle.* key referenced by UserDataBottomSheet
// and TripStat. If you already have a real bottom_sheet.styles.js, send it
// over and this should be merged into it rather than replacing it outright.

export const BottomSheetSyle = StyleSheet.create({
  // ── Sheet shell ──────────────────────────────────────────────────────────
  sheetBg: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHandle: {
    backgroundColor: colors.divider,
    width: 38,
    height: 4,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 40,
  },

  // ── View-mode segmented control (Statistic / Timeline) ──────────────────
  segmentGroup: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 999,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  segmentBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  segmentBtnActive: {
    backgroundColor: colors.peachMid,
  },
  segmentBtnText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "DMMono-Regular",
  },
  segmentBtnTextActive: {
    color: colors.peachDark,
    fontWeight: "700",
  },

  // ── Owner-only add button ────────────────────────────────────────────────
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.peachMid,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    color: colors.peachDark,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "700",
  },

  // ── "By @author" byline for trips you don't own ─────────────────────────
  byLine: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: "DMMono-Regular",
    letterSpacing: 0.2,
  },

  // ── Trip header ──────────────────────────────────────────────────────────
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 18,
  },
  image: {
    width: 78,
    height: 94,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: "#fff",
  },
  titleBlock: {
    flex: 1,
  },
  tripNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  tripName: {
    fontFamily: "Caveat-Bold",
    fontSize: 26,
    color: colors.text,
    flexShrink: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.skyDark,
  },
  statusText: {
    fontFamily: "DMMono-Regular",
    fontSize: 10.5,
    color: colors.textMuted,
  },

  // ── Privacy badge (Private / Friends / Public) ──────────────────────────
  // Colors are applied per-state at the call site using the same
  // rose/sky/sage tokens as the privacy toggle in NewTripFiller and
  // TripCustomCard, so a trip's privacy reads the same everywhere.
  privacyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  privacyBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "DMMono-Regular",
  },

  // ── More (•••) menu button ───────────────────────────────────────────────
  moreBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  moreBtnText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },

  // ── Fly to button ────────────────────────────────────────────────────────
  flyToBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: colors.peach,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.peachMid,
  },
  flyToBtnText: {
    color: colors.peachDark,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "DMMono-Regular",
  },

  // ── End trip / Go back pill ──────────────────────────────────────────────
  // Base (End trip) uses rose since ending the active trip is the
  // higher-stakes action; the Go back state swaps to a neutral surface pill.
  endTripCover: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.rose,
    borderWidth: 1,
    borderColor: colors.roseDark,
  },
  endTripCoverGoBack: {
    backgroundColor: colors.surface,
    borderColor: colors.divider,
  },
  upBtnText: {
    fontFamily: "DMMono-Regular",
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: 0.3,
  },

  // ── Memories divider ─────────────────────────────────────────────────────
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerLabel: {
    fontFamily: "Caveat-Bold",
    fontSize: 20,
    color: colors.text,
  },
});
