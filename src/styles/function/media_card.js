import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');

export const mediaCardStyle = StyleSheet.create({

  // ── OVERLAY BACKDROP ──
  overlayContainer: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },

  // ── MAIN CARD ──
  card: {
    width: width * 0.90,
    height: height * 0.90,
    padding: 2,
    backgroundColor: '#1a1917',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 8,
    alignContent: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },

  // ── FULL CARD ──
  fullCard: {
    width: width,
    height: height,
    padding: 2,
    backgroundColor: '#0d0c0a',
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 8,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // ── BUTTONS ROW ──
  buttons: {
    position: 'absolute',
    top: 10,
    right: 100,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },

  exitButton: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: '#242220',
    width: 32, height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 3,
  },

  dataButton: {
    position: 'absolute',
    top: 80,
    right: 10,
    backgroundColor: '#242220',
    width: 32, height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 3,
  },
   deleteButton: {
    position: 'absolute',
    top: 120,
    right: 10,
    backgroundColor: '#242220',
    width: 32, height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 3,
  },
  fullscreenButton: {
    position: 'absolute',
    top: 40,
    right: 50,
    backgroundColor: '#242220',
    width: 32, height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 3,
  },

  exitText: {
    color: '#f0f0ec',
    fontWeight: 'bold',
    fontSize: 16,
  },

  title: {
    fontFamily: 'PermanentMarker',
    fontSize: 24,
    color: '#f0f0ec',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.04,
  },

  // ── MEDIA ──
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  video: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },

  fullVideo: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },

  // ── CLUSTER CARD ──
  clusterCard: {
    width: width * 0.15,
    backgroundColor: '#1a1917',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 4,
  },

  imageList: {
    width: '100%',
    height: width * 0.15,
    borderRadius: 8,
  },

  text: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '500',
    color: '#f0f0ec',
    fontFamily: 'DMMono',
    letterSpacing: 0.06,
  },

  // ── BOTTOM LIST ──
  bottomListContainer: {
    position: 'absolute',
    alignContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 10,
    bottom: 10,
    width: '100%',
    zIndex: 20,
  },

  // ── IMAGE LIST OVERLAY ──
  ImageListOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
playButton:{
  fontSize: 25,
    color: '#f0f0ec',
},
  overlayImage: {
    width: 100,
    height: 100,
    tintColor: '#f0f0ec',
  },
})