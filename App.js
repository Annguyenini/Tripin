import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity,StyleSheet, Text, View, Image, ImageBackground, TextInput, Dimensions } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
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
  const [showLoginScreen, setLoginScreen] = useState(false);
  const [showSignupScreen, setSignUPScreen] = useState(false);

  const loginWindow =()=>{setLoginScreen(true)};
  const signupWindow =()=>{setSignUPScreen(true)};
  return (
    <View style ={styles.buttonWrapper}>
    <View style={styles.buttonContainer}>
      
    <TouchableOpacity style={styles.button} onPress={loginWindow}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>      
       <TouchableOpacity style={styles.button} onPress={signupWindow}>
      <Text style={styles.buttonText}>Sigup</Text>
    </TouchableOpacity>
    </View>
    <View style ={styles.buttonWrapper}>
    {showLoginScreen && ( 
      <View style ={authStyle.container}>
        <View style = {authStyle.card} >
          <TouchableOpacity style={authStyle.exitButton} onPress = {()=>setLoginScreen(false)} ><Text style={authStyle.exitText}>X</Text></TouchableOpacity>
          <Text style= {authStyle.title}>LOGIN</Text>
          <TextInput  style={authStyle.input} placeholder='UserName'  />
          <TextInput style={authStyle.input} placeholder='Password' secureTextEntry />
          <TouchableOpacity onPress={()=>{setLoginScreen(false); 
            setSignUPScreen(true);
            }}>
              <Text>Create Account</Text></TouchableOpacity>
          <TouchableOpacity style={authStyle.button}><Text style ={authStyle.buttonText}>Submit</Text></TouchableOpacity>
        </View>
        </View>
        
      )}
          {showSignupScreen && ( 
      <View style ={authStyle.container}>
        <View style = {authStyle.card} >
          <TouchableOpacity style={authStyle.exitButton} onPress = {()=>setSignUPScreen(false)} ><Text style={authStyle.exitText}>X</Text></TouchableOpacity>
          <Text style= {authStyle.title}>SIGNUP</Text>
          <TextInput  style={authStyle.input} placeholder='UserName'  />
          <TextInput style={authStyle.input} placeholder='Password' secureTextEntry />
          <TouchableOpacity style={authStyle.button}><Text style ={authStyle.buttonText}>Submit</Text></TouchableOpacity>
        </View>
        </View>
        
      )}
      </View>
      </View>
      

    
    
  );
};

const { width, height } = Dimensions.get('window');
const authStyle = StyleSheet.create({
     container: {
    position: 'absolute', 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    
    width: width * 0.85,
    padding: 20,
    // backgroundColor: '#fff',
    borderRadius: 15,
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,

  },
  title: {
    fontFamily:'mainfont',

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
  button: {
    backgroundColor: '#000000ff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exitButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: '#eee',
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
const styles = StyleSheet.create({
   scrollContent: {
    flexGrow: 1,           // lets content grow and scroll
    justifyContent: 'center',
    alignItems: 'center',
  },
   buttonWrapper: {
    position: 'absolute', 

    width: '100%',
    bottom: 140, 
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
    // backgroundColor: '#ffffff67', // button background
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
