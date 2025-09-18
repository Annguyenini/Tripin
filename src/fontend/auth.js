
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput,Alert, StyleSheet, Dimensions } from 'react-native';
import {styles} from './style.js'
import {authStyle} from './style.js'

const { width } = Dimensions.get('window');
export  const AuthScreen= () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email,setEmail] = useState('');
  const [password,setPassWord] = useState ('');
  const [confirmPassword,setConfirmPassWord] =useState('');
  const [username, setUserName] = useState ('');
  const [displayName, setDisplayName] = useState('');
  const [alert, setAlertType] = useState('');
  const [showAlert, setShowAleart] = useState(false);
  const [passwordMissingList, setPassWordMissingList] = useState([]);
  const [showPasswordMissingList,setShowPML] = useState(false);
  
  const submitRequest = ({action})=>{
    setShowAleart(false);
    if(action ==='Login'){
      if(username.trim()===''||password.trim()===''){
         Alert.alert('Error', 'Please Fill out all the requirement!');
         setAlertType("Please Fill out all the requirement!");
        setShowAleart(true);
      return;
    }
    }
    else if(action ==="Signup"){
      setShowPML(false);
      let res=[];
      const specialCha = /[^A-Za-z0-9]/;
      const emailCha = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if(username.trim()===''||password.trim()===''||displayName.trim()===''||confirmPassword===''||email===''){
         Alert.alert('Error', 'Please Fill out all the requirement!');
         setAlertType("Please Fill out all the requirement!");
        setShowAleart(true);
      return;
      };
      if(!emailCha.test(email)){
        res.push('Invalid Email');
      }
      if(!/\d/.test(password)){
        res.push('Missing Number!');
      }
      if(password.length<8){
        res.push('Password have to be longer than 8!');
      };
      if(!specialCha.test(password)){
        res.push("Missing special character!");
      };
      if(!/[A-Z]/.test(password)){
        res.push('Missing upper letter!');
      };
      if(confirmPassword!=password){
        res.push("Confirm password doesnt match!")
      }
      if(res.length>0){
        setPassWordMissingList (res);
        setShowPML(true);
        return;
      }
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
          <TextInput style={authStyle.input} placeholder="Email" value ={email} onChangeText={text=> setEmail(text)}/>

          <TextInput style={authStyle.input} placeholder="DisplayName" value ={displayName} onChangeText={text=> setDisplayName(text)}/>

          <TextInput style={authStyle.input} placeholder="UserName" value ={username} onChangeText={text=> setUserName(text)}/>
          <TextInput style={authStyle.input} placeholder="Password" value ={password} onChangeText={text=> setPassWord(text)}secureTextEntry />
          <TextInput style={authStyle.input} placeholder="Confirm Password" value ={confirmPassword} onChangeText={text=> setConfirmPassWord(text)}secureTextEntry />

          <TouchableOpacity style={authStyle.submitButton} onPress ={()=>submitRequest({action:'Signup'})}> 
             <Text style={authStyle.submitButtonText}>Submit</Text>
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