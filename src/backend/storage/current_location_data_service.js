import { CodegenTypes } from "react-native"
import { DATA_KEYS,STORAGE_KEYS } from "./keys/storage_keys"
import AsyncStorage from "@react-native-async-storage/async-storage"
import LocalStorage from "./base/localStorage"

class LocationDataService extends LocalStorage{
    constructor(){
        super()
            //since this object can keep track of 2 states
            this.item = {
                [DATA_KEYS.LOCATION.CITY]:null,
                [DATA_KEYS.LOCATION.CONDITIONS]: null,
                set(prop,value){
                    this[prop] = value
                },
                get(prop){
                    return this[prop]
                }
            }
        }

        async setCurrentLocationConditionToLocal(condition){
            await this.saveDataObjectToLocal(DATA_KEYS.LOCATION.CONDITIONS,condition)
            this.item.set(DATA_KEYS.LOCATION.CONDITIONS,condition)
            this.notify(DATA_KEYS.LOCATION.CONDITIONS,condition)
        }

        async setCurrentCityToLocal(city){
            await this.saveToLocal(STORAGE_KEYS.CURRENT_CITY,city)
            
            this.item.set(DATA_KEYS.LOCATION.CITY,city)
            this.notify(DATA_KEYS.LOCATION.CITY,city)
        }

        // mock fucntions 
        async setCurrentLocationCondition(condition){
            this.item.set(DATA_KEYS.LOCATION.CONDITIONS,condition)
            this.notify(DATA_KEYS.LOCATION.CONDITIONS,condition)
        }

        async setCurrentCity(city){            
            this.item.set(DATA_KEYS.LOCATION.CITY,city)
            this.notify(DATA_KEYS.LOCATION.CITY,city)
        }

        async getCurrentLocationCoditionFromLocal(){
            return await this.getDataObjectFromLocal(STORAGE_KEYS.LOCATION_COND_DATA)

        }

        async getCurrentCityFormLocal(){
            return await this.getDataFromLocal(STORAGE_KEYS.CURRENT_CITY)
        }

        async deleteCurrentLocationCondition(){
            await this.deleteDataFromLocal(DATA_KEYS.LOCATION.CONDITIONS)
            this.item.set(DATA_KEYS.LOCATION.CONDITIONS,null)
            this.notify(DATA_KEYS.LOCATION.CONDITIONS,null)
        }

        async deleteCurrentCity(){
            await this.deleteDataFromLocal(DATA_KEYS.LOCATION.CITY)
            this.item.set(DATA_KEYS.LOCATION.CITY,null)
            this.notify(DATA_KEYS.LOCATION.CITY,null)
        }
         
    
}

const locationDataService = new LocationDataService()
export default locationDataService