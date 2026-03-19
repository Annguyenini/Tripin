import AsyncStorage from '@react-native-async-storage/async-storage';

import {Platform } from 'react-native'
import * as API from '../../config/config_api'
// import { setSurfaceProps } from 'react-native/types_generated/Libraries/ReactNative/AppRegistryImpl';
import TokenService from './token_service'
import NetworkObserver from '../../app-core/flow/sync/network_observer';
class Auth{
    async authenticateToken(type,etag=null){
        try{
            console.assert(type === "access_token"&& type ==="refresh_token","Wrong token type")
            const token = await TokenService.getToken(type)
            console.log('token for auth ',token)
            console.assert(token == null,"token is null")
            const headers={"Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`,
                } 
            if (etag){
                headers['If-None-Match'] = etag
            }
            const respond = await fetch(API.LOGIN_TOKEN_API,{
                method : "POST",
                headers: headers
                
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
            console.log('new acess token',data)
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
        try{
        const respond = await fetch(API.LOGIN_API,{
            method :'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                username:username,
                password:password
            })
        })
        const data = await respond.json()

        if(respond.status !==200){
            return{ok: true, status: respond.status,message:data.message, data :null}
        }
        return{ok: true, status: respond.status, data :data}
        }
        catch(err){
            console.error('Failed to fetch', err)
            if (err instanceof TypeError && err.message === 'Network request failed') {
                NetworkObserver.setServerStatus(false)
                return { ok: false, code:'network_error'}
            }
            return { ok: false }
        }
    } 

    async requestSignup(email, displayName, username, password) {
        try {
            const respond = await fetch(API.SIGN_UP_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, displayName, username, password })
            })
            const data = await respond.json()
            console.log(respond,data)

            if (respond.status !== 200) {
                return { ok: false, status: respond.status,message:data.message, data: null }
            }
            return { ok: true, status: respond.status, data: data }
        } catch (err) {
            console.error('Failed to fetch', err)
            if (err instanceof TypeError && err.message === 'Network request failed') {
                NetworkObserver.setServerStatus(false)
                return { ok: false, code: 'network_error' }
            }
            return { ok: false }
        }
    }

    async requestVerification(email, code) {
        try {
            const respond = await fetch(API.REQUEST_VERIFICATION_API, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code })
            })
            const data = await respond.json()
            if (respond.status !== 200) {
                return { ok: false, status: respond.status, data: null }
            }
            return { ok: true, status: respond.status, data: data }
        } catch (err) {
            console.error('Failed to fetch', err)
            if (err instanceof TypeError && err.message === 'Network request failed') {
                NetworkObserver.setServerStatus(false)
                return { ok: false, code: 'network_error' }
            }
            return { ok: false }
        }
    }
    async requestLogout(){
        

    }
    
    }

    const AuthService = new Auth
export default AuthService;





