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
import UserSettingsLoader from "./user_settings/user_setting";

// Applow architecture could be found in /architecture
type Appstate =
  | "auth"
  | "permission"
  | "userdata"
  | "initTripDatabase"
  | "initTripContentsDatabase"
  | "migrationDatabases"
  | "initAlbum"
  | "userSettings"
  | "ready";

class AppFlow {
  // ─── State ──────────────────────────────────────────────────────────────
  private LocalStorage: LocalStorage;
  private state: Appstate;
  private network_state: boolean = false;
  private _contents_sync: boolean = false;
  private _firstAuthentication: boolean = true;

  constructor() {
    this.LocalStorage = new LocalStorage();
    _registerNetworkCallback(this.networkCallback.bind(this));
  }

  // ─── State Machine Dispatcher ───────────────────────────────────────────

  async nextStep() {
    switch (this.state) {
      case "permission":
        navigateToPermission();
        break;
      case "userdata":
        await this.userdataHandler();
        break;
      case "initTripDatabase":
        await this.initTripDatabaseHandler();
        break;
      case "initTripContentsDatabase":
        await this.initTripContentsDatabaseHandler();
        break;
      case "migrationDatabases":
        await this.migrationDatabasesHandler();
        break;
      case "initAlbum":
        await this.initAlbum();
        break;
      case "userSettings":
        await this.userSettingsLoader();
        break;
      case "ready":
        navigateToMain();
        break;
    }
  }

  // ─── Helper: advance state + continue the chain ────────────────────────

  private advance(next: Appstate): void {
    this.state = next;
    this.nextStep();
  }

  // ─── Helper: shared error handling for init steps ──────────────────────

  private handleInitError(label: string, error: unknown): void {
    console.error(`${label} failed:`, error);
    navigateToAuth();
  }

  // ─── Auth / Permission Entry Points ─────────────────────────────────────

  async tokenHandler(): Promise<void> {
    if (!this._firstAuthentication) return;
    this._firstAuthentication = false;

    const loginViaToken: boolean = await AuthHandler.loginWithTokenHandler();
    if (!loginViaToken) {
      await this.LocalStorage.clearAllStorage();
      return;
    }

    this.advance("permission");
  }

  onAuthSuccess(): void {
    // calling for login
    this.advance("permission");
  }

  onPermissionSuccess(): void {
    this.advance("userdata");
  }

  // ─── Init Steps ──────────────────────────────────────────────────────────

  async userdataHandler(): Promise<void> {
    const userDataHandler: boolean = await UserDataHandler.GetUserDataHandler();
    if (!userDataHandler) {
      // impliment error screen and return back to auth
      navigateToAuth();
      return;
    }
    this.advance("initTripDatabase");
  }

  async initTripDatabaseHandler(): Promise<void> {
    try {
      await TripDatabaseService.initTripTable();
      this.advance("initTripContentsDatabase");
    } catch (error) {
      // impliment error screen
      this.handleInitError("initTripDatabase", error);
    }
  }

  async initTripContentsDatabaseHandler(): Promise<void> {
    try {
      await TripContentsDatabase.initTable();
      this.advance("migrationDatabases");
    } catch (error) {
      // impliment error screen
      this.handleInitError("initTripContentsDatabase", error);
    }
  }

  async migrationDatabasesHandler(): Promise<void> {
    try {
      await migration();
      this.advance("initAlbum");
    } catch (error) {
      // impliment error screen
      this.handleInitError("migrationDatabases", error);
    }
  }

  async initAlbum(): Promise<void> {
    try {
      Album.mergeAlbum();
      this.advance("userSettings");
    } catch (error) {
      console.error("failed to init user album", error);
      throw new Error("failed to init user album");
    }
  }

  async userSettingsLoader(): Promise<void> {
    try {
      const onUserSettingReady = () => {
        this.advance("ready");
      };
      await UserSettingsLoader.loadUserSettings(onUserSettingReady);
    } catch (error) {
      console.error(`failed to load user setting ${error}`);
      throw new Error(`failed to load user setting ${error}`);
    }
  }

  // ─── App Ready / Trip Sync ───────────────────────────────────────────────

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
      await TripContentsSync.syncTripContentsHandler(trip_id);
      this._contents_sync = false;
      console.log("sync complete");
    }
  }

  // ─── Network Observer Callback ───────────────────────────────────────────

  networkCallback(state: boolean): void {
    if (state === this.network_state) return;
    this.network_state = state;
    if (state) this.syncCurrentTripContents();
  }
}

export default new AppFlow();
