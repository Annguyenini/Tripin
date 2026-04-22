import * as Location from 'expo-location'
import Permission from '../../backend/storage/settings/permissions';
import safeRun from '../helpers/safe_run';
class LocationData {
    async getCurrentCoor() {
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) return null;
        const coors = await safeRun(() => Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
        }), 'failed_to_get_location');

        const city_object = await Location.reverseGeocodeAsync({
            accuracy: Location.Accuracy.High,
            altitude: coors.coords.altitude,
            latitude: coors.coords.latitude,
            longitude: coors.coords.longitude
        })
        console.log({ ...coors['coords'], ...city_object[0] })
        return { ...coors['coords'], ...city_object[0] }
    }
}

export default new LocationData() 