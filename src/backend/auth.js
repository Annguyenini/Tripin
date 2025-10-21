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
        console.log(data)
        console.assert(data!= undefined,"Data at requestLogin is undefined")

        if(respond.status ===401) return respond.status;
       
        await this.token_service.deleteToken("access_token");
        await this.token_service.deleteToken("refresh_token");
        await this.token_service.setToken("refresh_token", data.userdatas.refresh_token);
        await this.token_service.setToken("access_token", data.userdatas.access_token);
        console.log("token from login ")
        console.log(data.userdatas.refresh_token)
        console.log(data.userdatas.access_token)

        this.user_data_service.setUserId(data.userdatas.user_id)
        this.user_data_service.setUserName(data.userdatas.user_name)
        this.user_data_service.setDisplayName(data.userdatas.display_name)
        return respond.status;
     } 
    
    async requestNewAccessToken(){
        const refresh_token = await this.token_service.getToken("refresh_token")
        console.log(refresh_token)
        const respond = await fetch (API.REQUEST_NEW_ACCESS_TOKEN_API,{
            method :'POST',
            headers:{"Content-Type":"application/json",
                "Authorization":`Bearer ${refresh_token}`
            }
        })
        console.log(respond)
        console.assert(respond.status===200,"Error calling requestNewAccessToken!")
        const data  = await respond.json()
        console.assert(data!= undefined,"Data at request new access token is undefined")
        if (Platform.OS=='web'){
            this.token_service.deleteToken("access_token");
            await this.token_service.setToken("access_token",data.token);
        }
        else{
            this.token_service.deleteToken("access_token")
            await this.token_service.setToken("access_token",data.token);
        }
    }
    async authenticateToken(type){
        console.assert(type != "access_token"&& type!="refresh_token","Wrong token type")
        const token = await this.token_service.getToken(type)
        console.log(type,token)
        console.assert(token == null,"token is null")
        const respond = await fetch(API.LOGIN_TOKEN_API,{
            method : "POST",
            headers:{"Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            } 
            
        });
        // console.log(access_token);
        console.assert(respond.status===200,"Error at calling token checker")
        const data = await respond.json();
        console.assert(data!= undefined,"Data at authenticateToken is undefined!")
        // console.log(data)
        if(respond.status===401){
            return ({"message":data.Message,"status": 401,"data":data})
        }
        
        return({"message":data.Message,"status": 200,"data":data})
        
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
        console.assert(data!=undefined,"Data at request signup is undefined!")
        return {"status":respond.status,"message":respond.message};
    }   
    async requestVerifycation (email, code){
        // console.log("called")
        const respond = await fetch(API.REQUEST_VERIFICATION_API,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                email: email,
                code : code,
            })
        })
        const data = respond.json()
        return {"status":respond.status,"message":data.message}
    }
    async requestLogout(){
        await this.token_service.deleteToken("access_token")
        await this.token_service.deleteToken("refresh_token")
        this.user_data_service.resetUserInfo();
    }
    async loginWithAccessToken(){
        console.log("tokens")
        // await this.token_service.deleteToken("access_token");
        // await this.token_service.deleteToken("refresh_token");
        console.log(await this.token_service.getToken("access_token"))
        console.log(await this.token_service.getToken("refresh_token"))

      const res = await this.authenticateToken("access_token");

      if (res.message === "Token Expired!") {
        console.log("called")
        const data = await this.authenticateToken("refresh_token");
    
        if (data.status === 401) {
            await this.token_service.deleteToken("access_token");
            await this.token_service.deleteToken("refresh_token");
          return false;
        } 
        else if (data.status === 200) {
            await this.token_service.deleteToken("access_token");
            await this.requestNewAccessToken();
            console.log("pass this shit")
            return await this.loginWithAccessToken();
        }
      }
    
      if (res.message === "Token Invalid!") {
            await this.token_service.deleteToken("access_token");
            await this.token_service.deleteToken("refresh_token");        
            return false;
      }
        if (!this.user_data_service) {
            console.error("UserDataService is undefined!");
            return false;
        }
        console.log("Full data:", res);
        console.log("User datas:", res.data.userdatas);
        console.log("User ID:", res.data.userdatas?.user_id);
        console.log("here")
        this.user_data_service.setUserId(res.data.userdatas.user_id)
        this.user_data_service.setUserName(res.data.userdatas.user_name)
        this.user_data_service.setDisplayName(res.data.userdatas.display_name)
        console.log("true")
      return true;
    };
    }
