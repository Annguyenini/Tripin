import { StyleSheet, Dimensions } from "react-native";

export const settingStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F2DE",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 55,
    paddingBottom: 18,
  },

  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },

  closeText: {
    color: "#8A8A8A",
    fontSize: 14,
    fontWeight: "500",
  },

  screenTitle: {
    flex: 1,
    textAlign: "center",
    marginRight: 40,
    fontSize: 22,
    fontWeight: "700",
    color: "#2D2D2D",
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
  },

  avatarEmoji: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F2E4D6",
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 56,
    fontSize: 22,
    color: "#C46A2D",
    fontWeight: "700",
    overflow: "hidden",
  },

  username: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: "700",
    color: "#303030",
    marginLeft: 16,
  },

  email: {
    marginLeft: 16,
    marginTop: 4,
    color: "#8D8D8D",
    fontSize: 13,
  },

  sectionLabel: {
    marginTop: 18,
    marginBottom: 8,
    color: "#B7AC92",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    paddingHorizontal: 16,
    paddingVertical: 15,

    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,

    backgroundColor: "#EDF2F7",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  iconText: {
    fontSize: 20,
  },

  rowLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2F2F2F",
  },

  rowSub: {
    marginTop: 4,
    color: "#979797",
    fontSize: 13,
  },

  arrow: {
    fontSize: 22,
    color: "#BBBBBB",
    fontWeight: "600",
  },

  PoliciesItems: {
    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    paddingHorizontal: 16,
    paddingVertical: 18,

    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,

    elevation: 2,
  },

  logoutRow: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    paddingHorizontal: 16,
    paddingVertical: 15,

    marginTop: 6,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,

    elevation: 2,
  },

  logoutText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },

  Delete: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 18,

    borderWidth: 1,

    borderColor: "#F2D2C6",

    backgroundColor: "#FFFDFB",

    borderRadius: 18,

    paddingVertical: 16,
  },

  profileOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: Dimensions.get("window").height * 0.01,

    zIndex: 500,

    backgroundColor: "#1a1917",
  },
});
