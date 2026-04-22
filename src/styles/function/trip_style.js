import { StyleSheet } from "react-native";
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
export const tripStyle = StyleSheet.create({
  imageFrame: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  placeholder: {
    color: colors.textMuted,
  },

  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },

  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.peachMid,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.peach,
  },

  secondaryButtonText: {
    color: colors.peachDark,
    fontFamily: 'DMMono-Regular',
    fontWeight: '600',
  },

  input: {
    width: '100%',
    height: 45,
    borderColor: colors.divider,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: 'DMMono-Regular',
  },

  submitButton: {
    backgroundColor: colors.peachMid,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  submitButtonText: {
    color: colors.peachDark,
    fontFamily: 'DMMono-Regular',
    fontSize: 18,
    fontWeight: 'bold',
  },
});