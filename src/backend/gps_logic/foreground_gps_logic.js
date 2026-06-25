import * as Location from "expo-location";
import locationDataService from "../storage/hot_data/current_location_data_service";
let subcription;
export const startForegroundGPSTracker = async () => {
  // console.log("start");
  try {
    const fg = await Location.getForegroundPermissionsAsync();
    if (fg.status !== "granted")
      throw new Error("Fail to get forground permision");
    subcription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        // timeInterval:50000,
        distanceInterval: 2,
      },
      (location) => {
        getCityData(location);
      },
      (error) => {
        console.error(error);
      },
    );
  } catch (err) {
    throw new Error(`fail to start forground gps tracker: ${err}`);
  }
};
export const endForegroundGPSTracker = async () => {
  // console.log("end");
  try {
    if (subcription) {
      subcription.remove();
      subcription = null;
    }
  } catch (err) {
    throw new Error(`Fail to end foreground gps tracker; ${err}`);
  }
};
const getCityData = async (location) => {
  try {
    const city_object = await Location.reverseGeocodeAsync({
      accuracy: Location.Accuracy.High,
      altitude: location.coords.altitude,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    locationDataService.setCurrentLocationObject(city_object[0]);
  } catch (err) {
    throw new Error(`fail to get city data: ${err}`);
  }
};
