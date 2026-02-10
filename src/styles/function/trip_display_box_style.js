// currentTripDisplayBoxStyle.js
import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');

export const currentTripDisplayBoxStyle = StyleSheet.create({
  wrapper: {
    position: "absolute",
    right:140 ,      // 👈 Changed from right to left
    top: 250,    // 👈 Changed from top to bottom
  },
  
  card: {
    width: width * 0.65,
    height: height * 0.15,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    top: 250,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  
  // Top section - Arrow, Trip Name, Close button
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  
  arrowButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  arrowText: {
    fontSize: 18,
    color: 'white',
  },
  
  tripName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  closeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  // Bottom section - Image and Info
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  // Image on the left
  imageContainer: {
    width: '40%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 15,
  },
  
  // Info on the right (distance top, duration bottom)
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  
  infoRow: {
    marginVertical: 4,
  },
  
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  
  infoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  
  // Minimize card
  minimizecard: {
    width: width * 0.09,
    height: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    top: 250,
  },
  
  minimizeImage: {
    width: '40%',
    height: '80%',
  },
  
  minimizeTripName: {
    fontSize: 14,
    color: '#333',
  },
  
  minimizearrowButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 4,
    height: '100%',
    alignContent: 'center',
    alignItems: 'center',
  },
  
  liveBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'red',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex: 10,
  },
  
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});