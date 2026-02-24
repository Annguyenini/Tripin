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
    // ========================Get Value==============================
    getUserId(){
        return this.items.get(DATA_KEYS.USER.USER_ID)
    }


    getUserName(){
        return this.items.get(DATA_KEYS.USER.USER_NAME)
    }
    
    getDisplayName(){
        return this.items.get(DATA_KEYS.USER.USER_DISPLAY_NAME)
    }
    /** getUserData
     * @returns an object of userdata or null if it empty */ 
    getUserDataFromLocal(){
        const user_data = this.getDataObjectFromLocal(STORAGE_KEYS.USER.USER_DATA)
        return user_data
    }

    async getUserAuthFromLocal(){
        const user_data = await this.getDataObjectFromLocal(STORAGE_KEYS.USER.USER_ROLE)
        return user_data
    }
    getProfileImageUri(){
        return this.items.get(DATA_KEYS.USER.USER_AVATAR)
    }
    // ==========================Set Value===========================
    setDisplayName(new_display_name){
        const user_data =this.items.get(DATA_KEYS.USER.USER_DATA)
        user_data.display_name = new_display_name
        this.setUserDataToLocal(user_data)
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
        const user_data = await this.getUserDataFromLocal()
        if(user_data){
            user_data.avatar = destination
            await this.setUserDataToLocal(user_data)
        }
        this.items.set(DATA_KEYS.USER.USER_AVATAR,destination)
        this.notify(DATA_KEYS.USER.USER_AVATAR,destination)
        return destination
    }
    /** Set user data 
     * @param {object}userdata - must be an object 
    */
    async setUserDataToLocal (userdata){
        await this.saveDataObjectToLocal(STORAGE_KEYS.USER.USER_DATA,userdata)
        
        this.items.set(DATA_KEYS.USER.USER_NAME,userdata.user_name)
        
        this.items.set(DATA_KEYS.USER.USER_DISPLAY_NAME,userdata.display_name)

        this.items.set(DATA_KEYS.USER.USER_DATA,userdata)

        this.items.set(DATA_KEYS.USER.USER_AVATAR,userdata.avatar)

        this.notify(DATA_KEYS.USER.USER_DATA,userdata)
    }

    async setUserAuthToLocal(userdata){
        console.log('trips1',userdata)
        await this.saveDataObjectToLocal(STORAGE_KEYS.USER.USER_ROLE,userdata)
        this.items.set(DATA_KEYS.USER.USER_ID,userdata.user_id)
        this.items.set(DATA_KEYS.USER.USER_ROLE,userdata.role)

    }
    /**
     * using stored value when it match version or stored
     * @returns 
     */
    async usingStoredUserData(){
        const stored_userdata = await this.getDataObjectFromLocal(STORAGE_KEYS.USER.USER_DATA)
        await this.setUserDataToLocal(stored_userdata)
        return
    }   
    async usingStoredUserAuth(){
        const stored_userauth = await this.getUserAuthFromLocal()
        await this.setUserAuthToLocal(stored_userauth)
        return
    }
    /**
     *
     */
    async deleteUserDataFromLocal(){
        const keys_array = await this.getAllKeys()
        keys_array = keys_array.filter(key => key.includes('user.'))
        for (const key of keys_array){
            this.deleteDataFromLocal(key)
        }
        this.items.set(DATA_KEYS.USER.USER_DATA,null)
        this.notify(DATA_KEYS.USER.USER_DATA,null)
    }
    

    async deleteProfileImage(){
        await this.deleteImageFromLocal(USER_PROFILE_IMAGE_PATH)

    }

    async deleteAllUserData(){
        await this.deleteUserDataFromLocal()
        await this.deleteProfileImage()
    }
}

const user = new UserDataService()
export default user