import { Alert } from "react-native";
import { STORAGE_KEYS, DATA_KEYS } from "../hot_data/keys/storage_keys";
import TripDatabaseService from "./protected/trip_database_service";
import TripLocalDataStorage from "../base/trip_base";
import UserDataService from "../async_storage/user";
import trip from "../../../app-core/state_control/trip_states";
import { Trip_Data } from "../../../types/trip_data.types";
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
  private trips_list: Array<Trip_Data>;
  constructor() {
    super();
    this.trips_list = [];
  } /**
   * function use to handle all trips from server
   * @param {*} trips_list
   * @returns
   */
  async handleAllTripsList(trips_list: Array<Trip_Data>): Promise<boolean> {
    let status = true;
    let MAXCONCURRENCY = 5;
    // save detail data for each trip
    // we use batch so we can update to ui by 10
    try {
      // guard

      trips_list = trips_list.filter((trip) => trip.event !== "remove");
      // delivered data without image first
      this.notify(DATA_KEYS.TRIP.ALL_TRIP_LIST, trips_list);
      // add into database if needed
      for (const trip of trips_list) {
        status = await TripDatabaseService.addTripToDatabase(trip);
      }
      // filter out one that needed image
      let trip_process_queue = [...trips_list.filter((trip) => trip.image)];
      let result = [...trips_list];
      // run worker to save images to local
      // we can skip some of it if there image already save, but due to contents, can chage and image can change
      // we will overwrite the old image event if it exact
      //
      const worker = async () => {
        while (trip_process_queue.length > 0) {
          let trip = trip_process_queue.shift();
          trip.image = await this.saveTripImageToLocal(
            trip.image,
            `${trip.trip_id}_cover.jpg`,
            "aws",
          );
          const image_update = await this.updateTripImage(
            trip.image,
            trip.trip_id,
          );
          const idx = result.findIndex((r) => r.trip_id === trip.trip_id);
          if (idx !== -1) {
            result[idx].image = trip.image;
          }
          this.notify(DATA_KEYS.TRIP.ALL_TRIP_LIST, result);
        }
      };
      await Promise.all(Array.from({ length: MAXCONCURRENCY }, worker));
      this.trips_list = result;
      this.notify(DATA_KEYS.TRIP.ALL_TRIP_LIST, result);
      return status;
    } catch (err) {
      throw new Error("fail to handle all trips", err);
    }
  }

  async FilterAllTripsLocalNeed(server_trip_data: Array<Trip_Data>) {
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

  async getTripDataFromLocal(user_id: any, trip_id: number) {
    const trip_data = await TripDatabaseService.getTripDataFromTripId(trip_id);
    if (trip_data.user_id !== user_id) return null;
    return trip_data;
  }
  async saveTripDataToLocal(data: Trip_Data) {
    const status = await TripDatabaseService.addTripToDatabase(data);
    return status;
  }
  async updateTripName(trip_name: string, trip_id: number) {
    const status = await TripDatabaseService.updateValueInDatabase(
      "trip_name",
      trip_name,
      "trip_id",
      trip_id,
    );
    return status;
  }
  async updateTripImage(image_uri: string, trip_id: number) {
    const status = await TripDatabaseService.updateValueInDatabase(
      "image",
      image_uri,
      "trip_id",
      trip_id,
    );
    return status;
  }
  async updateTripDataModifiedTime(modified_time: number, trip_id: number) {
    const status = await TripDatabaseService.updateValueInDatabase(
      "modified_time",
      modified_time,
      "trip_id",
      trip_id,
    );
    return status;
  }
  async removeTrip(trip_id: number) {
    const status = await TripDatabaseService.updateValueInDatabase(
      "event",
      "remove",
      "trip_id",
      trip_id,
    );
    return status;
  }
  async setTripEnd(end_time: number, trip_id: number) {
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
      return end_status && end_time_status;
    } catch {
      throw new Error("Failed to end trip locally");
    }
  }
  async loadAllTripsListFromLocal() {
    const user_id = UserDataService.getUserId();
    let trips_list =
      await TripDatabaseService.getAllUserTripDataFromDB(user_id);
    // const trips_list = await this.getArrayFromLocal(DATA_KEYS.TRIP.ALL_TRIP_LIST)
    if (trips_list) {
      trips_list = trips_list.filter((trip) => trip.event !== "remove");
      this.trips_list = trips_list;
      this.notify(DATA_KEYS.TRIP.ALL_TRIP_LIST, trips_list);
    }

    return true;
  }
  getAllTripsList() {
    return this.trips_list;
  }
}

export default new TripDataService();
