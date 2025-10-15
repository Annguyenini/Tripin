import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SecureStore from 'expo-secure-store'
import {Platform } from 'react-native'


import * as API from '../config/config'
// import { setSurfaceProps } from 'react-native/types_generated/Libraries/ReactNative/AppRegistryImpl';
import {UserDataService} from './userdata'
import {TokenService} from './token_service'
export class Auth{
    constructor(){
        this.user_data_service = new UserDataService()
        this.token_service = new TokenService()
    };
    async requestLogin(username,password){
        const respond = await fetch(API.LOGIN_API,{
            method: "POST", 
            headers:{"Content-Type":"application/json"}, 
            body: JSON.stringify({
            username:username,
            password:password 
        })});
        console.assert(respond.status===200,"Error at calling request Login!")
        const data = await respond.json();
        console.assert(data!= undefined,"Data at requestLogin is undefined")

        if(respond.status ===401) return respond.status;
       
        await this.token_service.deleteToken("access_token");
        await this.token_service.setToken("refresh_token", data.userdatas.refresh_token);
        await this.token_service.setToken("access_token", data.userdatas.access_token);

        this.user_data_service.setUserId(data.userdatas.user_id)
        this.user_data_service.setUserName(data.userdatas.user_name)
        this.user_data_service.setDisplayName(data.userdatas.display_name)
        return respond.status;
     } 
    
    async requestNewAccessToken(){
        const refresh_token = Platform.OS ==='web'? await AsyncStorage.getItem("refresh_token"): await SecureStore.getItemAsync("refresh_token")
        const respond = await fetch (API.REQUEST_NEW_ACCESS_TOKEN_API,{
            method :'POST',
            headers:{"Content-Type":"application/json",
                "Authorization":`Bearer ${refresh_token}`
            }
        })
        console.assert(respond.status===200,"Error calling requestNewAccessToken!")
        if (Platform.OS=='web'){
            this.token_service.deleteToken("access_token");
            await this.token_service.setToken("access_token",respond.token);
        }
        else{
            this.token_service.deleteToken("access_token")
            await this.token_service.setToken("access_token",respond.token);
        }
    }
    async authenticateToken(key){
        const access_token = this.token_service.getToken("access_token")
        const respond = await fetch(API.LOGIN_TOKEN_API,{
            method : "POST",
            headers:{"Content-Type":"application/json",
                "Authorization": `Bearer ${access_token}`
            } 
            
        });
        // console.log(access_token);
        console.assert(respond.status===200,"Error at calling token checker")
        const data = await respond.json();
        console.log(data)
        console.assert(data!= undefined,"Data at authenticateToken is undefined!")
        // console.log(data)
        if(respond.status===401){
            if (data.Message==="Token Invalid!"){
                this.token_service.deleteToken("access_token");
                this.token_service.deleteToken("refresh_token");
                return;
            }
            else if(data.Message ==="Token Expired!"){
                console.log("exp")
                this.token_service.deleteToken("access_token");
                await requestNewAccessToken();
                this.authenticateToken();
            }
            return ({"message":res.Message,"status": 401})
        }
        
        this.user_data_service.setUserId(data.userdatas.user_id)
        this.user_data_service.setUserName(data.userdatas.user_name)
        this.user_data_service.setDisplayName(data.userdatas.display_name)
        return({"message":data.Message,"status": 200})
        
    }
    async requestSignup(email,displayName,username,password){
        const respond = await fetch(API.SIGN_UP_API,{
            method: "POST", 
            headers:{"Content-Type":"application/json"}, 
            body: JSON.stringify({
            email:email,
            displayName:displayName,
            username:username,
            password:password 
        })});
        console.assert(respond.status===200,"Error At request Sign Up back end!")
        const data = await respond.json();
        console.log(data!=undefined,"Data at request signup is undefined!")
        return {"status":respond.status,"message":respond.message};
    }   
    }