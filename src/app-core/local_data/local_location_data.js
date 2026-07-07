import * as Location from "expo-location";
import Permission from "../../backend/storage/settings/permissions";
import safeRun from "../helpers/safe_run";
class LocationData {
  constructor() {
    this.Location = {};
  }
  async getCurrentCoor() {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) return null;
      const fg = await Location.getForegroundPermissionsAsync();
      if (!fg.granted) return null;
      const coors = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
      });

      const reverse = await this.reverseCoords(
        coors?.coords?.longitude,
        coors?.coords?.latitude,
      );

      return { ...coors["coords"], ...reverse };
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  async reverseCoords(lng, lat) {
    if (!lng || !lat)
      throw new Error(`fail to reverse from coords, empty lat or lng`);
    try {
      const location_key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
      if (this.Location[location_key]) {
        // console.log("cache", this.Location[location_key]);
        return { ...coors["coords"], ...this.Location[location_key] };
      }
      const city_object = await Location.reverseGeocodeAsync({
        accuracy: Location.Accuracy.High,
        latitude: lat,
        longitude: lng,
      });
      this.Location[location_key] = city_object[0];
      return city_object[0];
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new LocationData();
