import {  StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
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
    flex: 1,                  // fill proportional space in parent
    paddingTop: 70,           // small padding instead of top: 0
    alignItems: 'center',     // center horizontally
    width: '100%',
  },

  row: {
    flexDirection: 'row',      // horizontal layout
    justifyContent: 'space-between', // push items to edges
    alignItems: 'center',      // vertical center
    width: '90%',              // slightly inset for padding
    marginBottom: 0,
    marginTop:10,          // space below row
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
    textDecorationLine: 'underline',
    color: '#ffffffff',
    fontWeight: 'bold',
    textAlign: 'left',
  },
   
  title: {
    color: '#ffffffff',
    fontSize: 35,
    fontFamily: 'mainfont',
      position: 'relative', 
      top:-80,
    marginBottom: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  button: {
    width: 60,
    height: 50,
    borderRadius: 100,
    backgroundColor: '#fff', // button color
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', 
    top:-80,
  },
  buttonText: {
    fontSize: 32,
    color: '#000', // text inside button
    fontWeight: 'bold',
    position: 'relative', 
    
  },
  displayname:{
    fontSize: 25,
    color:'#ffff',
    fontFamily: 'mainfont',
    position: 'relative', 
    top:10,
    right:-15,
    textDecorationLine: 'underline',

  },
  profilePic:{
    width: 60,
    height: 60,
    borderRadius: 40, // Half of width/height
    backgroundColor: '#f0f0f0', // Fallback color
    overflow: 'hidden', // This is crucial - clips the image to rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  settingsContainer: {
    right:-170,
    justifyContent: 'center',
        borderRadius: 40, // Half of width/height
        


  },
  settingIcon: {
    width: 40,  // adjust size
    height: 40, // adjust size
  },
   overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999, // Android
    backgroundColor: 'rgba(0,0,0,0.6)', // optional dim
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
  settingIcon: {
    width: 30,  // adjust size
    height: 30, // adjust size
  },
})

