import { DATA_KEYS } from "./keys/storage_keys";

import TripLocalDataStorage from "../base/trip_base";
import TripDatabaseService from "../database/protected/trip_database_service";
import safeRun from "../../../app-core/helpers/safe_run";
import { Trip_Data } from "../../../types/trip_data.types";
class CurrentTripDataService extends TripLocalDataStorage {
  private item: Trip_Data;
  constructor() {
    super();
    this.item = null;
  }

  // ===================== GETTERS =====================
  getCurrentTripData() {
    return this.item;
  }
  getCurrentTripId() {
    return this.item?.trip_id;
  }
  getCurrentTripName() {
    return this.item?.trip_name;
  }
  getCurrentTripImageUri() {
    return this.item?.image;
  }
  getCurrentCreatedTime() {
    return this.item?.created_time;
  }
  getCurrentTripStatus() {
    return this.item?.active ?? false;
  }
  getCurrentTripModifiedTime() {
    return this.item?.modified_time;
  }
  getCurrentTripContentsModifiedTime() {
    return this.item?.content_modified_time;
  }
  // ===================== LOAD / SAVE =====================
  async saveCurrentTripDataToLocal(trip_data: Trip_Data) {
    try {
      this.item = trip_data;
      this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA, trip_data);
      return true;
    } catch (err) {
      throw new Error("Failed at save current trip data to hot data ", {
        cause: err,
      });
    }
  }

  async loadCurrentTripDataFromLocal() {
    try {
      const trip_data = await TripDatabaseService.getCurrentTripData();
      if (!trip_data) return false;
      return await this.saveCurrentTripDataToLocal(trip_data);
    } catch (err) {
      console.error("Failed at loading stored current trip data", err);
      return false;
    }
  }

  // ===================== IMAGE =====================
  async setCurrentTripImageCoverToLocal(imageUri, trip_id, source = "local") {
    try {
      const filename = `${trip_id}_cover.jpg`;
      const local_trip_imageuri = await this.saveTripImageToLocal(
        imageUri,
        filename,
        source,
      );
      await TripDatabaseService.updateValueInDatabase(
        "image",
        local_trip_imageuri,
        "trip_id",
        trip_id,
      );
      if (this.item) this.item.image = local_trip_imageuri;
      return local_trip_imageuri;
    } catch (err) {
      console.error("Failed to set trip image", err);
      throw new Error("Failed to set trip image", err);
    }
  }

  // ===================== END TRIP =====================
  async endCurrentTrip(current_time) {
    this.item = null;
    this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA, null);
  }
}

export default new CurrentTripDataService();
