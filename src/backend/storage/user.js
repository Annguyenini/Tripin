import * as SecureStore from 'expo-secure-store'
import {DATA_KEYS} from './storage_keys'
import {STORAGE_KEYS} from './storage_keys'
import { copyAsync, deleteAsync, documentDirectory, downloadAsync }  from 'expo-file-system/legacy';
const USER_PROFILE_IMAGE_PATH = 'user_profile.jpg'
class UserDataService{
    constructor(){
        this.observers ={};
        this.items ={
            [DATA_KEYS.USER.USER_DATA] :null,
            [DATA_KEYS.USER.USER_AVATAR]:null,
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
     * @param {string} key {@link DATA_KEYS.USER} 
     * 
     */
    attach(observer,key){
        if( !Object.values(DATA_KEYS.USER).includes(key)){
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
        if( !Object.values(DATA_KEYS.USER).includes(key)){
            console.warn("Key not allow")
            return
        }
        this.observers[key] = this.observers[key].filter(obs=> obs !== observer);
        }

    /**
     * notify all subcribers about the change 
     */
    notify(key){
        if(!this.observers[key]){
            return
        }
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
        this.items.set(DATA_KEYS.USER.USER_DATA,userdata)
        this.notify(DATA_KEYS.USER.USER_DATA)
        
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
        this.items.set(DATA_KEYS.USER.USER_DATA,null)
        this.notify(DATA_KEYS.USER.USER_DATA)
    }


    async setProfileImageUri(uri){
        const destination = documentDirectory+USER_PROFILE_IMAGE_PATH
        try {
            await copyAsync({from:uri,to:destination })
        }
        catch(err){
            console.error(err)
        }
        this.items.set(DATA_KEYS.USER.USER_AVATAR,destination)
        this.notify(DATA_KEYS.USER.USER_AVATAR)
    }

    async downloadProfileImageUri(uri){
        const destination = documentDirectory+USER_PROFILE_IMAGE_PATH
        try {
            const result = await downloadAsync(uri,destination )
            console.log('downloaded',result)
        }
        catch(err){
            console.error(err)
        }

       
        this.items.set(DATA_KEYS.USER.USER_AVATAR,destination)
        console.log('32323')
        this.notify(DATA_KEYS.USER.USER_AVATAR)
        console.log('complete download')
    }

    getProfileImageUri(){
        const imageUri = documentDirectory+USER_PROFILE_IMAGE_PATH
        return imageUri
    }

    async deleteProfileImage(){
        try{
            await deleteAsync(documentDirectory+USER_PROFILE_IMAGE_PATH)
        }
        catch(err){
            console.error(err)
        }
    }

    async deleteAllUserData(){
        await this.deleteUserData()
        await this.deleteProfileImage()
    }
}

const user = new UserDataService()
export default user