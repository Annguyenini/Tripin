import Trip from "../../../../backend/services/trip";
import TripDataService from "../../../../backend/storage/database/trips";
import CurrentTripDataService from "../../../../backend/storage/hot_data/current_trip";
import UserDataService from "../../../../backend/storage/async_storage/user";
import EtagService from "../../../../backend/storage/etag/etag_service";
import {
  ETAG_KEY,
  GENERATE_TRIP_ETAG_KEY,
} from "../../../../backend/storage/etag/etag_keys";
import GPSLogic from "../../../../backend/gps_logic/gps_logic";
import safeRun from "../../../helpers/safe_run";
import trips from "../../../../backend/storage/database/trips";
import TripContentsHandler from "../../trip_contents_handler";
import { CurrentTripDataObject } from "../../../../types/current_trip_data_types.types";
import { CreateNewTripHandler } from "../../../../types/trip_actions_handler.types";
interface newTripData {
  trip_id: string;
  presign_url: string | undefined;
  code: string;
  message?: string;
}
interface newTripRespond {
  ok: boolean;
  status: number;
  data: newTripData;
}
interface imageUploadRespond {
  status: number;
}
class TripActionHandler {
  /**
   *
   * @param {*} trip_name
   * @param {*} imageUri
   * process new trip and save it to the data service
   * @returns boolean of sucess or no
   */
  // current depend on the server
  async requestNewTripHandler(
    trip_name: string,
    imageUri: string | null = null,
  ): Promise<CreateNewTripHandler> {
    try {
      const created_time = Date.now();
      // ----------------------Phase 1-------------------------------
      // request new trip
      const respond: newTripRespond = await Trip.requestNewTrip(
        trip_name,
        created_time,
      );
      const data: newTripData = respond.data;

      if (respond.status !== 200)
        return {
          code: data.code,
          message: data.message,
          ...respond,
        };
      // if success fully send to server, process to store in the local

      // data from server
      const trip_id: string = data.trip_id;

      const user_id = UserDataService.getUserId();
      // generate image path and save     to local
      // -------------------------Phase 2-----------------------
      // upload trip image cover into cloud
      let trip_image_uri = null;
      if (imageUri) {
        if (!data.presign_url) throw new Error("presign_url not found!");

        const presign_url = data.presign_url;
        const upload: imageUploadRespond = await Trip.uploadTripCoverImage(
          presign_url,
          imageUri,
        );
        if (upload.status !== 200)
          throw new Error("fail to upload image to cloud ");
        // save image to database

        trip_image_uri =
          await CurrentTripDataService.setCurrentTripImageCoverToLocal(
            imageUri,
            trip_id,
          );
      }

      // tripdata object
      const local_trip_data: CurrentTripDataObject = {
        user_id: user_id,
        trip_id: trip_id,
        trip_name: trip_name,
        image: trip_image_uri,
        created_time: created_time,
        active: true,
        modified_time: created_time,
        contents_modified_time: created_time,
      };
      // console.log(trip_data);
      // save tripdata to local
      // hot data
      await safeRun(
        () =>
          CurrentTripDataService.saveCurrentTripDataToLocal(local_trip_data),
        "current_trip_save_failed",
      );
      // database
      await safeRun(
        () => TripDataService.saveTripDataToLocal(local_trip_data),
        "failed_at_save_to_database",
      );

      return {
        code: data.code,
        success: true,
        status: respond.status,
        message: "Create new trip successfully",
        ...respond,
      };
    } catch (err) {
      console.error("Failed at request new trips", err);
      return {
        ok: true,
        code: "failed",
        success: false,
        message: `Failed at request new trips: ${err}`,
      };
    }
  }

  /**
   * request information of all trips and pass it to a handle class
   * @returns boolean of status
   */

  async modifyTripDataHandler(trip_id, trip_name = null, image_uri = null) {
    const modified_time = Date.now();
    try {
      const respond = await Trip.requestTripDataChange(
        trip_id,
        trip_name,
        image_uri,
        modified_time,
      );

      if (respond.status !== 200) {
        console.error("failed to save change in server", respond);
        return { status: false, message: respond.message };
      }
      // modify trip_name and image

      // save to
      let old_trip_data = CurrentTripDataService.getCurrentTripData();

      if (trip_name) {
        await safeRun(
          () => TripDataService.updateTripName(trip_name, trip_id),
          "failed_to_save_to_local_storage",
        );
        if (trip_id === CurrentTripDataService.getCurrentTripId()) {
          old_trip_data["trip_name"] = trip_name;
        }
      }
      if (image_uri) {
        const trip_image_uri = await safeRun(
          () =>
            CurrentTripDataService.setCurrentTripImageCoverToLocal(
              image_uri,
              trip_id,
            ),
          "trip_image_save_failed",
        );
        await safeRun(
          () => TripDataService.updateTripImage(trip_image_uri, trip_id),
          "failed_at_save_new_image_to_local",
        );
        if (trip_id === CurrentTripDataService.getCurrentTripId()) {
          old_trip_data["image"] = trip_image_uri;
        }
      }
      if (trip_id === CurrentTripDataService.getCurrentTripId()) {
        CurrentTripDataService.saveCurrentTripDataToLocal(old_trip_data);
      }
      await TripDataService.updateTripDataModifiedTime(modified_time, trip_id);
    } catch (err) {
      throw new Error("Failed ata request modify trip data");
    }
    return { status: true, message: "Success!" };
  }
  async requestRemoveTrip(trip_id) {
    // console.log("dete");
    const deleted_time = Date.now();
    let respond;
    try {
      respond = await Trip.requestRemoveTrip(trip_id, deleted_time);
      if (respond.status !== 200) {
        console.error("failed to remove trip in server", respond);

        return { status: false, message: respond.data.code };
      }
      await safeRun(
        () => TripDataService.removeTrip(trip_id),
        "failed to remove trip from local",
      );
      await safeRun(
        () => TripDataService.loadAllTripsListFromLocal(),
        "failed to load trip from local",
      );
      return { status: true, message: respond.data.code };
    } catch (err) {
      console.error("failed to remove trip");
      return { status: false, message: respond.code };
    }
  }
  /**
   * handle end trip
   * @returns
   */
  // currently depend on server
  async endTripHandler() {
    try {
      const current_time = Date.now();
      const trip_id = CurrentTripDataService.getCurrentTripId();
      // console.log("endTrip", trip_id);
      const forceSync = await safeRun(
        () => TripContentsHandler._forceRequestTripContentSync(trip_id),
        "failed_at_request_last_trip_sync_trip_data",
      );
      if (!forceSync) return false;
      const respond = await Trip.end_trip(current_time);

      await safeRun(
        () => CurrentTripDataService.endCurrentTrip(current_time),
        "failed_at_reset_current_trip_data",
      );
      await safeRun(
        () => trips.setTripEnd(current_time, trip_id),
        "failed_at_update_end_time",
      );
      GPSLogic.endGPSLogic();
      return true;
    } catch (err) {
      console.error("Failed to end trip", err);
      return false;
    }
  }
}
export default new TripActionHandler();
