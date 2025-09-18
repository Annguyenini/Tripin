
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput,Alert, StyleSheet, Dimensions } from 'react-native';
import {styles} from './style.js'
import {authStyle} from './style.js'

const { width } = Dimensions.get('window');
export  const AuthScreen= () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [password,setPassWord] = useState ('');
  const [username, setUserName] = useState ('');
  const [alert, setAlertType] = useState('');
  const [showAlert, setShowAleart] = useState(false);
  const submitRequest = ({action})=>{
    setShowAleart(false);
    if(username.trim()===''||password.trim()===''){
         Alert.alert('Error', 'Username and password cannot be empty!');
         setAlertType("Username and password cannot be empty!");
        setShowAleart(true);

      return;
  }
}
  return (
    <>
      {/* Bottom buttons */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={() => setShowLogin(true)}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setShowSignup(true)}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>

      {/* Login Overlay */}
      {showLogin && (
        <OverlayCard title="LOGIN" onClose={() => setShowLogin(false)}>
          <TextInput style={authStyle.input} placeholder="UserName" value ={username} onChangeText={text=> setUserName(text)}/>
          <TextInput style={authStyle.input} placeholder="Password" value ={password} onChangeText={text=> setPassWord(text)}secureTextEntry />
          <TouchableOpacity style={authStyle.submitButton} onPress ={()=>submitRequest('Login')}> 
             <Text style={authStyle.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          {showAlert&&(<Text style={{textAlign:'center',marginTop: 10, color:'#FF0000'}}>{alert}</Text>)}
          <TouchableOpacity onPress={() => { setShowLogin(false); setShowSignup(true); }}>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>Forgot Passwords?</Text>
          </TouchableOpacity>
        </OverlayCard>
      )}


      {/* Signup Overlay */}
      {showSignup && (
        <OverlayCard title="SIGNUP" onClose={() => setShowSignup(false)}>
          <TextInput style={authStyle.input} placeholder="UserName" value ={username} onChangeText={text=> setUserName(text)}/>
          <TextInput style={authStyle.input} placeholder="Password" value ={password} onChangeText={text=> setPassWord(text)}secureTextEntry />
          <TouchableOpacity style={authStyle.submitButton} onPress ={()=>submitRequest('Signup')}> 
             <Text style={authStyle.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          {showAlert&&(<Text style={{textAlign:'center',marginTop: 10, color:'#FF0000'}}>{alert}</Text>)}
        </OverlayCard>
      )}

      
    </>
  );

};

const OverlayCard = ({ title, children, onClose }) => (
  <View style={authStyle.overlayContainer}>
    <View style={authStyle.card}>
      <TouchableOpacity style={authStyle.exitButton} onPress={onClose}>
        <Text style={authStyle.exitText}>X</Text>
      </TouchableOpacity>
      <Text style={authStyle.title}>{title}</Text>
      {children}
    </View>
  </View>
);