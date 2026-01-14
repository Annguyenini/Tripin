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
});
