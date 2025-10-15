import {  StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  buttonWrapper: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    position: 'absolute',
    bottom: 140,
  },
  button: {
    backgroundColor: '#ffffff67', // old semi-transparent white
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: 'mainfont',
    color: '#000000ff', // black text
    fontSize: 30,
    textAlign: 'center',
  },
});







