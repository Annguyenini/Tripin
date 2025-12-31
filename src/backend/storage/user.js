import * as SecureStore from 'expo-secure-store'
import {DATA_KEYS} from './storage_keys'
import {STORAGE_KEYS} from './storage_keys'
import { copyAsync, deleteAsync, documentDirectory, downloadAsync }  from 'expo-file-system/legacy';
import Subject from './subject';
const USER_PROFILE_IMAGE_PATH = 'user_profile.jpg'
class UserDataService extends Subject{
    constructor(){
        super()
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

    /** Set user data 
     * @param {object}userdata - must be an object 
    */
    async setUserData (userdata){
        
    
        try{
            await SecureStore.setItemAsync(STORAGE_KEYS.USER,JSON.stringify(userdata))
        }
        catch(secureStoreError){
            console.error`Error at set key ${STORAGE_KEYS.USER}`
        }
        this.items.set(DATA_KEYS.USER.USER_DATA,userdata)

        this.notify(DATA_KEYS.USER.USER_DATA,userdata)
        
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
        this.notify(DATA_KEYS.USER.USER_DATA,null)
    }


    async setProfileImageUri(uri,location='local'){
        const destination = documentDirectory+USER_PROFILE_IMAGE_PATH
        console.log('uri',uri,'des',destination)
        if (location !== 'local'){
             try {
            
                await downloadAsync(uri,destination )
            }
            catch(err){
                console.error('dsdsd',err)
            }
        }
        else{
            try {
                
                await copyAsync({from:uri,to:destination })
            }
            catch(err){
                console.error('dsdsd',err)
            }
        }
        this.items.set(DATA_KEYS.USER.USER_AVATAR,destination)
        this.notify(DATA_KEYS.USER.USER_AVATAR,destination)
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
        this.notify(DATA_KEYS.USER.USER_AVATAR,destination)
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