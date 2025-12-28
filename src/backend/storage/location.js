import { CodegenTypes } from "react-native"
import { DATA_KEYS,STORAGE_KEYS } from "./storage_keys"
import AsyncStorage from "@react-native-async-storage/async-storage"

class LocationDataService{
    constructor(){
            //since this object can keep track of 2 states
            this.observers = {}
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
    
    
        attach (observer,key){
            // console.log("attach", observer,"with key", key)
            if (!Object.values(DATA_KEYS.LOCATION).includes(key)){
                console.warn('Key not allow')
                return
            }
            if (!this.observers[key]){
                this.observers[key] = []
            }
            this.observers[key].push(observer)
    
        }
    
        detach(observer,key){
            if (!Object.values(DATA_KEYS.LOCATION).includes(key)){
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


        async setCurrentLocationCondition(condition){
            try{
                await AsyncStorage.setItem(STORAGE_KEYS.LOCATION_COND_DATA,JSON.stringify(condition))
                
            }
            catch(asyncError){
                console.error(`ERROR at set current location condition`,asyncError)
                return
            }
            this.item.set(DATA_KEYS.LOCATION.CONDITIONS,condition)
            this.notify(DATA_KEYS.LOCATION.CONDITIONS)
        }

        async setCurrentCity(city){
            try{
                await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_CITY,city)
            }
            catch(asyncError){
                console.error(`Error at set current city`,asyncError)
                return
            }
            this.item.set(DATA_KEYS.LOCATION.CITY,city)
            this.notify(DATA_KEYS.LOCATION.CITY)
        }

        async getCurrentLocationCodition(){
            try{
                const codition = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION_COND_DATA)
                return codition
            }   
            catch(asyncError){
                console.error('Error at get Current Location Condition',asyncError)
                return null
            }
        }

        async getCurrentCity(){
            try{
                const city = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_CITY)
                return city
            }
            catch(asyncError){
                console.error('Error at retriving city', asyncError)
                return null
            }
        }

        async deleteCurrentLocationCondition(){
            try{
                await AsyncStorage.removeItem(STORAGE_KEYS.LOCATION_COND_DATA)
            }
            catch(asyncError){
                console.error('Error delete current location condition:',asyncError)
                return 
            }
            this.item.set(DATA_KEYS.LOCATION.CONDITIONS,null)
            this.notify(DATA_KEYS.LOCATION.CONDITIONS)
        }

        async deleteCurrentCity(){
            try{
                await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_CITY)

            }
            catch(asyncError){
                console.error('Error at delete city',asyncError)
                return
            }

            this.item.set(DATA_KEYS.LOCATION.CITY,null)
            this.notify(DATA_KEYS.LOCATION.CITY)
        }
         
    
}

const locationDataService = new LocationDataService()
export default locationDataService