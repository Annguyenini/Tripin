import { DATA_KEYS } from "./keys/storage_keys";

import TripLocalDataStorage from "./base/trip_base";
import TripDatabaseService from "../database/TripDatabaseService";
import safeRun from "../../app-core/helpers/safe_run";
class CurrentTripDataService extends TripLocalDataStorage {
  constructor() {
    super();
    this.item = null;
  }

  // ===================== GETTERS =====================
  getCurrentTripData() {
    return this.item
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
    return this.item?.contents_modified_time;
  }
  getCurrentTripStorageKey() {
    return this.item?.storage_key;
  }
  getCurrentTripCoordinates() {
    return this.item?.coordinates ?? [];
  }

  // ===================== LOAD / SAVE =====================
  async saveCurrentTripDataToLocal(trip_data) {

    try {
      this.item = trip_data;
      this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA, trip_data);
      return true;
    } catch (err) {
      throw new Error("Failed at save current trip data to hot data ", err.message);
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

  async deleteTripImageCoverFromLocal() {
    try {
      const file_path = this.item?.image;
      if (!file_path) return;
      await this.deleteDataFromLocal(file_path);
      await this.deleteImageFromLocal(file_path);
    } catch (err) {
      console.error("Failed at delete trip image", err);
    }
  }

  // ===================== END TRIP =====================
  async endCurrentTrip(current_time) {
    try {
      await this.deleteTripImageCoverFromLocal();
      await safeRun(
        () =>
          TripDatabaseService.updateValueInDatabase(
            "active",
            false,
            "trip_id",
            this.getCurrentTripId(),
          ),
        "failed_at_set_trip_active",
      );
      await safeRun(
        () =>
          TripDatabaseService.updateValueInDatabase(
            "ended_time",
            current_time,
            "trip_id",
            this.getCurrentTripId(),
          ),
        "failed_at_set_ended_time",
      );
    } catch (err) {
      console.error("Failed at reset current trip data", err);
    }
    this.item = null;
    this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA, null);
  }

  // ===================== HELPERS =====================
  getObjectReady(
    user_id,
    trip_id,
    trip_name,
    created_time,
    image_path = null,
    active,
  ) {
    return {
      user_id,
      trip_id,
      trip_name,
      created_time,
      image: image_path,
      active,
    };
  }

  generateCurrentTripIdKey(user_id) {
    return `user_${user_id}:current_trip_id`;
  }
}

export default new CurrentTripDataService();
