import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SecureStore from 'expo-secure-store'
import {Platform } from 'react-native'
import * as API from '../../config/config_api'
// import { setSurfaceProps } from 'react-native/types_generated/Libraries/ReactNative/AppRegistryImpl';
import UserDataService from '../storage/user'
import TokenService from './token_service'

class Auth{

    async requestLogin(username,password){
        const respond = await fetch(API.LOGIN_API,{
            method: "POST", 
            headers:{"Content-Type":"application/json"}, 
            body: JSON.stringify({
            username:username,
            password:password 
        })});

        return ({'status':respond.status,'data':await respond.json()})
     } 
    
    async requestNewAccessToken(){
        const refresh_token = await TokenService.getToken("refresh_token")
        const respond = await fetch (API.REQUEST_NEW_ACCESS_TOKEN_API,{
            method :'POST',
            headers:{"Content-Type":"application/json",
                "Authorization":`Bearer ${refresh_token}`
            }
        })
        console.assert(respond.status===200,"Error calling requestNewAccessToken!")
        const data  = await respond.json()
        console.assert(data!= undefined,"Data at request new access token is undefined")
        if (Platform.OS=='web'){
            TokenService.deleteToken("access_token");
            await TokenService.setToken("access_token",data.token);
        }
        else{
            TokenService.deleteToken("access_token")
            await TokenService.setToken("access_token",data.token);
        }
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

        return {"status":respond.status,"message":data.message};
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
        

    }
    async authenticateToken(type){
        console.assert(type != "access_token"&& type!="refresh_token","Wrong token type")
        const token = await TokenService.getToken(type)
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
        // console.log (data)
        console.assert(data!= undefined,"Data at authenticateToken is undefined!")
        if(respond.status===401){
            return ({"message":data.message,"status": 401,"data":data})
        }
        if(respond.status ===429){
            return({"message":null,"status": 429,"data":null})
        }
        return({"message":data.message,"status": 200,"data":data})
        
    }
    // async loginWithAccessToken(){

    //     // console.log(await TokenService.getToken("access_token"))
    //     // console.log(await TokenService.getToken("refresh_token"))

    //     const res = await this.authenticateToken("access_token");
    //     const data =await res.data
    //     // console.log(data)
    //     if (res.status===401){
    //         if (data.code === "token_expired") {
    //             const tokendata = await this.authenticateToken("refresh_token");
            
    //             if (tokendata.status === 401) {
    //                 await TokenService.deleteToken("access_token");
    //                 await TokenService.deleteToken("refresh_token");
    //             return false;
    //             } 
    //             else if (tokendata.status === 200) {
    //                 await TokenService.deleteToken("access_token");
    //                 await this.requestNewAccessToken();
    //                 return await this.loginWithAccessToken();
    //             }
    //         }
            
    //         else if (data.code === "token_invalid") {
    //                 await TokenService.deleteToken("access_token");
    //                 await TokenService.deleteToken("refresh_token");        
    //                 return false;
    //         }
    //     }
    //     if(res.status ===429){
    //         return false
    //     }
        
    //     const userdata ={
    //         user_id: data.user_data.user_id,
    //         user_name: data.user_data.user_name,
    //         display_name: data.user_data.display_name
    //     }        

    //     await UserDataService.setUserData(userdata)
    //     if (data.user_data.avatar_uri){
    //         await UserDataService.setProfileImageUri(data.user_data.avatar_uri,'aws')

    //     }
    //     return true;
    //     };
    }

    const AuthService = new Auth
export default AuthService;





