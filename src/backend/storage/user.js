import * as SecureStore from 'expo-secure-store'

import {STORAGE_KEYS} from './storage_keys'
import { copyAsync, documentDirectory, downloadAsync }  from 'expo-file-system/legacy';
const USER_PROFILE_IMAGE_PATH = 'user_profile.jpg'
const ALLOWED_KEYS =
    ['user_data','user_profile_image_uri']

class UserDataService{
    constructor(){
        this.observers ={};
        this.items ={
            user_data:null,
            user_profile_image_uri:null,
            get(prop){
                return this[prop]
            },
            set(prop,value){
                this[prop] = value
            }
        }
    }


    /**
     * add to the subcriber list
     * @param {observer object} observer
     * @param {string} key {@link ALLOWED_KEYS} 
     * 
     */
    attach(observer,key){
        const item = ALLOWED_KEYS.find(i=>i===key)
        if (!item) {
            console.warn("Key not allow")
            return
        }
        if(!this.observers[key]){
            this.observers[key] = []
        }
        this.observers[key].push(observer)
    }


    /**
     * detach from the subcriber list
     * @param {observer object} observer 
     */
    detach(observer,key){
        const item = ALLOWED_KEYS.find(i=>i===key)
        if (!item) {
            console.warn("Key not allow")
            return
        }
        this.observers[key] = this.observers[key].filter(obs=> obs !== observer);
        }

    /**
     * notify all subcribers about the change 
     */
    notify(key){
        for(const obs of this.observers[key]){
            obs.update(this.items.get(key))
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
        this.items.set('user_data',userdata)
        this.notify('user_data')
        
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
        this.items.set('user_data',null)
        this.notify('user_data')
    }


    async setProfileImageUri(uri){
        const destination = documentDirectory+USER_PROFILE_IMAGE_PATH
        try {
            await copyAsync({from:uri,to:destination })
        }
        catch(err){
            console.error(err)
        }
        this.items.set("user_profile_image_uri",destination)
        this.notify('user_profile_image_uri')
    }

    async downloadProfileImageUri(uri){
        const destination = documentDirectory+USER_PROFILE_IMAGE_PATH
        try {
            await downloadAsync({from:uri,to:destination })
        }
        catch(err){
            console.error(err)
        }
        this.items.set("user_profile_image_uri",destination)
        this.notify('user_profile_image_uri')
    }

    getProfileImageUri(){
        const imageUri = documentDirectory+USER_PROFILE_IMAGE_PATH
        return imageUri
    }
}

const user = new UserDataService()
export default user