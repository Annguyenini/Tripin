
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput,Alert, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {styles} from '../styles/style.js'
import {authStyle} from '../styles/auth_style.js'
import { Auth } from '../backend/auth.js';  
import { useNavigation  } from '@react-navigation/native';
import { navigate } from './navigationService.js';

const { width } = Dimensions.get('window');

export const loginWithAccessToken = async () => {
  const auth = new Auth();
  const respond =await auth.loginWithAccessToken()
  if ( respond=== true){
    // only navigate if navigation is ready
    navigate('Main');
    return true;
  }
};
export const AuthScreen= ( ) => {
  const navigation = useNavigation();
  
  const auth = new Auth()
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [email,setEmail] = useState('');
  const [password,setPassWord] = useState ('');
  const [confirmPassword,setConfirmPassWord] =useState('');
  const [username, setUserName] = useState ('');
  const [displayName, setDisplayName] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [alert, setAlertType] = useState('');
  const [showAlert, setShowAleart] = useState(false);
  const [alertColor,setAlertColor] =useState('#FF0000')
  const [passwordMissingList, setPassWordMissingList] = useState([]);
  const [showPasswordMissingList,setShowPML] = useState(false);
  const specialRegex = /[^A-Za-z0-9]/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
      if(respond===401){
        setAlertType('Account not found!')
        setShowAleart(true);
        return;
      }
      navigation.navigate('Main');
    }


    else if(action ==="Signup"){
      setShowPML(false);
      if(displayName.trim()===''||confirmPassword===''||email===''){
         Alert.alert('Error', 'Please Fill out all the requirement!');
         setAlertType("Please Fill out all the requirement!");
        setShowAleart(true);
      return;
      };
    let res=[];
    if(!emailRegex.test(email)) res.push('Invalid Email');
    if(!/\d/.test(password)) res.push('Missing Number!');
    if(password.length<8) res.push('Password have to be longer than 8!');
    if(!specialRegex.test(password)) res.push("Missing special character!");
    if(specialRegex.test(username)) res.push("Username should not contain special characters!")
    if(!/[A-Z]/.test(password)) res.push('Missing upper letter!');
    if(confirmPassword!=password) res.push("Confirm password doesnt match!")
    if(res.length>0){
      setPassWordMissingList (res);
      setShowPML(true);
      return;
    }
    const response = await auth.requestSignup(email,displayName,username,password);
    if(response.status===401){
      setAlertType(response.message);
      setShowAleart(true);
      return;
    }
    setShowSignup(false);
    setShowVerification(true);
      
    }


    else if(action === "Verification"){
    if(verifyCode.length!=6){
      setAlertType("Please enter 6 digits code")
      showAlert(true)
      return 
    }
    const respond = await auth.requestVerifycation(email,verifyCode);
    if(respond.status!=200){
      setAlertType(respond.message)
      setShowAleart(true)
      return;
    }
    setShowVerification(false)
    setShowLogin(true)
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

      {showVerification && (
        <OverlayCard title="Confirm Code" onClose={() => setShowVerification(false)}>
          <TextInput style={authStyle.input} placeholder="6 digits code" value ={verifyCode} onChangeText={text=> setVerifyCode(text)}/>

          <TouchableOpacity style={authStyle.submitButton} onPress ={()=>submitRequest({action:'Verification'})}> 
             <Text style={authStyle.submitButtonText}>Verify</Text>
          </TouchableOpacity>
          
          
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