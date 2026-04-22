import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');

export const currentTripDisplayBoxStyle = StyleSheet.create({

  wrapper: {
    position: 'absolute',
    right: 230,
    top: 230,
  },

  card: {
    width: width * 0.40,
    backgroundColor: '#f5f0e8',
    borderRadius: 2,
    top: 250,
    padding: 10,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    transform: [{ rotate: '-2deg' }],
  },

  // ── TOP ──
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  arrowButton: {
    width: 24, height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrowText: {
    fontSize: 14,
    color: '#2a2018',
  },

  tripName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'DMMono',
    color: '#2a2018',
    letterSpacing: 0.5,
    marginTop: 8,
  },

  closeButton: {
    width: 24, height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeText: {
    color: '#888',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // ── BOTTOM ──
  bottomSection: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },

  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 8,
  },

  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#c8d4b8',
  },

  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 0,
  },

  infoRow: {
    alignItems: 'center',
  },

  infoLabel: {
    fontSize: 6,
    color: '#888070',
    fontFamily: 'DMMono',
    letterSpacing: 0.12,
    textTransform: 'uppercase',
    marginBottom: 1,
  },

  infoValue: {
    fontSize: 11,
    color: '#2a2018',
    fontFamily: 'DMMono',
    fontWeight: '500',
  },

  // ── MINIMIZED ──
  minimizecard: {
    width: width * 0.09,
    height: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f0e8',
    borderRadius: 2,
    top: 250,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    transform: [{ rotate: '-2deg' }],
  },

  minimizeImage: {
    width: '40%',
    height: '80%',
  },

  minimizeTripName: {
    fontSize: 14,
    color: '#2a2018',
    fontFamily: 'DMMono',
  },

  minimizearrowButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 4,
    height: '100%',
    alignContent: 'center',
    alignItems: 'center',
  },

  // ── LIVE BADGE ──
  liveBadge: {
    position: 'absolute',
    top: 8, left: 8,
    backgroundColor: '#c97a6a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },

  liveText: {
    color: '#f5f0e8',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.1,
    fontFamily: 'DMMono',
  },
})