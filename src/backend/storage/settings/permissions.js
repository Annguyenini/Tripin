import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS ,DATA_KEYS } from '../keys/storage_keys'
class Permission{

    constructor(){
            //since this object can keep track of 2 states
        this.observers = {}
        this.item = {
            [DATA_KEYS.PERMISSIONS.BACKGROUNDPERMISSION]:null,
            [DATA_KEYS.PERMISSIONS.FOREGROUNDPERMISSION]: null,
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
     * @param status - boolean
    */
    async setForeGroundPer(status){
        console.assert
        try{
            await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS.FOREGROUNDPERMISSION,status)
        }
        catch(asyncError){
            console.error`ERROR to set FOREGROUND KEY ${asyncError}`
        }
        this.item.set(DATA_KEYS.PERMISSIONS.FOREGROUNDPERMISSION,status)
        this.notify(DATA_KEYS.PERMISSIONS.FOREGROUNDPERMISSION)
    }

    /** set background permission (Location) 
     * @param status - boolean
    */
    async setBackGroundPer(status){
        try{
            await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS.BACKGROUNDPERMISSION,status)
        }
        catch(asyncError){
            console.error`ERROR to set BACKGROUND KEY`
        }
        this.item.set(DATA_KEYS.PERMISSIONS.BACKGROUNDPERMISSION,status)
        this.notify(DATA_KEYS.PERMISSIONS.BACKGROUNDPERMISSION)
    }

    /** return foreground permission (Location) 
     * @returns value - boolean
    */
    async getForeGroundPer(){
        try{
            const status = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS.BACKGROUNDPERMISSION)
            return status
        }
        catch(asyncError){
            console.error`ERROR to get FOREGROUND Value`
            return null
        }
    }

    /** return background permission (Location) 
     * @returns value - boolean
    */
    async getBackGroundPer(){
        try{
            const status = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS.BACKGROUNDPERMISSION)
            return status
        }
        catch(asyncError){
            console.error`ERROR to get FOREGROUND Value`
            return null
        }
    }

    
}
const permission = new Permission()
export default permission