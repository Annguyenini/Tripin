import * as Location from 'expo-location'
import Permission from '../../backend/storage/settings/permissions';
class LocationData{
    constructor(){

    }
    async getCurrentCoor(){
        const bg = await Permission.getBackGroundPer()
        if(bg !=='true'){
            return null
        }
        const coors  = await Location.getCurrentPositionAsync()
        return coors
    }   
}

export default new LocationData() 