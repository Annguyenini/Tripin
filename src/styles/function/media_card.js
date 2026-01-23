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
    justifyContent: 'center',
        flexDirection: 'row',


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
   dataButton: {
    position: 'absolute',
    top: 50,
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

  }
})