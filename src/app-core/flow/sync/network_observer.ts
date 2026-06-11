import LocalStorage from "../../../backend/storage/async_storage/localStorage";

import * as API from "../../../config/config_api";
let _onNetworkUpdate = [];
export const _registerNetworkCallback = (callback) => {
  _onNetworkUpdate.push(callback);
};
class NetworkObserver extends LocalStorage {
  private isReachable: boolean = false;
  constructor() {
    super();

    this.isReachable = false;
  }
  setServerStatus(state) {
    console.log("set", state);
    this.isReachable = state;
    if (_onNetworkUpdate.length >= 1) {
      _onNetworkUpdate.forEach((callback) => {
        callback(state);
      });
    }
  }
  async callServer() {
    try {
      const respone = await fetch(API.HEALTH, {
        method: "POST",
      });
      this.setServerStatus(true);
      // await app_flow.onAppReady()
    } catch (err) {
      if (
        err instanceof TypeError &&
        err.message === "Network request failed"
      ) {
        this.setServerStatus(false);
      }
    }
  }
}
export default new NetworkObserver();
