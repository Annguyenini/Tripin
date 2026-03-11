import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');

export const currentTripBoxStyle = StyleSheet.create({

  wrapper: {
    position: 'absolute',
    right: 0,
    top: '25%',
  },

  card: {
    width: width * 0.3,
    height: height * 0.18,
    alignItems: 'center',
    backgroundColor: '#1a1917',
    borderRadius: 16,
    top: 450,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 6,
  },

  minimizedCard: {
    width: width * 0.5,
    height: height * 0.1,
    top: 530,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1a1917',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 6,
    paddingHorizontal: 10,
  },

  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: '#1a1917',
  },

  image: {
    width: '90%',
    top: 10,
    height: '80%',
    paddingBottom: 1,
    borderRadius: 12,
    backgroundColor: '#242220',
  },

  minimizeImage: {
    width: '40%',
    height: '80%',
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: '#242220',
  },

  liveBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#c03030',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  liveText: {
    color: '#f0f0ec',
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'DMMono',
    letterSpacing: 0.1,
  },

  arrowButton: {
    position: 'absolute',
    right: 8,
    top: 50,
    backgroundColor: '#242220',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 3,
  },

  tripName: {
    marginTop: 8,
    fontFamily: 'PermanentMarker',
    fontSize: 13,
    color: '#f0f0ec',
    letterSpacing: 0.04,
  },

  minimizeTripName: {
    fontFamily: 'PermanentMarker',
    fontSize: 13,
    color: '#f0f0ec',
    letterSpacing: 0.04,
  },
})