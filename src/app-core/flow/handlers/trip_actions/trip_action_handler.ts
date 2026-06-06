import Trip from "../../../../backend/services/trip";
import TripDataService from "../../../../backend/storage/database/trips";
import CurrentTripDataService from "../../../../backend/storage/hot_data/current_trip";
import UserDataService from "../../../../backend/storage/async_storage/user";
import GPSLogic from "../../../../backend/gps_logic/gps_logic";
import safeRun from "../../../helpers/safe_run";
import trips from "../../../../backend/storage/database/trips";
import TripContentsHandler from "../trip_contents/trip_contents_handler";
import { CreateNewTripHandler } from "../../../../types/trip_actions_handler.types";
import { Trip_Data } from "../../../../types/trip_data.types";
import TripContentsSync from "../../sync/trip_content_sync";
interface newTripData {
  trip_id: string;
  presign_url: string | undefined;
  pending_token: string | undefined;
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
        imageUri,
      );
      const data: newTripData = respond.data;

      if (!(respond.status === 200 || respond.status === 201))
        return {
          code: data.code,
          message: data.message,
          ...respond,
        };
      // if success fully send to server, process to store in the local

      // data from server
      const trip_id = Number(data.trip_id);

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

        //---------------------Phase 3--------------------------
        //if verify fail return fail and only save data without image
        const pending_token = data?.pending_token;
        const verify_upload = await Trip.verifyTripCoverImageUpload(
          pending_token,
          created_time,
        );
        if (verify_upload.status === 200) {
          trip_image_uri =
            await CurrentTripDataService.setCurrentTripImageCoverToLocal(
              imageUri,
              trip_id,
            );
        } else {
          console.warn("fail to verify image with server");
        }
      }
      // ----------------------save data to local--------------------
      const local_trip_data: Trip_Data = {
        user_id: user_id,
        trip_id: trip_id,
        trip_name: trip_name,
        image: trip_image_uri,
        created_time: created_time,
        active: true,
        event: "add",
      };
      // console.log(trip_data);
      // save tripdata to local
      // hot data
      await CurrentTripDataService.saveCurrentTripDataToLocal(local_trip_data);
      // database
      await TripDataService.saveTripDataToLocal(local_trip_data);

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
    // ------------------------- Phase 1: update trip name -------------------------
    let respond = null;
    const phase1_modified_time = Date.now();
    try {
      respond = await Trip.requestTripDataChange(
        trip_id,
        trip_name,
        image_uri,
        phase1_modified_time,
      );
      if (!(respond.status === 201 || respond.status === 200)) {
        console.error("failed to save change in server", respond);
        return { success: false, message: respond.data?.message };
      }
      if (trip_name) {
        if (!(await TripDataService.updateTripName(trip_name, trip_id))) {
          return { success: false, message: "fail to update trip name" };
        }
        await TripDataService.updateTripDataModifiedTime(
          phase1_modified_time,
          trip_id,
        );
      }
    } catch (err) {
      return { success: false, message: `phase 1 failed: ${err}` };
    }

    // -------------------- Phase 2 & 3: upload and verify image -------------------
    if (image_uri) {
      const phase2_modified_time = Date.now();
      try {
        const presign_url = respond.data?.presign_url;
        const pending_token = respond.data?.pending_token;

        const upload_image = await Trip.uploadTripCoverImage(
          presign_url,
          image_uri,
        );
        console.log(upload_image);

        if (upload_image?.status !== 200)
          return { success: false, message: "fail to upload trip image" };

        const verify_update = await Trip.verifyTripCoverImageUpload(
          pending_token,
          phase2_modified_time,
        );
        console.log(verify_update);
        if (verify_update.status !== 200)
          return { success: false, message: "fail to verify trip image" };

        const filename = `${trip_id}_cover.jpg`;
        const trip_image_uri = await TripDataService.saveImageToLocal(
          image_uri,
          filename,
        );
        if (!trip_image_uri)
          return { success: false, message: "fail to generate trip image uri" };

        if (!(await TripDataService.updateTripImage(trip_image_uri, trip_id)))
          return {
            success: false,
            message: "fail to update trip image in database",
          };

        await TripDataService.updateTripDataModifiedTime(
          phase2_modified_time,
          trip_id,
        );

        // update hot data if this is the current trip
        if (trip_id === CurrentTripDataService.getCurrentTripId()) {
          const old_trip_data = CurrentTripDataService.getCurrentTripData();
          old_trip_data["image"] = trip_image_uri;
          if (trip_name) old_trip_data["trip_name"] = trip_name;
          CurrentTripDataService.saveCurrentTripDataToLocal(old_trip_data);
        }
      } catch (err) {
        return { success: false, message: `phase 2/3 failed: ${err}` };
      }
    } else {
      // update hot data for name-only change
      if (trip_name && trip_id === CurrentTripDataService.getCurrentTripId()) {
        const old_trip_data = CurrentTripDataService.getCurrentTripData();
        old_trip_data["trip_name"] = trip_name;
        CurrentTripDataService.saveCurrentTripDataToLocal(old_trip_data);
      }
    }

    return { success: true, message: "Success!" };
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
      const forceSync = await TripContentsSync.syncTripContentsHandler(trip_id);
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
