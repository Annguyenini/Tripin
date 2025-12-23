import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native';
export class TokenService{
    static instance

    constructor(){
        if(TokenService.instance)return TokenService.instance;
        TokenService.instance = this;
        this.accessToken= null;
        this.refreshToken =null;
    }
    async setToken(type,token){
        if (type != "access_token" && type != "refresh_token") console.error( "Type must be 'access_token' or 'refresh_token'")
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

    async deleteToken(type){
        if (type != "access_token" && type != "refresh_token") console.error( "Type must be 'access_token' or 'refresh_token'")
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
    
    async getToken(type){
        /**
         * get token
         *  @param type -type of token, (refresh_token,access_token)
         * @returns token
         */
        if (type != "access_token" && type != "refresh_token") console.error( "Type must be 'access_token' or 'refresh_token'")
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
}