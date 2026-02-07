import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SecureStore from 'expo-secure-store'
import {Platform } from 'react-native'
import * as API from '../../config/config_api'
// import { setSurfaceProps } from 'react-native/types_generated/Libraries/ReactNative/AppRegistryImpl';
import UserDataService from '../storage/user'
import TokenService from './token_service'
import EtagService from './etag/etag_service';
import { ETAG_KEY } from './etag/etag_keys';
import fetchFunction from './fetch_function';
class Auth{
    async authenticateToken(type,etag=null){
        try{
            console.assert(type === "access_token"&& type ==="refresh_token","Wrong token type")
            const token = await TokenService.getToken(type)
            console.assert(token == null,"token is null")
            const headers={"Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`,
                } 
            if (etag){
                headers['If-None-Match'] = etag
            }
            console.log(API.LOGIN_TOKEN_API)
            const respond = await fetch(API.LOGIN_TOKEN_API,{
                method : "POST",
                headers
                
            });
            const data = await respond.json();
            return({'ok':true,"message":data.message,"status": respond.status,"data":data})
        }
        catch(err){
            console.error('Failed at token auth: ',err)
            return({'ok':false})
        }    
    }
    
    async requestNewAccessToken(){
        try{
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
        catch(err){
            console.error('Failed at request access token: ',err)
        }
    }
    
    async requestLogin(username,password){
        const respond = await fetchFunction(API.LOGIN_API,{
            method :'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                username:username,
                password:password
            })
        })
        return respond
    } 

    async requestSignup(email,displayName,username,password){
        const respond = await fetchFunction(API.SIGN_UP_API,{
            method: "POST", 
            headers:{"Content-Type":"application/json"}, 
            body: JSON.stringify({
            email:email,
            displayName:displayName,
            username:username,
            password:password 
            })
        })
        return respond
    }   
    async requestVerifycation (email, code){
        // console.log("called")
        const respond = await fetchFunction(API.REQUEST_VERIFICATION_API,{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                email: email,
                code : code,
            })             
        })
        return respond
    }
    async requestLogout(){
        

    }
    
    }

    const AuthService = new Auth
export default AuthService;





