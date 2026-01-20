import * as SecureStore from 'expo-secure-store'
import {DATA_KEYS} from './keys/storage_keys'
import {STORAGE_KEYS} from './keys/storage_keys'
import { copyAsync, deleteAsync, documentDirectory, downloadAsync }  from 'expo-file-system/legacy';
import LocalStorage from './base/localStorage';
const USER_PROFILE_IMAGE_PATH = 'user_profile.jpg'
class UserDataService extends LocalStorage{
    constructor(){
        super()
        this.items ={
            [DATA_KEYS.USER.USER_DATA] :null,
            [DATA_KEYS.USER.USER_ID] :null,
            [DATA_KEYS.USER.USER_ROLE]:null,
            [DATA_KEYS.USER.USER_NAME]:null,
            [DATA_KEYS.USER.USER_AVATAR]:null,
            [DATA_KEYS.USER.USER_DISPLAY_NAME]:null,
            get(prop){
                return this[prop]
            },
            set(prop,value){
                this[prop] = value
            }
        }
    }

    getUserId(){
        return this.items.get(DATA_KEYS.USER.USER_ID)
    }


    getUserName(){
        return this.items.get(DATA_KEYS.USER.USER_NAME)
    }
    
    getDisplayName(){
        return this.items.get(DATA_KEYS.USER.USER_DISPLAY_NAME)
    }
    /** Set user data 
     * @param {object}userdata - must be an object 
    */
    async setUserDataToLocal (userdata){
        await this.saveDataObjectToLocal(DATA_KEYS.USER.USER_DATA,userdata)
        
        this.items.set(DATA_KEYS.USER.USER_NAME,userdata.user_name)
        
        this.items.set(DATA_KEYS.USER.USER_DISPLAY_NAME,userdata.display_name)

        this.items.set(DATA_KEYS.USER.USER_DATA,userdata)

        this.items.set(DATA_KEYS.USER.USER_AVATAR,userdata.avatar)

        this.notify(DATA_KEYS.USER.USER_DATA,userdata)
    }

    async setUserAuthToLocal(userdata){
        await this.saveDataObjectToLocal(DATA_KEYS.USER.USER_AUTH,userdata)
        this.items.set(DATA_KEYS.USER.USER_ID,userdata.user_id)
        this.items.set(DATA_KEYS.USER.USER_ROLE,userdata.role)

    }
    async usingStoredUserData(){
        const stored_userdata = await this.getDataObjectFromLocal(DATA_KEYS.USER.USER_DATA)
        await this.setUserDataToLocal(stored_userdata)
        return
    }   
    /** getUserData
     * @returns an object of userdata or null if it empty */ 
    async getUserDataFromLocal(){
        const user_data = await this.getDataObjectFromLocal(DATA_KEYS.USER.USER_DATA)
        return user_data
    }

    async getUserAuthFromLocal(){
        const user_data = await this.getDataObjectFromLocal(DATA_KEYS.USER.USER_AUTH)
        return user_data
    }
    /**
     *
     */
    async deleteUserDataFromLocal(){
        this.deleteDataFromLocal(DATA_KEYS.USER.USER_DATA)
        this.items.set(DATA_KEYS.USER.USER_DATA,null)
        this.notify(DATA_KEYS.USER.USER_DATA,null)
    }


    async setProfileImageUriToLocal(uri,location='local'){
        if (!uri) return
        let destination
        if (location === 'local'){
            destination = await this.saveImageToLocal(uri,USER_PROFILE_IMAGE_PATH)
        }
        else{
            destination = await this.downloadImageToLocal(uri,USER_PROFILE_IMAGE_PATH)
        }
        this.items.set(DATA_KEYS.USER.USER_AVATAR,destination)
        this.notify(DATA_KEYS.USER.USER_AVATAR,destination)
        return destination
    }

    
    getProfileImageUri(){
        return this.items.get(DATA_KEYS.USER.USER_AVATAR)
    }

    async deleteProfileImage(){
        await this.deleteImageFromLocal(USER_PROFILE_IMAGE_PATH)

    }

    async deleteAllUserData(){
        await this.deleteUserData()
        await this.deleteProfileImage()
    }
}

const user = new UserDataService()
export default user