import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity,StyleSheet, Text, View, Image, ImageBackground, TextInput, Dimensions } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';

const backgroundImage = require('./assets/main_background.png');
const logo = require('./assets/main_logo.png');

export default function App() {
   const [loaded] = useFonts({
        mainfont: require('./assets/fonts/mainfont.otf'),

   });
   if (!loaded) return null;
  
  return (
    <SafeAreaProvider>
      <ScrollView 
      
      contentContainerStyle={styles.scrollContent} 
      showsVerticalScrollIndicator={false} // optional, cleaner look
    >
      

      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <Image source={logo} style={styles.logo} />
      </ImageBackground>
    <Login />
    </ScrollView>
    </SafeAreaProvider>
  );
}

export const Login = () => {
  return (
    <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>      
       <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Sigup</Text>
    </TouchableOpacity>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
   scrollContent: {
    flexGrow: 1,           // lets content grow and scroll
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
    width: '80%',          // 50% of screen width
    height: undefined,
    aspectRatio: 1,         // keeps logo square
    resizeMode: 'contain',
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  loginContainer: {
    width: '80%',           // 80% of screen width
    alignItems: 'center',
    
  },
    buttonContainer: {
    flexDirection: 'row',         // arrange buttons in a row
    justifyContent: 'space-between', // space between buttons
    width: '60%',                  // adjust overall row width
    marginVertical: 20,
    color:"black",
  },
  textInput: {
    width: '100%',           // full width of container
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
   button: {
    backgroundColor: '#ffffff67', // button background
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily:'mainfont',
    color: '#000000ff', // text color
    fontSize: 30,
    textAlign: 'center',
  },
});
