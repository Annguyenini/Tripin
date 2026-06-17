import {
  navigate,
  navigateToAuth,
  navigateToMain,
  navigateToPermission,
} from "../../frontend/navigation/navigationService";
import AuthHandler from "./auth_handler";
import TripHandler from "./handlers/trip_handler";
import UserDataHandler from "./user_handler";
import TripContentsHander from "./handlers/trip_contents/trip_contents_handler";
import CurrentTripDataService from "../../backend/storage/hot_data/current_trip";
import TripDatabaseService from "../../backend/storage/database/protected/trip_database_service";
import TripContentsDatabase from "../../backend/storage/database/protected/trip_contents";
import LocalStorage from "../../backend/storage/async_storage/localStorage";
import safeRun from "../helpers/safe_run";
import { _registerNetworkCallback } from "./sync/network_observer";
import migration from "../../backend/storage/database/migrations/migration";
import Album from "../../backend/storage/album/album";
import TripContentsSync from "./sync/trip_content_sync";
// Applow architecture could be found in /architecture
type Appstate =
  | "auth"
  | "permission"
  | "userdata"
  | "initTripDatabase"
  | "initTripContentsDatabase"
  | "migrationDatabases"
  | "initAlbum"
  | "ready";

class AppFlow {
  private LocalStorage: LocalStorage;
  private _contents_sync: boolean = false;
  private _firstAuthentication: boolean = true;
  private state: Appstate;
  private network_state: boolean = false;
  constructor() {
    this.LocalStorage = new LocalStorage();
    _registerNetworkCallback(this.networkCallback.bind(this));
  }

  networkCallback(state: boolean): void {
    if (state === this.network_state) return;
    this.network_state = state;
    if (state) this.syncCurrentTripContents();
    // this._fresh_start = false;
  }

  async nextStep() {
    switch (this.state) {
      case "permission":
        console.log(1);
        navigateToPermission();
        break;
      case "userdata":
        console.log(2);

        await this.userdataHandler();
        break;
      case "initTripDatabase":
        console.log(3);

        await this.initTripDatabaseHandler();
        break;
      case "initTripContentsDatabase":
        console.log(4);

        await this.initTripContentsDatabaseHandler();
        break;
      case "migrationDatabases":
        console.log(5);

        await this.migrationDatabasesHandler();
        break;
      case "initAlbum":
        console.log(6);

        await this.initAlbum();
      case "ready":
        navigateToMain();
        break;
    }
  }

  async tokenHandler(): Promise<void> {
    if (this._firstAuthentication) {
      this._firstAuthentication = false;
      const loginViaToken: boolean = await AuthHandler.loginWithTokenHandler();
      if (!loginViaToken) {
        await this.LocalStorage.clearAllStorage();
        return;
      }

      this.state = "permission";
      this.nextStep();
    }
    return;
  }

  onAuthSuccess(): void {
    // calling for login
    this.state = "permission";
    this.nextStep();
  }

  onPermissionSuccess(): void {
    this.state = "userdata";
    this.nextStep();
  }

  async userdataHandler(): Promise<void> {
    const userDataHandler: boolean = await UserDataHandler.GetUserDataHandler();
    if (!userDataHandler) {
      // impliment error screen and return back to auth
      navigateToAuth();
    }
    this.state = "initTripDatabase";
    this.nextStep();
  }

  async initTripDatabaseHandler() {
    try {
      await TripDatabaseService.initTripTable();
      this.state = "initTripContentsDatabase";
      this.nextStep();
    } catch (error) {
      console.error(error);
      // impliment error screen
      navigateToAuth();
      return;
    }
  }

  async initTripContentsDatabaseHandler() {
    try {
      await TripContentsDatabase.initTable();
      this.state = "migrationDatabases";
      this.nextStep();
    } catch (error) {
      console.error(error);
      // impliment error screen
      navigateToAuth();
      return;
    }
  }

  async migrationDatabasesHandler() {
    try {
      await migration();
      this.state = "initAlbum";
      this.nextStep();
    } catch (error) {
      console.error(error);
      // impliment error screen
      navigateToAuth();
      return;
    }
  }

  async initAlbum(): Promise<void> {
    try {
      Album.mergeAlbum();
      this.state = "ready";
      this.nextStep();
    } catch (error) {
      console.error("failed to init user album", error);
      throw new Error("failed to init user album");
    }
  }

  async onAppReady(): Promise<boolean> {
    try {
      await TripHandler.requestCurrentTripHandler();
      // await this.syncCurrentTripContents();
    } catch (err) {
      console.error(`Failed to get current trip data: ${err}`);
    }
    return true;
  }
  async onRequestTrips(): Promise<void> {
    const trips = await TripHandler.requestAllTripHandler();
    return;
  }
  async syncCurrentTripContents(): Promise<void> {
    console.log("sync", this.state);
    if (this._contents_sync || this.state !== "ready") return;
    const trip_id = CurrentTripDataService.getCurrentTripId();
    if (trip_id) {
      this._contents_sync = true;
      // console.log("sync");
      await TripContentsSync.syncTripContentsHandler(trip_id);
      this._contents_sync = false;
      console.log("sync complete");
    }

    return;
  }
}
export default new AppFlow();
