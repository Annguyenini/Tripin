import { StyleSheet } from "react-native";

export const trackingModeManagerStyle = StyleSheet.create({

  container: {
    position: 'absolute',
    top: 200,
    left: 5,
  },

  zoomContainer: {
    backgroundColor: '#1a1917',
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 5,
  },

  button: {
    backgroundColor: '#242220',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 3,
  },

  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f0f0ec',
    fontFamily: 'DMMono',
  },

  icon: {
    tintColor: '#f0f0ec',
    fontSize: 10,
    color:'#f0f0ec'
  },

  controlbutton: {
    backgroundColor: '#f0f0ec',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 4,
  },

  buttonText: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontFamily: 'DMMono',
    fontSize: 12,
    letterSpacing: 0.08,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  notifyCover: {
    backgroundColor: '#242220',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  submitButton:{
    alignSelf: 'center',
    backgroundColor: '#f0f0ec',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 4,
  },
  submitText:{
    fontFamily: 'DMMono',
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.08,
  }
})