import { navigate } from "../../frontend/navigation/navigationService";
import AuthHandler from "./auth_handler";
import TripHandler from "./handlers/trip_handler";
import UserDataHandler from "./user_handler";
import TripContentsHander from "./trip_contents_handler";
import CurrentTripDataService from "../../backend/storage/hot_data/current_trip";
import TripDatabaseService from "../../backend/storage/database/protected/TripDatabaseService";
import TripContentsDatabase from "../../backend/storage/database/protected/trip_contents";
import LocalStorage from "../../backend/storage/base/localStorage";
import safeRun from "../helpers/safe_run";
import { _registerNetworkCallback } from "./sync/network_observer";
import migration from "../../backend/storage/database/migrations/migration";
import Album from "../../backend/storage/album/album";
import TripContentsSync from "./sync/trip_content_sync";
// Applow architecture could be found in /architecture
class AppFlow {
  constructor() {
    this.LocalStorage = new LocalStorage();
    _registerNetworkCallback(this.networkCallback.bind(this));
    this._fresh_start = true;
  }
  networkCallback(state) {
    if (this._fresh_start) return;
    if (state) this.syncCurrentTripContents();
  }
  async tokenAuthorization() {
    // this function call token verification and direct into next screen
    const loginViaToken = await AuthHandler.loginWithTokenHandler();
    // if not verrify, clear out LocalStorage asysnstorage (Not database)
    if (!loginViaToken) {
      await this.LocalStorage.clearAllStorage();
      return;
    }
    // direct into next screen
    if (!(await this.onAuthSuccess())) return;

    return;
  }

  async onAuthSuccess() {
    // on auth sucess, request userdata
    if (
      !(await safeRun(
        () => UserDataHandler.GetUserDataHandler(),
        "failed_at_get_user_data",
      ))
    ) {
      return false;
    }

    // if (!requestUserData){ return false}
    // console.log('main')
    // direct to permission screen
    navigate("Permission");

    return true;
  }
  async onPermissionReady() {
    try {
      if (!(await this.initDBs())) {
        navigate("auth");
      }
      if (!(await this.initAlbum())) {
        navigate("auth");
      }
      navigate("Main");
    } catch (err) {
      navigate("auth");
    }
  }
  async initAlbum() {
    try {
      await safeRun(() => Album.mergeAlbum(), "failed init album");
      return true;
    } catch (error) {
      throw new Error("failed to init user album");
    }
  }
  async initDBs() {
    // console.log("migration");
    try {
      await safeRun(
        () => TripDatabaseService.initTripTable(),
        "failed_at_create_trips_database",
      );
      await safeRun(
        () => TripContentsDatabase.initTable(),
        "failed_at_create_trip_contents_database",
      );
      await safeRun(() => migration(), "failed_at_migration");

      return true;
    } catch (err) {
      console.error(err);
      throw new Error("failed to init database");
    }
  }
  async onAppReady() {
    try {
      await safeRun(
        () => TripHandler.requestCurrentTripHandler(),
        "failed to handler trip data",
      );
      await safeRun(
        () => this.syncCurrentTripContents(),
        "failed_at_sync_trip_media",
      );
    } catch (err) {
      console.error("Failed too get current trip data");
    }
    return true;
  }
  async onRequestTrips() {
    const trips = await TripHandler.requestAllTripHandler();
    return;
  }
  async syncCurrentTripContents() {
    const trip_id = CurrentTripDataService.getCurrentTripId();
    if (trip_id) {
      // console.log("sync");
      await safeRun(
        () => TripContentsHander._requestTripContentSync(trip_id),
        "faild_at_sync_trip_contents",
      );

      console.log("sync complete");
    }

    return;
  }
}
export default new AppFlow();
