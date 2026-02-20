import LocalStorage from "./localStorage";
import { copyAsync, deleteAsync, documentDirectory, downloadAsync }  from 'expo-file-system/legacy';

class TripLocalDataStorage extends LocalStorage{
    constructor(){
        super()
    }


    getTripKeyReady(user_id,trip_id){
        return `user:${user_id}:trip:${trip_id}`
    }

    async saveTripDataObjectToLocal(key,trip_data_object){
        return await this.saveDataObjectToLocal(key,trip_data_object)
    }

    async getTripDataObjectFromLocal(key){
        return await this.getDataObjectFromLocal(key)
    }
    async saveTripDataToLocal(key,data){
        return await this.saveToLocal(key,data)
    }

    async getTripDataFromLocal(key){
        return await this.getDataFromLocal(key)
    }
    async saveTripImageToLocal(imageUri,filename,source= 'local'){
        try{
            if (source !=='local'){
                return await this.downloadImageToLocal(imageUri,filename)
            }
            return await this.saveImageToLocal(imageUri,filename)
        }
        catch(err){
            console.error('Failed to save image to local: ', err)
            throw new Error ('Failed to save image')
        }
    }
    // async getTripImageFromLocal(imageUri){
    //     return await this.
    // }


}
export default TripLocalDataStorage