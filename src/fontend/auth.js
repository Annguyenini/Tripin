
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput,Alert, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {styles} from './style.js'
import {authStyle} from './style.js'
import { Auth } from '../backend/auth.js';  
const { width } = Dimensions.get('window');

export const AuthScreen= ({navigation} ) => {
  
  const auth = new Auth()
  const loginWithAccessToken = async () =>{
    const res_access = await auth.authenticateToken("access_key");
    if (res.message === "Token Expired!"){
      if (auth.authenticateToken("refresh_key").status === 401){
        auth.forceDeleteKeys();
        return;
      }
      else if(auth.authenticateToken("refresh_key").status === 200){
        auth.requestNewAccessToken();
        navigation.navigate('Main');
        return;
      }
      return;
    }
    else if(res.message === "Token Invalid!"){
      auth.forceDeleteKeys();
      return;
    }
  }
  loginWithAccessToken();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email,setEmail] = useState('');
  const [password,setPassWord] = useState ('');
  const [confirmPassword,setConfirmPassWord] =useState('');
  const [username, setUserName] = useState ('');
  const [displayName, setDisplayName] = useState('');
  const [alert, setAlertType] = useState('');
  const [showAlert, setShowAleart] = useState(false);
  const [alertColor,setAlertColor] =useState('#FF0000')
  const [passwordMissingList, setPassWordMissingList] = useState([]);
  const [showPasswordMissingList,setShowPML] = useState(false);
  const specialRegex = /[^A-Za-z0-9]/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const signupRules = ()=>{
    let res=[];
    if(!emailRegex.test(email)) res.push('Invalid Email');
    if(!/\d/.test(password)) res.push('Missing Number!');
    if(password.length<8) res.push('Password have to be longer than 8!');
    if(!specialRegex.test(password)) res.push("Missing special character!");
    if(!/[A-Z]/.test(password)) res.push('Missing upper letter!');
    if(confirmPassword!=password) res.push("Confirm password doesnt match!")
      if(res.length>0){
        setPassWordMissingList (res);
        setShowPML(true);
        return;
      }
  }
  const submitRequest = async ({action})=>{
    
    setShowAleart(false);

    if(username.trim()===''||password.trim()===''){
         Alert.alert('Error', 'Please Fill out all the requirement!');
         setAlertType("Please Fill out all the requirement!");
        setShowAleart(true);
      
      return;
    }

    if(action ==='Login'){
      const respond =await auth.requestLogin(username,password);
      if(respond===200){
        setAlertType('Account not found!')
        setShowAleart(true);
      }
    }
    else if(action ==="Signup"){
      setShowPML(false);
      if(displayName.trim()===''||confirmPassword===''||email===''){
         Alert.alert('Error', 'Please Fill out all the requirement!');
         setAlertType("Please Fill out all the requirement!");
        setShowAleart(true);
      return;
      };
      signupRules();
      const response = await auth.requestSignup(email,displayName,username,password);
      if(response.status===200){
        setAlertType(response.message);
        setShowAleart(true);
        return;
      }
      setShowSignup(false);
      setShowLogin(true);
      
    }
}
  return (
    <>
      {/* Bottom buttons */}
      
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={() => {setShowLogin(true);
          setPassWord('');
          setUserName('');
        }}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {setShowSignup(true);
          setPassWord('');
          setUserName('');
        }}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>

      {/* Login Overlay */}
      {showLogin && (
        <OverlayCard title="LOGIN" onClose={() => setShowLogin(false)}>
          <TextInput style={authStyle.input} placeholder="UserName" value ={username} onChangeText={text=> setUserName(text)}/>
          <TextInput style={authStyle.input} placeholder="Password" value ={password} onChangeText={text=> setPassWord(text)}secureTextEntry />
          <TouchableOpacity style={authStyle.submitButton} onPress ={()=>submitRequest({action:'Login'})}> 
             <Text style={authStyle.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          {showAlert&&(<Text style={{textAlign:'center',marginTop: 10, color:alertColor}}>{alert}</Text>)}
          <TouchableOpacity onPress={() => { setShowLogin(false); setShowSignup(true),setShowAleart(false); }}>
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
          <TextInput style={authStyle.input} placeholder="Email" value ={email} onChangeText={text=> setEmail(text)}/>

          <TextInput style={authStyle.input} placeholder="DisplayName" value ={displayName} onChangeText={text=> setDisplayName(text)}/>

          <TextInput style={authStyle.input} placeholder="UserName" value ={username} onChangeText={text=> setUserName(text)}/>
          <TextInput style={authStyle.input} placeholder="Password" value ={password} onChangeText={text=> setPassWord(text)}secureTextEntry />
          <TextInput style={authStyle.input} placeholder="Confirm Password" value ={confirmPassword} onChangeText={text=> setConfirmPassWord(text)}secureTextEntry />

          <TouchableOpacity style={authStyle.submitButton} onPress ={()=>submitRequest({action:'Signup'})}> 
             <Text style={authStyle.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setShowLogin(true); setShowSignup(false),setShowAleart(false); }}>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>Have an account?</Text>
          </TouchableOpacity>
          {showPasswordMissingList&&(
            <View>
              {passwordMissingList.map((item, index)=>(
                <Text key = {index} style={{ textAlign:'center',marginTop: 10, color:'#FF0000'}}>
                  {item}
                </Text>
              ))}
            </View>
          )}
          {showAlert&&(<Text style={{textAlign:'center',marginTop: 10, color:alertColor}}>{alert}</Text>)}
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