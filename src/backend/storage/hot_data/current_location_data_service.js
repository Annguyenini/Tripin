import { CodegenTypes } from "react-native";
import { DATA_KEYS, STORAGE_KEYS } from "./keys/storage_keys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocalStorage from "../async_storage/localStorage";

class LocationDataService extends LocalStorage {
  constructor() {
    super();
    //since this object can keep track of 2 states
    this.location_key = DATA_KEYS.LOCATION.LOCATION;
    this.location = null;
  }
  setCurrentLocationObject(location) {
    this.location = location;
    this.notify(this.location_key, location);
  }
  getCurrentLocationObject() {
    return this.location;
  }
}

const locationDataService = new LocationDataService();
export default locationDataService;
