import AsyncStorage from "@react-native-async-storage/async-storage"
import { copyAsync, deleteAsync, documentDirectory, downloadAsync }  from 'expo-file-system/legacy';

class LocalStorage {
    constructor(){
        this.observers ={}
    }

    attach(observer,key){
        if(!this.observers[key]){
            this.observers[key] = []
        }
        this.observers[key].push(observer)
    }
    detach (observer,key){
        if(!this.observers[key])return
        this.observers[key]= this.observers[key].filter(obs => obs!==observer)
    }
    notify(key,data){
        if(!this.observers[key])return
        for (const obs of this.observers[key]){
            obs.update(data)
        }

    }

    async saveDataObjectToLocal(key,data_object){
        if(!data_object||typeof(data_object)!=='object'){
            console.log('data must be object')
        }
        try{
            // await SecureStore.setItemAsync(STORAGE_KEYS.TRIPDATA,JSON.stringify(tripdata))
            await AsyncStorage.setItem(key,JSON.stringify(data_object))
            return true
        }
        catch(asyncError){
            console.error`Error at save ${key} data to local: ${asyncError}`
            return false
        }
    }
    async getDataObjectFromLocal(key){
        try{
            const object_data = await AsyncStorage.getItem(key)
 
            if(object_data){
                console.log('data object',object_data)
                return JSON.parse(object_data)
            }
            else{
                return null
            }
        }
        catch(asyncError){
            console.error`Error at getting ${key} ${asyncError}`
            return null
        }
    }
    async saveArrayToLocal(key,data_array){
        try{
            await AsyncStorage.setItem(key,JSON.stringify(data_array))
            return true
        }
        catch(err){
            console.error(`Failed to save array data: `,err)
            return false
        }
    }

    async getArrayFromLocal(key){
        if(typeof(key)!='string') {
            return []
        }

        try{
            const array = await AsyncStorage.getItem(key)
            return array ? JSON.parse(array)  :[]
        }
        catch(err){
            console.error('Error at get array from local: ',err)
            return []
        }
    }

    async saveToLocal(key,data){
        if (typeof(data)!=='string' || typeof(key)!=='string'){
            console.error('AsyncStorage only allow string')
            return false 
        }
        try {
            await AsyncStorage.setItem(key,data)
        }
        catch(asyncError){
            console.error`Error at save ${key} data to local: ${asyncError}`
            return false
        }
    }
    async getDataFromLocal(key){
        if ( typeof(key)!=='string'){
            console.error('AsyncStorage only allow string')
            return false 
        }
        try{
            const data = await AsyncStorage.getItem(key)
            return data 
            
        }
        catch(asyncError){
            console.error`Error at getting ${key} ${asyncError}`
            return null
        }
    }

    async deleteDataFromLocal(key){
        if ( typeof(key)!=='string'){
            console.error('AsyncStorage only allow string')
            return false 
        }
        try{
            await AsyncStorage.removeItem(key)
            return true
        }
        catch(asyncError){
            console.error`Error at getting ${key} ${asyncError}`
            return false
        }
    }

    async downloadImageToLocal (imageuri,filename){
        if (!imageuri) {
            console.error("imageuri is nil or invalid")
        return null
        }        const destination = documentDirectory+filename
        try{
            await downloadAsync(imageuri,destination)
            return destination
        }
        catch(err){
            console.error(err)
            return null
        }
    }
    
    async saveImageToLocal (imageUri,filename){
        if (!imageUri) {
            console.error("imageuri is nil or invalid")
        return null
        }
        const destination = documentDirectory+filename
        try{
            await copyAsync({from : imageUri,
                to:destination})
            return destination
        }
        catch(err){
            console.error(err)
            return null
        }
    }
    async deleteImageFromLocal(filename){
        const destination = documentDirectory+filename
        try{
            await deleteAsync(destination)
            return destination
        }
        catch(err){
            console.error(err)
            return null
        }
    }

}
export default LocalStorage