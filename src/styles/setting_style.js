import {  StyleSheet, Dimensions } from 'react-native';
export const settingStyle = StyleSheet.create({
  topBar: {
    width: '100%',              // full width
    flexDirection: 'row',       // horizontal layout
    alignItems: 'center',       // vertical center
    justifyContent: 'flex-start', // items stick to left
    paddingHorizontal: 15,      // space from left/right
    paddingVertical: 10,        // top/bottom padding inside bar
    marginTop: 50,              // drop down a bit from top
    borderBottomWidth: 1,       // optional separator
  },
  buttonContainer: {
    // optional: can add extra spacing for button here if needed
    backgroundColor: '#ffffffff',    // bar color
    right:170,
    width: 40,
    height: 40,
    borderRadius: 40, // Half of width/height
    justifyContent: 'center',
    alignItems: 'center',       // vertical center


  },
  closeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',              // visible X
  },

});