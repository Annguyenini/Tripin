import { StyleSheet } from "react-native";
export const curent_trip_styles = StyleSheet.create({
 container: {
    flexDirection: 'row',
    padding: 15, // a little smaller padding
    alignItems: 'center',
    backgroundColor: "white",
  },
  leftSide: {
    position: 'relative', // parent must be relative for absolute children
    flex: 1,
  },
  image: {
    width: '80%', // smaller width
    height: 10,  // shorter height
    borderRadius: 6,
  },
  overlay: {
    position: 'absolute',
    bottom: 5, // lower overlay
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    zIndex: 10, // ensure overlay is on top
  },
  overlayLeft: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 11,
  },
  overlayRight: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 11,
  },
  overlayText: {
    color: 'white',
    fontSize: 11, // slightly smaller
    fontWeight: 'bold',
  },
  rightSide: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: '#eee',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityText: {
    fontSize: 12, // smaller
    fontWeight: 'bold',
  },
});