import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS ,DATA_KEYS } from '../keys/storage_keys'
import LocalStorage from '../base/localStorage'
import safeRun from '../../../app-core/helpers/safe_run'
class Permission extends(LocalStorage){

    constructor(){
            //since this object can keep track of 2 states
        super()
        this.observers = {}
        this.item = {
            [DATA_KEYS.PERMISSIONS.BACKGROUNDPERMISSION]:null,
            [DATA_KEYS.PERMISSIONS.FOREGROUNDPERMISSION]: null,
            [DATA_KEYS.PERMISSIONS.CAMERAPERMISSION]:null,
            [DATA_KEYS.PERMISSIONS.ALBUMPERMISSION]: null,
            set(prop,value){
                this[prop] = value
            },
            get(prop){
                return this[prop]
            }
        }
    }
    
    
    attach (observer,key){
        // console.log("attach", observer,"with key", key)
        if (!Object.values(DATA_KEYS.PERMISSIONS).includes(key)){
            console.warn('Key not allow')
            return
        }
        if (!this.observers[key]){
            this.observers[key] = []
        }
        this.observers[key].push(observer)

    }

    detach(observer,key){
        if (!Object.values(DATA_KEYS.PERMISSIONS).includes(key)){
            console.warn('Key not allow')
            return
        }
        this.observers[key] = this.observers[key].filter(obs => obs !== observer)

    }

    notify(item){
        // console.log("notifing","observers",this.observers[item],"value",this.item.get(item) )
        if (!this.observers[item]){
            // console.log("return")
            return;}
        this.observers[item].forEach(obs => {
            // console.log("object",obs,"update",this.item.get(item))
            obs.update(this.item.get(item))
        });
    }

    /** set foreground permission (Location) 
     * @param status - string
    */
    async setForeGroundPer(status){
        console.assert(typeof(status)==='string')
        try{
            await safeRun(()=>this.saveToLocal(STORAGE_KEYS.SETTINGS.FOREGROUNDPERMISSION,status),'failed_at_save_foreground_to_local')
        }
        catch(asyncError){
            console.error`ERROR to set FOREGROUND KEY ${asyncError}`
        }
        this.item.set(DATA_KEYS.PERMISSIONS.FOREGROUNDPERMISSION,status)
        this.notify(DATA_KEYS.PERMISSIONS.FOREGROUNDPERMISSION)
    }

    /** set background permission (Location) 
     * @param status - string
    */
    async setBackGroundPer(status){
        try{
            await safeRun(()=>this.saveToLocal(STORAGE_KEYS.SETTINGS.BACKGROUNDPERMISSION,status),'failed_at_save_background_to_local')
        }
        catch(asyncError){
            console.error`ERROR to set BACKGROUND KEY`
        }
        this.item.set(DATA_KEYS.PERMISSIONS.BACKGROUNDPERMISSION,status)
        this.notify(DATA_KEYS.PERMISSIONS.BACKGROUNDPERMISSION)
    }

    /** set camera permission (Location) 
     * @param status - string
    */
    async setCameraPer(status){
        console.assert(typeof(status)==='string')
        try{
            await safeRun(()=>this.saveToLocal(STORAGE_KEYS.SETTINGS.CAMERAPERMISSION,status),'failed_at_save_camera_to_local')
        }
        catch(asyncError){
            console.error`ERROR to set CAMERA KEY ${asyncError}`
        }
        this.item.set(DATA_KEYS.PERMISSIONS.CAMERAPERMISSION,status)
        this.notify(DATA_KEYS.PERMISSIONS.CAMERAPERMISSION)
    }
    /** set album permission (Location) 
     * @param status - string
    */
    async setAlbumPer(status){
        console.assert(typeof(status)==='string')
        try{
            await safeRun(()=>this.saveToLocal(STORAGE_KEYS.SETTINGS.ALBUMPERMISSION,status),'failed_at_save_camera_to_local')
        }
        catch(asyncError){
            console.error`ERROR to set ALBUMN KEY ${asyncError}`
        }
        this.item.set(DATA_KEYS.PERMISSIONS.ALBUMPERMISSION,status)
        this.notify(DATA_KEYS.PERMISSIONS.ALBUMPERMISSION)
    }

 /** set init settings (Location) 
     * @param status - string
    */
    async setInitSettings(status){
        console.assert(typeof(status)==='string')
        try{
            await safeRun(()=>this.saveToLocal(STORAGE_KEYS.SETTINGS.INITSETTINGS,status),'failed_at_save_init_setting_to_local')
        }
        catch(asyncError){
            console.error`ERROR to set INIT SETTING KEY ${asyncError}`
        }
    }


      /** return foreground permission (Location) 
     * @returns value - string
    */
    async getForeGroundPer(){
        try{
            const status = await safeRun(()=>this.getDataFromLocal(STORAGE_KEYS.SETTINGS.FOREGROUNDPERMISSION),'failed_at_get_foreground_setting')
            return status
        }
        catch(asyncError){
            console.error`ERROR to get FOREGROUND Value`
            return null
        }
    }

    /** return background permission (Location) 
     * @returns value - string
    */
    async getBackGroundPer(){
        try{
            const status = await safeRun(()=>this.getDataFromLocal(STORAGE_KEYS.SETTINGS.BACKGROUNDPERMISSION),'failed_at_get_background_setting')
            return status
        }
        catch(asyncError){
            console.error`ERROR to get FOREGROUND Value`
            return null
        }
    }
      /** return camera permission (Location) 
     * @returns value - string
    */
    async getCameraPer(){
        try{
            const status = await safeRun(()=>this.getDataFromLocal(STORAGE_KEYS.SETTINGS.CAMERAPERMISSION),'failed_at_get_foreground_setting')
            return status
        }
        catch(asyncError){
            console.error`ERROR to get CAMERA Value`
            return null
        }
    }

    /** return album permission (Location) 
     * @returns value - string
    */
    async getAlbumPer(){
        try{
            const status = await safeRun(()=>this.getDataFromLocal(STORAGE_KEYS.SETTINGS.ALBUMPERMISSION),'failed_at_get_background_setting')
            return status
        }
        catch(asyncError){
            console.error`ERROR to get ALBUM Value`
            return null
        }
    }

    /** return init setting permission (Location) 
     * @returns value - string
    */
    async getInitSettingPer(){
        try{
            const status = await safeRun(()=>this.getDataFromLocal(STORAGE_KEYS.SETTINGS.INITSETTINGS),'failed_at_get_init_setting_setting')
            return status
        }
        catch(asyncError){
            console.error`ERROR to get INIT SETTING Value`
            return null
        }
    }
}
const permission = new Permission()
export default permission