import { StyleSheet, Dimensions } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export const ModifyingTripContent = StyleSheet.create({
  sheetBg: { backgroundColor: "rgba(255, 252, 245, 0.95)" },
  sheetHandle: { backgroundColor: "#3a3830", width: 40 },

  container: {
    height: SCREEN_HEIGHT * 0.3,
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
  },

  scrollContent: {
    paddingBottom: 16,
  },
  suggestList: {
    maxHeight: SCREEN_HEIGHT * 0.5,
    backgroundColor: "#2a2826",
    borderRadius: 8,
    marginTop: 4,
    overflow: "hidden",
  },
  suggestItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  suggestItemName: {
    color: "white",
    fontSize: 12,
  },
  suggestItemAddress: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 10,
    marginTop: 1,
  },
  // shared
  phaseWrap: { gap: 10 },
  phaseTitle: { color: "black", fontSize: 13, fontWeight: "600" },
  closeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 4,
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2a2826",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnTxt: {
    color: "white",
    fontSize: 12,
    lineHeight: 14,
  },

  // phase 1 - media
  mediaPreview: {
    width: "100%",
    height: 80,
    borderRadius: 10,
    backgroundColor: "#2a2826",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  mediaPreviewTxt: { color: "rgba(255,255,255,0.5)", fontSize: 12 },

  optionBtn: {
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#2a2826",
    alignItems: "center",
  },
  optionBtnTxt: { color: "white", fontSize: 12 },

  continueBtn: {
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  continueBtnActive: { backgroundColor: "#4a4743", opacity: 1 },
  continueBtnDisabled: { backgroundColor: "#2a2826", opacity: 0.5 },
  continueBtnTxt: { color: "white", fontWeight: "600", fontSize: 12 },

  // phase 2 - details
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backTxt: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
  detailsHeaderSpacer: { width: 28 },

  fieldGroup: { gap: 4 },
  fieldLabel: { color: "black", fontSize: 10 },

  input: {
    backgroundColor: "#2a2826",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    color: "white",
    fontSize: 12,
  },

  dateTimeRow: { flexDirection: "row", gap: 6 },
  dateTimeBtn: {
    flex: 1,
    backgroundColor: "#2a2826",
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: "center",
  },
  dateTimeBtnTxt: { color: "white", fontSize: 11 },

  saveBtn: {
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#4a4743",
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnTxt: { color: "white", fontWeight: "600", fontSize: 12 },
});
