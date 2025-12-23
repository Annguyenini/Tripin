import * as SecureStore from 'expo-secure-store'

import {STORAGE_KEYS} from './storage_keys'


export class UserDataService{
    static instance

    constructor(){
        if (UserDataService.instance){
            return UserDataService.instance
        }
        UserDataService.instance = this
        this.observers =[];
        this.object = null;
    }


    /**
     * add to the subcriber list
     * @param {observer object} observer 
     */
    attach(observer){
        this.observers.push(observer)
    }


    /**
     * detach from the subcriber list
     * @param {observer object} observer 
     */
    detach(observer){
        this.observers = this.observers.filter(obs=> obs !== observer);
        }

    /**
     * notify all subcribers about the change 
     */
    notify(){
        for(const obs of this.observers){
            obs.update(this.object)
        }
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

        this.object = userdata;
        this.notify()
        
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

        this.object = userdata;
        this.notify()
    }
}