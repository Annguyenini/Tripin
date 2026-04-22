import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');

export const mediaCardStyle = StyleSheet.create({

  overlayContainer: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(44,44,42,0.85)',
  },

  card: {
    width: width * 0.90,
    height: height * 0.90,
    padding: 2,
    backgroundColor: '#e8c9a0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,109,17,0.2)',
    shadowColor: '#2C2C2A',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 8,
    alignContent: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },

  fullCard: {
    width: width,
    height: height,
    padding: 2,
    backgroundColor: '#e8c9a0',
    borderRadius: 0,
    shadowColor: '#2C2C2A',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 8,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

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
    backgroundColor: '#000000',
    width: 32, height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#2C2C2A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 3,
  },

  dataButton: {
    position: 'absolute',
    top: 80,
    right: 10,
    backgroundColor: '#000000',
    width: 32, height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#2C2C2A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 3,
  },

  deleteButton: {
    position: 'absolute',
    top: 120,
    right: 10,
    backgroundColor: '#ffffff',
    width: 32, height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#2C2C2A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 3,
  },

  fullscreenButton: {
    position: 'absolute',
    top: 40,
    right: 50,
    backgroundColor: '#000000',
    width: 32, height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#2C2C2A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 3,
  },

  exitText: {
    color: '#f5f0e8',
    fontWeight: 'bold',
    fontSize: 16,
  },

  title: {
    fontFamily: 'PermanentMarker',
    fontSize: 24,
    color: '#2C2C2A',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.04,
  },

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

  clusterCard: {
    width: width * 0.15,
    backgroundColor: '#e8c9a0',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(59,109,17,0.25)',
    shadowColor: '#2C2C2A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
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
    color: '#2C2C2A',
    fontFamily: 'DMMono',
    letterSpacing: 0.06,
  },

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

  ImageListOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  playButton: {
    fontSize: 25,
    color: '#f5f0e8',
  },

  overlayImage: {
    width: 100,
    height: 100,
    tintColor: '#f5f0e8',
  },
})

export const deleteCardStyle = StyleSheet.create({

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#c97a6a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2A',
    marginBottom: 20,
  },

  buttons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },

  cancelBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#000000',
    alignItems: 'center',
  },

  cancelText: { fontSize: 13, color: '#3B6D11' },

  confirmBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#c97a6a',
    alignItems: 'center',
  },

  confirmText: { fontSize: 13, color: '#f5f0e8' },
})