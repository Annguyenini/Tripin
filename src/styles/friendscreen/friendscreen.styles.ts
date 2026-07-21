import { StyleSheet } from 'react-native';

// TRIPPING brand palette — keep in sync with help_bar_map.js / design system doc
const PRIMARY = '#FF7E47';
const PRIMARY_DARK = '#C85A28';
const SECONDARY_DARK = '#1E5C76';
const PAPER = '#F4EBD0';
const CARD = '#FFFDF8';
const LINE = '#E6DCC1';
const INK = '#333333';
const INK_SOFT = '#6B6B63';
const ERROR = '#B3261E';

export const friendsScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAPER,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  title: {
    fontSize: 19,
    fontFamily: 'Quicksand-Bold',
    fontWeight: '700',
    color: INK,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: LINE,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: PRIMARY_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: CARD,
    fontSize: 10,
    fontFamily: 'BeVietnamPro-Medium',
    fontWeight: '700',
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
  },
  error: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: 'BeVietnamPro-Medium',
    fontWeight: '500',
    color: ERROR,
  },
  colors: {
    primary: PRIMARY,
    primaryDark: PRIMARY_DARK,
    secondaryDark: SECONDARY_DARK,
    paper: PAPER,
    card: CARD,
    line: LINE,
    ink: INK,
    inkSoft: INK_SOFT,
    error: ERROR,
  },
});
