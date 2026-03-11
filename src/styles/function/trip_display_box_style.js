import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');

export const currentTripDisplayBoxStyle = StyleSheet.create({

  wrapper: {
    position: 'absolute',
    right: 140,
    top: 250,
  },

  card: {
    width: width * 0.65,
    height: height * 0.15,
    backgroundColor: '#1a1917',
    borderRadius: 20,
    top: 250,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 8,
  },

  // ── TOP ──
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  arrowButton: {
    backgroundColor: '#2a2826',
    borderRadius: 8,
    width: 30, height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  arrowText: {
    fontSize: 16,
    color: '#f0f0ec',
  },

  tripName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'PermanentMarker',
    color: '#f0f0ec',
    letterSpacing: 0.04,
  },

  closeButton: {
    backgroundColor: '#2a2826',
    borderRadius: 8,
    width: 30, height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  closeText: {
    color: '#888',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // ── BOTTOM ──
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  imageContainer: {
    width: '40%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
    backgroundColor: '#242220',
  },

  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 15,
    gap: 6,
  },

  infoRow: {
    marginVertical: 2,
  },

  infoLabel: {
    fontSize: 9,
    color: '#5a5550',
    fontFamily: 'DMMono',
    letterSpacing: 0.12,
    textTransform: 'uppercase',
    marginBottom: 1,
  },

  infoValue: {
    fontSize: 13,
    color: '#f0f0ec',
    fontFamily: 'DMMono',
    fontWeight: '500',
  },

  // ── MINIMIZED ──
  minimizecard: {
    width: width * 0.09,
    height: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1917',
    borderRadius: 12,
    top: 250,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 5,
  },

  minimizeImage: {
    width: '40%',
    height: '80%',
  },

  minimizeTripName: {
    fontSize: 14,
    color: '#f0f0ec',
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
    backgroundColor: '#c03030',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },

  liveText: {
    color: '#f0f0ec',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.1,
    fontFamily: 'DMMono',
  },
})