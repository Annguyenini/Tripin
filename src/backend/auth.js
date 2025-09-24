import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SecureStore from 'expo-secure-store'
import {Platform } from 'react-native'


import * as API from '../config/config'
// import { setSurfaceProps } from 'react-native/types_generated/Libraries/ReactNative/AppRegistryImpl';


export class Auth{
    constructor(){};
    async requestLogin(username,password){
        const request = await fetch(API.LOGIN_API,{
            method: "POST", 
            headers:{"Content-Type":"application/json"}, 
            body: JSON.stringify({
            username:username,
            password:password 
        })});
        const respond = await request.json();
        console.log(respond)
        if (Platform.OS === 'web') {
            await AsyncStorage.removeItem("access_token");
            await AsyncStorage.setItem("refresh_token", respond.userdatas.refresh_token);
            await AsyncStorage.setItem("access_token", respond.userdatas.access_token);

        }
        else{
            SecureStore.deleteItemAsync("access_token");
            SecureStore.setItemAsync("refresh_token",respond.userdatas.refresh_token)
            SecureStore.setItemAsync("access_token",respond.userdatas.access_token)
        }
        return request.status;
     } 
    async forceDeleteToken(key){
        if(Platform.OS==='web'){
            await AsyncStorage.deleteItem(key)
        }
        else{
            await SecureStore.deleteItemAsync(key)
        }
    }
    async requestNewAccessToken(){
        const refresh_token = Platform.OS ==='web'? await AsyncStorage.getItem("refresh_token"): await SecureStore.getItemAsync("refresh_token")
        const res = await fetch (API.REQUEST_NEW_ACCESS_TOKEN_API,{
            method :'POST',
            headers:{"Content-Type":"application/json",
                "Authorization":`Bearer ${refresh_token}`
            }
        })
        if (Platform.OS=='web'){
            this.forceDeleteToken("access_token");
            await AsyncStorage.setItem("access_token",res.token);
        }
        else{
            this.forceDeleteToken("access_token")
            await SecureStore.setItemAsync("access_token",res.token);
        }
    }
    async authenticateToken(key){
        const access_token = Platform.OS==='web'? await AsyncStorage.getItem(key) :await SecureStore.getItemAsync(key);
        const respond = await fetch(API.LOGIN_TOKEN_API,{
            method : "POST",
            headers:{"Content-Type":"application/json",
                "Authorization": `Bearer ${access_token}`
            } 
            
        });
        const message = await respond.json();
        if(message.status==401){
            if (message.Message==="Token Invalid!"){
                forceDeleteToken("access_token");
                forceDeleteToken("refresh_token");
                return;
            }
            else if(message.Message ==="Token Expired!"){
                forceDeleteToken("access_token");
                requestNewAccessToken();
                return;
            }
            return ({"message":message.Message,"status": 401})
        }
        return({"message":message.Message,"status": 200,"userdatas":message.userdatas})
        
    }
    async requestSignup(email,displayName,username,password){
        const request = await fetch(API.SIGN_UP_API,{
            method: "POST", 
            headers:{"Content-Type":"application/json"}, 
            body: JSON.stringify({
            email:email,
            displayName:displayName,
            username:username,
            password:password 
        })});
        const respond = await request.json();
        console.log(respond)
        return {"status":request.status,"message":request.message};
    }   
    }