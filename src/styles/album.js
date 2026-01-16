import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";          
const IMAGE_SIZE = (Dimensions.get('window').width - 32) / 3;

export const Albumstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 48,
    paddingHorizontal: 12,
    width:'100%'
  },
  filterBar: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#222',
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#fff',
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#000',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    padding: 0,           
    justifyContent: 'space-between',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 16,
    margin:2,
  },
});
