import { StyleSheet, Dimensions } from "react-native";
const SCREEN_HEIGHT = Dimensions.get("window").height;

// Signature: a travel-journal ink palette — warm paper background,
// deep teal for structure/actions, brass for the one accent (dates,
// confirmations) — read as a postmark, not a template.
const INK = "#2B2A28";
const INK_SOFT = "rgba(43,42,40,0.55)";
const PAPER = "#FAF6EE";
const TEAL = "#1F5C56";
const TEAL_DARK = "#163F3B";
const BRASS = "#B8874B";
const LINE = "rgba(43,42,40,0.10)";
const ERROR = "#A3453A";

export const ModifyingTripContent = StyleSheet.create({
  sheetBg: { backgroundColor: "rgba(250, 246, 238, 0.97)" },
  sheetHandle: { backgroundColor: INK_SOFT, width: 40, borderRadius: 2 },

  container: {
    height: SCREEN_HEIGHT * 0.55,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 6,
    backgroundColor: PAPER,
  },

  suggestList: {
    maxHeight: SCREEN_HEIGHT * 0.32,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: LINE,
    overflow: "hidden",
  },
  suggestItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  suggestItemName: {
    color: INK,
    fontSize: 13,
    fontWeight: "500",
  },
  suggestItemAddress: {
    color: INK_SOFT,
    fontSize: 11,
    marginTop: 2,
  },

  phaseWrap: { gap: 12 },
  phaseTitle: {
    color: INK,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  closeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 2,
  },
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(43,42,40,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnTxt: {
    color: INK,
    fontSize: 13,
    lineHeight: 15,
  },

  // phase 1 — media
  mediaPreview: {
    width: "100%",
    height: 320,
    borderRadius: 14,
    backgroundColor: "#EFE9DA",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: LINE,
  },
  mediaPreviewEmpty: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    backgroundColor: "#EFE9DA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LINE,
    borderStyle: "dashed",
  },
  media: {
    width: "100%",
    height: "100%",
  },
  mediaPreviewTxt: { color: INK_SOFT, fontSize: 12 },

  optionBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: LINE,
  },
  optionBtnTxt: { color: INK, fontSize: 13, fontWeight: "500" },

  continueBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  continueBtnActive: { backgroundColor: TEAL },
  continueBtnDisabled: { backgroundColor: "rgba(31,92,86,0.35)" },
  continueBtnTxt: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },

  // phase 2 — details
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backTxt: { color: TEAL, fontSize: 13, fontWeight: "600" },
  detailsHeaderSpacer: { width: 28 },

  fieldGroup: { gap: 6 },
  fieldLabel: {
    color: INK_SOFT,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  errorTxt: {
    color: ERROR,
    fontSize: 11.5,
  },
  confirmTxt: {
    color: TEAL_DARK,
    fontSize: 12,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: LINE,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: INK,
    fontSize: 13,
  },

  // ticket-stub styling for date/time
  dateTimeRow: { flexDirection: "row", gap: 8 },
  dateTimeBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: LINE,
    borderLeftWidth: 3,
    borderLeftColor: BRASS,
  },
  dateTimeBtnLabel: {
    color: INK_SOFT,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  dateTimeBtnTxt: { color: INK, fontSize: 13, fontWeight: "600" },

  saveBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: TEAL,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnTxt: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
});
