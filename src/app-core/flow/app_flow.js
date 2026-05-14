import { navigate } from "../../frontend/navigation/navigationService";
import AuthHandler from "./auth_handler";
import TripHandler from "./trip_handler";
import TripContentsHandler from "./legacy/trip_contents_handler";
import UserDataHandler from "./user_handler";
import Albumdb from "../../backend/storage/database/protected/legacy/albumdb";
import CurrentTripDataService from "../../backend/storage/hot_data/current_trip";
import TripDatabaseService from "../../backend/storage/database/protected/TripDatabaseService";
import TripContentsSync from "./sync/trip_contents_sync";
import TripContentsDatabase from "../../backend/storage/database/protected/trip_contents";
import LocalStorage from "../../backend/storage/base/localStorage";
import TripContentSyncManager from "./sync/trip_contents_sync_manager";
import safeRun from "../helpers/safe_run";
import { _registerNetworkCallback } from "./sync/network_observer";
import migration from "../../backend/storage/database/migrations/migration";
class AppFlow {
  constructor() {
    this.LocalStorage = new LocalStorage();
    _registerNetworkCallback(this.networkCallback.bind(this));
  }
  networkCallback(state) {
    console.log("network", state);
    if (state) this.syncCurrentTripContents();
  }
  async tokenAuthorization() {
    const loginViaToken = await AuthHandler.loginWithTokenHandler();
    if (!loginViaToken) {
      await this.LocalStorage.clearAllStorage();
      return false;
    }
    if (!(await this.onAuthSuccess())) return false;

    return true;
  }

  async onAuthSuccess() {
    await safeRun(
      () => UserDataHandler.GetUserDataHandler(),
      "failed_at_get_user_data",
    );
    // if (!requestUserData){ return false}
    // console.log('main')
    navigate("Permission");

    return true;
  }
  async onPermissionReady() {
    if (await this.initDBs()) navigate("Main");
  }
  async initDBs() {
    console.log("migration");
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
      return false;
    }
  }
  async onAppReady() {
    try {
      const currentTripIdAndVersion =
        await TripHandler.requestCurrentTripHandler();
      await safeRun(
        () => this.syncCurrentTripContents(),
        "failed_at_sync_trip_media",
      );
    } catch (err) {
      console.error("Failed too get current trip data");
    }
    return true;
  }

  async onRenderUserData() {
    const trips = await TripHandler.requestAllTripHandler();
    return;
  }

  // async onRenderCurrentLayoutsSuccess(){
  //     const currentTripCoors = await TripContentsHandler.requestCurrentTripCoordinatesHandler()
  //     const currentTripImage = await TripContentsHandler.requestCurrentTripMedias()
  //     const currentlocationCon = await TripContentsHandler.requestLocationConditionsHandler()
  //     return
  // }
  async syncCurrentTripContents() {
    const trip_id = CurrentTripDataService.getCurrentTripId();
    if (trip_id) {
      console.log("sync");
      await safeRun(
        () => TripContentSyncManager.tripMediaSyncHandler(trip_id),
        "faild_at_sync_trip_media",
      );
      await safeRun(
        () => TripContentSyncManager.tripCoordinateSync(trip_id),
        "faild_at_sync_trip_coordinate",
      );
      console.log("sync complete");
    }
    // await TripContentsSync.currentTripContentsSync(CurrentTripDataService.getCurrentTripId())
    // return
  }
}
export default new AppFlow();
