import { StyleSheet } from "react-native";
export const tripCardsStyle = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  tripCard: {
    width: '48%',          // 2 per row
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111',
  },

  tripImage: {
    width: '100%',
    height: 120,
  },

  tripTitle: {
    paddingVertical: 8,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
    tripCardMenu: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  sharedCardMenu: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  tripCardMenuText: {
    color: '#fff',
    fontSize: 14,
    letterSpacing: 1,
    lineHeight: 14,
  },
});
