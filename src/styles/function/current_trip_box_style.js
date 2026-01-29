import { StyleSheet,Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');
export const currentTripBoxStyle = StyleSheet.create({
    wrapper:{position: "absolute",
    right: 0,
    top: "25%"
    },
  card: {
    width: width * 0.3,
    height: height * 0.18,
    // margin: 10,
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    top:450,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  minimizedCard :{
    width: width * 0.5,
    height: height * 0.1,
    top:530,
    alignItems: 'center',
    flexDirection :'row',
    justifyContent:'center',
    gap:10

  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backgroundColor: '#f0f0f0', // light gray background
  },
  image: {
    width: '90%',
    top:10,
    height: '80%',
    paddingBottom:1,
    borderRadius: 15,
  },
  minimizeImage:{
    width: '40%',
    height: '80%',
    paddingBottom:10
  },
  liveBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'red',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  arrowButton: {
    position: 'absolute',
    right: 8,
    top: 50, // vertically center relative to image
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 4,
  },
  tripName: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  minimizeTripName:{
    fontSize: 14,
    color: '#333',
  }
});