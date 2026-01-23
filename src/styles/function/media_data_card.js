import { StyleSheet,Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');
export const mediaDataCardStyle = StyleSheet.create({
  
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  
    card: {
    width: "90%",
    minHeight: height * 0.18,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: "5%",
    paddingHorizontal: "6%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  exitButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#eee', // light gray
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  exitText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },

  tripName: {
    fontSize: width * 0.055,
    fontWeight: "700",
    marginBottom: "4%",
  },

  row: {
    flexDirection: "row",
    marginBottom: "2%",
  },

  label: {
    width: "25%",
    fontSize: width * 0.04,
    color: "#666",
  },

  value: {
    fontSize: width * 0.04,
    fontWeight: "500",
  },

  footer: {
    marginTop: "6%",
    alignItems: "flex-end",
  },

  date: {
    fontSize: width * 0.035,
    color: "#999",
  },
})
