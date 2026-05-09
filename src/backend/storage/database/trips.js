import { Alert } from "react-native";
import { STORAGE_KEYS, DATA_KEYS } from "../hot_data/keys/storage_keys";
import TripDatabaseService from "./protected/TripDatabaseService";
import TripLocalDataStorage from "../base/trip_base";
import UserDataService from "./user";
class TripDataService extends TripLocalDataStorage {
  /**
     * trip data service, use to store trip_name...
     * struct of data object {
     * "trip_name":trip_name,
            "trip_id":trip_id,
            "created_time":created_time
     * }
     * @returns
     */
  constructor() {
    super();
    this.item = {
      [DATA_KEYS.TRIP.ALL_TRIP_LIST]: [],
      set(prop, value) {
        this[prop] = value;
      },
      get(prop) {
        return this[prop];
      },
    };
  } /**
   * function use to handle all trips from user
   * @param {*} trips_list
   * @returns
   */
  async handleAllTripsList(trips_list, local = false) {
    let status = true;
    let MAXCONCURRENCY = 5;
    // save detail data for each trip
    // we use batch so we can update to ui by 10
    try {
      this.notify(DATA_KEYS.TRIP.ALL_TRIP_LIST, trips_list);
      for (const trip of trips_list) {
        status = await TripDatabaseService.addTripToDatabase(trip);
      }

      let trip_process_queue = [...trips_list.filter((trip) => trip.image)];
      let result = [...trips_list];
      const worker = async () => {
        while (trip_process_queue.length > 0) {
          let trip = trip_process_queue.shift();
          trip.image = await this.saveTripImageToLocal(
            trip.image,
            `${trip.id}_cover.jpg`,
            "aws",
          );
          const image_update = await this.updateTripImage(trip.image, trip.id);
          const idx = result.findIndex((r) => r.id === trip.id);
          if (idx !== -1) {
            result[idx].image = trip.image;
          }
          this.notify(DATA_KEYS.TRIP.ALL_TRIP_LIST, result);
        }
      };
      if (!local) {
        console.log("begin worker");
        await Promise.all(Array.from({ length: MAXCONCURRENCY }, worker));
        console.log("end worker");
      }
      this.item.set(DATA_KEYS.TRIP.ALL_TRIP_LIST, result);
      this.notify(DATA_KEYS.TRIP.ALL_TRIP_LIST, result);

      return status;
    } catch (err) {
      console.error("failed_at_handle_all_trip");
      return false;
    }
  }

  async FilterAllTripsLocalNeed(server_trip_data) {
    const user_id = UserDataService.getUserId();
    const local_trip_data =
      await TripDatabaseService.getAllUserTripDataFromDB(user_id);

    let result =
      server_trip_data?.filter(
        (server) =>
          !local_trip_data.find((local) => local.trip_id === server.trip_id),
      ) ?? [];
    return result;
  }

  async getTripDataFromLocal(user_id, trip_id) {
    const trip_data = await TripDatabaseService.getTripDataFromTripId(trip_id);
    if (trip_data.user_id !== user_id) return null;
    return trip_data;
  }
  async saveTripDataToLocal(data) {
    const status = await TripDatabaseService.addTripToDatabase(data);
    return status;
  }
  async updateTripName(trip_name, trip_id) {
    const status = await TripDatabaseService.updateValueInDatabase(
      "trip_name",
      trip_name,
      "trip_id",
      trip_id,
    );
    return status;
  }
  async updateTripImage(image_uri, trip_id) {
    const status = await TripDatabaseService.updateValueInDatabase(
      "image",
      image_uri,
      "trip_id",
      trip_id,
    );
    return status;
  }
  async updateTripDataModifiedTime(modified_time, trip_id) {
    const status = await TripDatabaseService.updateValueInDatabase(
      "modified_time",
      modified_time,
      "trip_id",
      trip_id,
    );
    return status;
  }
  async setTripEnd(end_time, trip_id) {
    try {
      const end_time_status = await TripDatabaseService.updateValueInDatabase(
        "ended_time",
        end_time,
        "trip_id",
        trip_id,
      );
      const end_status = await TripDatabaseService.updateValueInDatabase(
        "active",
        false,
        "trip_id",
        trip_id,
      );
      console.log("update end time", end_time, end_time_status, end_status);
    } catch {
      throw new Error("Failed to end trip locally");
    }
  }
  async loadAllTripsListFromLocal() {
    const user_id = UserDataService.getUserId();
    const trips_list =
      await TripDatabaseService.getAllUserTripDataFromDB(user_id);
    // const trips_list = await this.getArrayFromLocal(DATA_KEYS.TRIP.ALL_TRIP_LIST)
    console.log("trip list ", trips_list, user_id);
    if (trips_list) {
      this.item.set(DATA_KEYS.TRIP.ALL_TRIP_LIST, trips_list);
      this.notify(DATA_KEYS.TRIP.ALL_TRIP_LIST, trips_list);
    }

    return true;
  }
  getAllTripsList() {
    return this.item.get(DATA_KEYS.TRIP.ALL_TRIP_LIST);
  }
}

export default new TripDataService();
