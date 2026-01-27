import { StyleSheet,Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');
export const mediaCardStyle=StyleSheet.create
({
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
    width: width * 0.90,
    height:height*.90,
    padding: 2,
    backgroundColor: '#555555ff', // card white
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignContent:'center',
    // justifyContent: 'center',
      justifyContent: 'flex-start', // top
        flexDirection: 'row',
        


  },
  fullCard: {
    width: width * 1,
    height:height*1,
    padding: 2,
    backgroundColor: '#555555ff', // card white
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignContent:'center',
    justifyContent: 'center',
        flexDirection: 'row',


  },
 buttons: {
  position: 'absolute',  // crucial
  top: 10,               // distance from top
  right: 100,             // distance from right
  flexDirection: 'row',  // horizontal layout
  gap: 10,               // spacing between buttons (or use marginRight)
  zIndex: 10,            // make sure it sits above content
},
  exitButton: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: '#eee', // light gray
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
   dataButton: {
    position: 'absolute',
    top: 80,
    right: 10,
    backgroundColor: '#eee', // light gray
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
   fullscreenButton: {
    position: 'absolute',
    top: 40,
    right: 50,
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
  title: {
    fontFamily: 'mainfont',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image:{

    width:'100%',
    height: '100%', 
    borderRadius: 10
  },
  video :{
       width:'100%',
    height: '100%',
        borderRadius: 10

  },

  fullImage:{

    width:'100%',
    height: '100%', 
    borderRadius: 10
  },
  fullVideo :{
       width:'100%',
    height: '100%',
        borderRadius: 10

  },
  clusterCard: {
    width: width * 0.15,
    // marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // elevation: 4,
  },

  imageList: {
    width: "100%",
    height: width * 0.15,
    borderRadius: 14,
  },
  text: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  bottomListContainer: {
  position: "absolute",
  alignContent :'center',
  alignItems:'center',
  padding:5,
  margin:10,
  bottom: 10, // distance from bottom
  width: "100%",
  zIndex: 20,

},
 ImageListOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', // optional dim
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayImage: {
    width: 100,
    height: 100,
    tintColor: 'white', // optional
  },
})