import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  valueText: {
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000",
  },
  activeButton: {
    backgroundColor: "#000",
  },
  buttonText: {
    fontSize: 16,
  },
  activeButtonText: {
    color: "#fff",
  },
});
