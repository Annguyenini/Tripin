import * as Location from'expo-location'
export class LocationService{
    constructor(){
        if (LocationService.instance){
            return LocationService.instance
        }
        LocationService.instance = this
    }
    async startLocationTracking(){
        
        
    }
}