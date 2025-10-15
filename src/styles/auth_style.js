import {  StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const authStyle = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  card: {
    width: width * 0.85,
    padding: 20,
    backgroundColor: '#fff', // card white
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontFamily: 'mainfont',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  submitButton: {
    backgroundColor: '#000000ff', // black submit
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff', // white text
    fontSize: 18,
    fontWeight: 'bold',
  },
  exitButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#eee', // light gray
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  exitText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
