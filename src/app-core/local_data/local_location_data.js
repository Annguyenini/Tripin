import * as Location from 'expo-location'
import Permission from '../../backend/storage/settings/permissions';
import safeRun from '../helpers/safe_run';
class LocationData{
    async getCurrentCoor(){
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) return null;
        const coors = await safeRun(() => Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
        }), 'failed_to_get_location');        
        return coors
    }   
}

export default new LocationData() 