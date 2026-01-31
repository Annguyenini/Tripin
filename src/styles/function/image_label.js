import { StyleSheet } from "react-native";
export const imageLabelStyle = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  videoOverlayCard :{
        ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', // optional dim
    justifyContent: 'center',
    alignItems: 'center',
        borderRadius: 9,

  },
  overlayImage: {
    width: 100,
    height: 100,
    tintColor: 'white', // optional
    borderRadius: 9,

  },
  displayButton :{
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
})