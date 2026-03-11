import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW } from './tokens';

export const bottomSheetStyle = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    borderTopWidth: 1,
    borderColor: COLORS.borderStrong,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    ...SHADOW.hard,
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.borderStrong,
    alignSelf: 'center',
    marginBottom: 16,
  },

  title: {
    fontFamily: FONTS.display,
    fontSize: 24,
    color: COLORS.black,
    marginBottom: 12,
    textDecorationLine: 'underline',
  },

  body: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 22,
  },
});
