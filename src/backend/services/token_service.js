import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native';
import { jwtDecode } from 'jwt-decode'
import {PUBLIC_KEY} from '../../config/public_keys'
const ALLOW_TYPE =['access_token','refresh_token']
class TokenService{
    constructor(){
        this.accessToken= null;
        this.refreshToken =null;
    }
     /**
         * set token
         *  @param type -type of token, (refresh_token,access_token)
         *  type must be {@link ALLOW_TYPE}
         */
    async setToken(type,token){
        if (typeof(type)!=='string'){
            console.error("type must be string")
            return
        }
        const item = ALLOW_TYPE.find(t=>t===type)
        if (!item) {
            console.error( "Type must be 'access_token' or 'refresh_token'") 
            return
        }        
        if(Platform.OS === "web"){
            try{
                await AsyncStorage.setItem(type,token);
            }
            catch(asyncError){
                console.error("Error at set access_token", asyncError);
                throw asyncError;
            }
        }
        else{
            try{
                await SecureStore.setItemAsync(type,token);
            }
            catch(secureStoreError){
                console.error(`Error at set ${type}`, secureStoreError);
                throw secureStoreError;
            }
        }
        // console.log(token)

    }
     /**
         * delete token
         *  @param type -type of token, (refresh_token,access_token)
         *  type must be {@link ALLOW_TYPE}
         */
    async deleteToken(type){
        if (typeof(type)!=='string'){
            console.error("type must be string")
            return
        }
        const item = ALLOW_TYPE.find(t=>t===type)
        if (!item) {
            console.error( "Type must be 'access_token' or 'refresh_token'") 
            return
        }              
        if(Platform.OS ==="web"){
            try {
                await AsyncStorage.removeItem(type)
            }
            catch(asyncError){
                console.error("Error trying to detele token", asyncError)
                throw asyncError
            }
            
        }
        else{
            try {
                await SecureStore.deleteItemAsync(type)
            }
            catch(secureStoreError){
                console.error("Error trying to detele token", secureStoreError)
                throw secureStoreError

            
            }
        }
    }
     /**
         * get token
         *  @param type -type of token, (refresh_token,access_token)
         *  type must be {@link ALLOW_TYPE}
         * @returns token
         */
    async getToken(type){
        if (typeof(type)!=='string'){
            console.error("type must be string")
            return
        }
        const item = ALLOW_TYPE.find(t=>t===type)
        if (!item) {
            console.error( "Type must be 'access_token' or 'refresh_token'") 
            return
        }        
        let token;
        if(Platform.OS === "web"){
            try{
                token = await AsyncStorage.getItem(type);
            }catch(asyncError){
                console.error("Error at get token: ", asyncError)
            }
            
        }
        else{
            try{
                token = await SecureStore.getItemAsync(type);
            }catch(secureStoreError){
                console.error("Error at get token: ",secureStoreError)
            }
            
        }
        return token
    }
    async verifyTokenOffine(token){
        try {
            const payload = jwtDecode(token)
            
            // manually check expiry
            const now = Math.floor(Date.now() / 1000)
            if (payload.exp && payload.exp < now) {
                return { status: false, message: 'Token Expired!', code: 'token_expired' }
            }

            return { status: true, message: 'Successfully!', code: 'successfully', payload }

        } 
        catch (err) {
            return { status: false, message: 'Token Invalid!', code: 'token_invalid' }
        }
    }
}

const tokenService = new TokenService()
export default tokenService