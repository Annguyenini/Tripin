import Trip from "../../../backend/services/trip";
import TripDataService from "../../../backend/storage/database/trips";
import CurrentTripDataService from "../../../backend/storage/hot_data/current_trip";
import UserDataService from "../../../backend/storage/async_storage/user";
import EtagService from "../../../backend/storage/etag/etag_service";
import {
  ETAG_KEY,
  GENERATE_TRIP_ETAG_KEY,
} from "../../../backend/storage/etag/etag_keys";
import safeRun from "../../helpers/safe_run";

class TripHandler {
  // ─── All Trips ────────────────────────────────────────────────────────────

  /**
   * Fetch all trips from server with etag caching.
   * Falls back to local data on 304 or network failure.
   * Deletes etag and retries if local fallback also fails.
   * @returns {Promise<boolean>}
   */
  async requestAllTripHandler(): Promise<boolean> {
    const respond = await safeRun(
      () => Trip.requestTripsData(),
      "fetch_trips_failed",
    );

    // not modified or failed — try local cache
    // if local not work, retry by calling refresh
    if (!respond.ok || respond.status === 304) {
      try {
        await TripDataService.loadAllTripsListFromLocal();
        return true;
      } catch (err) {
        console.error("failed to load from local", err);
        return await this.refreshAllTripsData();
      }
    }

    if (respond.status !== 200) return false;

    const data = respond.data;

    // no trips returned — nothing to save
    if (!data.all_trip_data) return true;

    // save trips and etag to local
    try {
      await TripDataService.handleAllTripsList(data.all_trip_data);
      if (data.etag)
        await EtagService.saveEtagToLocal(ETAG_KEY.ALL_TRIPS_LIST, data.etag);
    } catch (err) {
      console.error(err);
      return false;
    }

    return true;
  }

  /**
   * Force refresh all trips by busting the etag then re-fetching.
   * @returns {Promise<boolean>}
   */
  async refreshAllTripsData() {
    await EtagService.deleteEtagFromLocal(ETAG_KEY.ALL_TRIPS_LIST);
    return await this.requestAllTripHandler();
  }

  // ─── Current Trip ─────────────────────────────────────────────────────────

  /**
   * Fetch the active trip id, then fetch and save its full trip data locally.
   * Falls back to local cache on failure or 304.
   * Deletes etag and retries if local fallback fails.
   * @returns {Promise<boolean>}
   */
  async requestCurrentTripHandler() {
    // step 1: get active trip id
    const respond = await safeRun(
      () => Trip.requestCurrentTripId(),
      "fetch_current_trip_id_failed",
    );

    // failed to get trip id — fall back to local
    if (!respond.ok || respond.status !== 200) {
      await safeRun(
        () => CurrentTripDataService.loadCurrentTripDataFromLocal(),
        "load_local_trip_failed",
      );
    }

    const data = respond.data;
    const trip_id = data.current_trip_id;

    // step 2: fetch full trip data if trip is active
    if (trip_id) {
      const current_trip_respond = await safeRun(
        () => Trip.requestTripData(trip_id),
        "fetch_trip_data_failed",
      );

      const status = current_trip_respond.status;

      // not modified — reuse local cache
      if (status === 304) {
        if (
          !(await safeRun(
            () => CurrentTripDataService.loadCurrentTripDataFromLocal(),
            "load_local_trip_failed",
          ))
        ) {
          // local also failed — bust etag and retry
          await safeRun(
            () =>
              EtagService.deleteEtagFromLocal(GENERATE_TRIP_ETAG_KEY(trip_id)),
            "delete_etag_failed",
          );
          return await this.requestCurrentTripHandler();
        }
        return true;
      }

      const current_trip_data = current_trip_respond.data;
      let trip_data = current_trip_data.trip_data;

      // step 3: save trip data and cover image locally
      if (trip_data) {
        let trip_image_uri = null;

        // download and cache cover image if present
        if (trip_data.image) {
          trip_image_uri = await safeRun(
            () =>
              CurrentTripDataService.setCurrentTripImageCoverToLocal(
                trip_data.image,
                data.current_trip_id,
                "aws",
              ),
            "save_image_failed",
          );
        }

        trip_data["image"] = trip_image_uri;

        // save to hot data (in-memory) and persistent database
        await safeRun(
          () => CurrentTripDataService.saveCurrentTripDataToLocal(trip_data),
          "current_trip_save_failed",
        );
        await safeRun(
          () => TripDataService.saveTripDataToLocal(trip_data),
          "failed_at_save_to_database",
        );
      }

      // save etag for future 304 checks
      await safeRun(
        () =>
          EtagService.saveEtagToLocal(
            GENERATE_TRIP_ETAG_KEY(trip_id),
            current_trip_data.etag,
          ),
        "save_etag_failed",
      );
    }

    return true;
  }

  // ─── Single Trip ──────────────────────────────────────────────────────────

  /**
   * Fetch a single trip by id. Falls back to local on 304 or failure.
   * @param {string} trip_id
   * @returns {Promise<object|null>} trip data or null on unrecoverable failure
   */
  async requestTripDataHandler(trip_id) {
    const user_id = UserDataService.getUserId();
    const respond = await Trip.requestTripData(trip_id);

    // not modified or failed — return local copy
    if (!respond.ok || respond.status === 304) {
      return await TripDataService.getTripDataFromLocal(user_id, trip_id);
    }

    if (respond.status !== 200) return null;

    const data = respond.data;
    return data.trip_data;
  }

  // ─── Sharing ──────────────────────────────────────────────────────────────

  /**
   * Request a shareable link for a trip.
   * @param {string} trip_id
   * @returns {Promise<{status: boolean, message: string, url?: string}>}
   */
  async requestSharedTripLink(trip_id) {
    const res = await Trip.requestSharedTripLink(trip_id);
    if (res.status !== 200) return { status: false, message: res.message };
    return { status: true, message: res.data.message, url: res.data.url };
  }
}

export default new TripHandler();
