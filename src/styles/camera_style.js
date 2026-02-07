import {  StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const cameraStyle = StyleSheet.create({
  camera: {
    position: 'absolute', 
    top: 0, 
    left: 0, width, height
   
  },

  container: {
    flex: 1,
    // backgroundColor: 'black',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
  },
  topControls: {
    flexDirection:'row',
    gap:'150',
    position: 'absolute',
    top: 50,
    left: 20
},
 top_wrapper: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 130,
    zIndex: 10
  },
  top_shape: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  botControls: {
    // position: 'absolute',
    // bottom: 50,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // width: '100%',
    // paddingHorizontal: 40,
    // backgroundColor: '#494343ff',
    //  height: 80, 
    // borderRadius:20,
    // alignItems: 'center',
    
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  icon:{
    size: 10,
    padding: 10,             // touchable area
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,

  },
  flipButton: {
    // width: 60,
    // height: 60,
    borderRadius: 30,
    // backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 2,
    borderColor: 'white',
  },
  snapButton: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
    outerCircle: {
    position:'absolute',

    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },

  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureText: {
    fontSize: 20,
  },

  zoomControls:{
    position: 'absolute',
    bottom: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
     height:  40, 
    borderRadius:20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',

  },
  zoomButtons:{
      borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
  },
  zoomText:{
    fontSize:20,
    color: 'rgba(255,255,255,0.9)',
  },
  zoomModeZone:{
    alignItems: 'center',
    borderRadius: 30,

    backgroundColor:'#535353ff'
  },
  currentZoomText:{
    fontSize:30,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  currentZoomZone:{
    alignItems: 'center',
    borderRadius: 30,

    backgroundColor:'#303030ff'
  },
    cameraMode:{
    fontSize:13,
    color: 'rgba(255,255,255,0.9)',
    backgroundColor:"#7c1515ff",
    borderRadius:10,
  },
  flashOverlay : {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.51)',
  zIndex: 1000, // High z-index to appear above everything
},
  middleBar:{
      position: 'absolute',
  bottom: 150,
  // flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  paddingHorizontal: 20,
  height: 50,
  borderRadius: 20,
  // backgroundColor: 'rgba(255,255,255,0.1)',
  },
  captureMode:{ 
  // position: 'absolute',
  // left: '50%',
  transform: [{ translateX: -150 }], // half of width of currentZoomZone
  alignItems: 'left ',
  justifyContent: 'left',
  }
});


export const camera_zoom = StyleSheet.create({
  zoom_mode_zone:{
   backgroundColor: 'rgba(255,255,255,0.1)',
       flexDirection: 'row',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 10,   // smaller padding
    paddingHorizontal: 5,
    alignSelf: 'flex-start', // 👈 fix it to the left
    transform: [{ scale: 1 }], // 👈 make everything 70% smaller
    marginLeft: 0, // optional spacing from screen edge
     transform: [{ translateX: 250 }]
  },
  zoom_text :{
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
    marginHorizontal: 6,
  },
  current_zoom_text_mode :{
      color: 'white',
      fontSize: 15,
      fontWeight: '500',
      marginHorizontal: 6,
  },
  curent_zoom_mode_overlay :{
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderRadius:10,

  },
  zoom_mode_overlay :{
    backgroundColor: '#fffffffffff',

  },
  zoomControls: {
  position: 'absolute',
  bottom: 150,
  // flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  paddingHorizontal: 20,
  height: 50,
  borderRadius: 20,
  // backgroundColor: 'rgba(255,255,255,0.1)',
},

zoomButtonsGroup: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},

zoomButtons: {
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: 'white',
  borderWidth: 1,
  width: 35,
  height: 35,
},

zoomText: {
  fontSize: 20,
  color: 'rgba(255,255,255,0.9)',
},

currentZoomZone: {
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 30,
  backgroundColor: '#303030ff',
  paddingHorizontal: 12,
  paddingVertical: 4,
  
},

currentZoomText: {
  fontSize: 28,
  color: 'rgba(255,255,255,0.9)',
  fontWeight: '600',
},
centeredZoom: {
  position: 'absolute',
  left: '50%',
  // transform: [{ translateX: -1 }], // half of width of currentZoomZone
  alignItems: 'center',
  justifyContent: 'center',
},

})