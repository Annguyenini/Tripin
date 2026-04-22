import { StyleSheet, Dimensions } from "react-native";
export const colors = {
  bg: '#fdf6ee',
  surface: '#f5ece0',
  text: '#2c2a25',
  textMuted: '#9a9080',
  textHint: '#b0a090',
  divider: '#e8ddd0',
  peach: '#f2c4a0',
  peachDark: '#7a4a2a',
  peachMid: '#e8a87c',
  sage: '#b8d4b8',
  sageDark: '#2a5a2a',
  sky: '#b8d4e8',
  skyDark: '#2a5a7a',
  lilac: '#d4b8e0',
  lilacDark: '#5a2a7a',
  rose: '#e8b8c4',
  roseDark: '#7a2a3a',
};
const { width } = Dimensions.get('window');

export const overlayCardStyle = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(44, 42, 37, 0.5)',
  },

  card: {
    width: width * 1,
    padding: 20,
    backgroundColor: colors.bg,
    borderRadius: 15,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },

  exitButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.peach,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  exitText: {
    color: colors.peachDark,
    fontFamily: 'DMMono-Regular',
    fontWeight: 'bold',
    fontSize: 18,
  },

  title: {
    fontFamily: 'PermanentMarker-Regular',
    fontSize: 28,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
});