import { StyleSheet } from "react-native";
export const helpBarMapStyle = StyleSheet.create({
container: {
    position: "absolute",
    top: 110,        // distance from top
    right: 5,      // distance from right
    alignItems: "center",

  },
  zoomContainer: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
  },
  recenterButton: {
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
  icon: {
    width: 25,
    height: 25,
    tintColor: "#000",
  },
});