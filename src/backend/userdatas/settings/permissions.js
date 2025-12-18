import * as SecureStore from 'expo-secure-store'
import { STORAGE_KEYS } from '../storage_keys'
export class Permission{
    constructor(){
        if (Permission.instance){
            return Permission.instance
        }
        Permission.instance = this
    }

    /** set foreground permission (Location) 
     * @param status - boolean
    */
    async setForeGroundPer(status){
        console.assert
        try{
            await SecureStore.setItemAsync(STORAGE_KEYS.SETTINGS.FOREGROUNDPERMISSION,status)
        }
        catch(secureStoreError){
            console.error`ERROR to set FOREGROUND KEY ${secureStoreError}`
        }
    }

    /** set background permission (Location) 
     * @param status - boolean
    */
    async setBackGroundPer(status){
        try{
            await SecureStore.setItemAsync(STORAGE_KEYS.SETTINGS.BACKGROUNDPERMISSION,status)
        }
        catch(secureStoreError){
            console.error`ERROR to set BACKGROUND KEY`
        }
    }

    /** return foreground permission (Location) 
     * @returns value - boolean
    */
    async getForeGroundPer(){
        try{
            const status = await SecureStore.getItemAsync(STORAGE_KEYS.SETTINGS.BACKGROUNDPERMISSION)
            return status
        }
        catch(secureStoreError){
            console.error`ERROR to get FOREGROUND Value`
            return null
        }
    }

    /** return background permission (Location) 
     * @returns value - boolean
    */
    async getBackGroundPer(){
        try{
            const status = await SecureStore.getItemAsync(STORAGE_KEYS.SETTINGS.BACKGROUNDPERMISSION)
            return status
        }
        catch(secureStoreError){
            console.error`ERROR to get FOREGROUND Value`
            return null
        }
    }

    
}