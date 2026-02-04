import { StyleSheet } from "react-native";

export const markerManagerStyle = StyleSheet.create({
  container: {
    position: "absolute",
    top: 110,       // distance from top
    left: 5,        // 👈 left side now
    // alignItems: "center",
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
    shadowColor: "#0a0909",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
  },
  
  icon: {
    // width: 25,
    // height: 25,
    tintColor: "#000",
    fontSize:30
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  controlbutton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
    row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notifyCover:{
    backgroundColor:'#acacac',
    borderRadius:10,
    paddingVertical: 5,
    paddingHorizontal: 8,
  }
});
