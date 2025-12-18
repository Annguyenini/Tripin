import * as SecureStore from 'expo-secure-store'

import {STORAGE_KEYS} from './storage_keys'


export class UserDataService{
    constructor(){
        if (UserDataService.instance){
            return UserDataService.instance
        }
        UserDataService.instance = this
    }


    /** Set user data 
     * @param {object}userdata - must be an object 
    */
    async setUserData (userdata){
        
        
        if(!userdata||typeof(userdata)!=='object'){
        }
        try{
            await SecureStore.setItemAsync(STORAGE_KEYS.USER,JSON.stringify(userdata))
        }
        catch(secureStoreError){
            console.error`Error at set key ${STORAGE_KEYS.USER}`
        }
        
    }
    /** getUserData
     * @returns an object of userdata or null if it empty */ 
    async getUserData(){
        try{
            const userdata = await SecureStore.getItemAsync(STORAGE_KEYS.USER)
            if(userdata){
                return JSON.parse(userdata)
            }
            else{
                return null
            }
        }
        catch(secureStoreError){
            console.error`Error at getting${STORAGE_KEYS.USER}`
            return null
        }
    }
    /**
     *
     */
    async deleteUserData(){
        try{
            await SecureStore.deleteItemAsync(STORAGE_KEYS.USER)
        }
        catch(secureStoreError){
            console.error(`Error at deleting ${STORAGE_KEYS.USER}`)
        }
    }
}