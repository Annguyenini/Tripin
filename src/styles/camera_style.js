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
    fontSize: 30,
    fontWeight: 'bold',
  },
  topControls: {
  position: 'absolute',
  top: 50, // push it down a bit from the status bar
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: '100%',
  paddingHorizontal: 40,
},

  botControls: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    backgroundColor: '#494343ff',
     height: 80, 
    borderRadius:20,
    alignItems: 'center',
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
  flashOverlay : {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.51)',
  zIndex: 1000, // High z-index to appear above everything
},
});
