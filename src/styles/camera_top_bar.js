import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const topCameraBarStyle = StyleSheet.create({
  top_wrapper: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 130,
    zIndex: 10,
  },
  top_shape: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  topControls: {
    flexDirection: 'row',
    gap: 150,
    position: 'absolute',
    top: 50,
    left: 20,
    alignItems: 'center',
  },
  flipButton: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
  },
  overlayText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },

  // ⚡︎ wrapper
  flashWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  lightningText: {
    fontSize: 35,
    color: 'yellow',
  },
  flashOverlayButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
