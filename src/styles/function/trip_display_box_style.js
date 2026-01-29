import { StyleSheet,Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');
export const currentTripDisplayBoxStyle = StyleSheet.create({
    wrapper:{position: "absolute",
    right: 0,
    top: "25%"
    },
  card: {
    width: width * 0.5,
    height: height * 0.3,
    // margin: 10,
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    top:250,
    paddingVertical: 0,
    paddingHorizontal: 0,
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
    right: '85%',
    // top: '40%', // vertically center relative to image
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 4,
    height:'13%',
    alignContent:'center',
    alignItems:'center'
  },
  arrowText:{
    fontSize:20,
    alignContent:'center'
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