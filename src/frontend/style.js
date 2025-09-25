import {  StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    position: 'absolute',
    bottom: 140,
  },
  button: {
    backgroundColor: '#ffffff67', // old semi-transparent white
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: 'mainfont',
    color: '#000000ff', // black text
    fontSize: 30,
    textAlign: 'center',
  },
});

export const authStyle = StyleSheet.create({
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
    width: width * 0.85,
    padding: 20,
    backgroundColor: '#fff', // card white
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontFamily: 'mainfont',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  submitButton: {
    backgroundColor: '#000000ff', // black submit
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff', // white text
    fontSize: 18,
    fontWeight: 'bold',
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
});


export const mainScreenStyle = StyleSheet.create({
    container: {
    flex: 1,              // fill the screen
  },
   scrollView: {
    flex: 1,            // makes the ScrollView itself take the whole screen
  },
  scrollContent: {
    flexGrow: 1,        // ensures content inside expands to fill screen height
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
   logo: {
    width: width * 0.20,  // 15% of screen width
    height: width * 0.20, // keep it square
    resizeMode: 'contain',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  curentTripZone: {
    flex: 1,                  // fill screen
    justifyContent: 'top', // vertical center
    top :80,
    alignItems: 'center',     // horizontal center
    backgroundColor: '#fffffff',  // optional, makes white text visible
  },
  alltrip: {
    flex: 4,                  // fill screen
    justifyContent: 'top', // vertical center
    alignItems: 'center',     // horizontal center
    backgroundColor: '#fffffff',  // optional, makes white text visible
  },
  allTripTitle:{
     fontSize: 25,
         fontFamily: 'mainfont',

  color: '#fff',
  fontWeight: 'bold',
  textAlign: 'left',
  },
   row: {
    flexDirection: 'row',      // horizontal layout
  justifyContent: 'space-between', // push items to edges
    alignItems: 'center',
    width: '95%',                // span full width
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'mainfont',

    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    width: 60,
    height: 50,
    borderRadius: 100,
    backgroundColor: '#fff', // button color
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 32,
    color: '#000', // text inside button
    fontWeight: 'bold',
  },
 
});
export const footer = StyleSheet.create({
   footerContainer: {
    position: 'absolute', // key for fixed
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#ffffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 999,
    borderRadius:20,
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
  },
  fotterbutton: {
    padding: 10,             // touchable area
    alignItems: 'center',
    justifyContent: 'center',
  },
  fottericon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  fotterrow: {
    flexDirection: 'row',      // horizontal layout
  justifyContent: 'space-between', // push items to edges
    alignItems: 'center',
    width: '80%',                // span full width
  },
})




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
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  flipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
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
});
