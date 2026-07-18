import { StyleSheet } from "react-native";

// TRIPPING brand palette — keep this block in sync with the design system doc
const PRIMARY = "#FF7E47";
const PRIMARY_DARK = "#C85A28";
const SECONDARY = "#2E86AB";
const SECONDARY_DARK = "#1E5C76";
const SECONDARY_TINT = "#DCEEF5";
const CARD = "#FFFDF8";
const LINE = "#E6DCC1";
const INK = "#333333";
const INK_SOFT = "#6B6B63";

export const helpBarMapStyle = StyleSheet.create({
  container: {
    position: "absolute",
    top: 110,
    right: 5,
    alignItems: "center",
  },
  zoomContainer: {
    backgroundColor: "rgba(51,51,51,0.55)",
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: CARD,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    borderWidth: 1,
    borderColor: LINE,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Quicksand-Bold",
    color: INK,
  },
  recenterButton: {
    backgroundColor: CARD,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: LINE,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  recenterButtonActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
    shadowColor: PRIMARY_DARK,
    shadowOpacity: 0.25,
  },
  styleSelection: {
    backgroundColor: CARD,
    width: 50,
    height: 150,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: LINE,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: INK,
  },
  iconActive: {
    tintColor: "#FFFDF8",
  },
  // shared circular action button used across the map help bar
  btn: {
    backgroundColor: CARD,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: LINE,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  btnActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
    shadowColor: PRIMARY_DARK,
    shadowOpacity: 0.25,
  },
  styleOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: LINE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: INK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  styleOptionSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    height: 42,
    borderRadius: 21,
    backgroundColor: SECONDARY_TINT,
    borderWidth: 1,
    borderColor: LINE,
    paddingHorizontal: 12,
  },
  locationPillText: {
    fontSize: 11,
    fontFamily: "BeVietnamPro-Medium",
    color: SECONDARY_DARK,
    marginLeft: 5,
  },
  colors: {
    primary: PRIMARY,
    primaryDark: PRIMARY_DARK,
    secondary: SECONDARY,
    secondaryDark: SECONDARY_DARK,
    secondaryTint: SECONDARY_TINT,
    card: CARD,
    line: LINE,
    ink: INK,
    inkSoft: INK_SOFT,
  },
});
