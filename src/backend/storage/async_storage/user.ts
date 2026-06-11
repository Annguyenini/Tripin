import { DATA_KEYS } from "../hot_data/keys/storage_keys";
import { STORAGE_KEYS } from "../hot_data/keys/storage_keys";

import LocalStorage from "./localStorage";
import { UserAuthorization, UserData } from "../../../types/user_data.types";

class UserDataService extends LocalStorage {
  private user_data: UserData | null;
  private user_authorization: UserAuthorization | null;

  constructor() {
    super();
    this.user_data = null;
    this.user_authorization = null;
  }

  // ========================Get Value==============================

  getUserId() {
    return this.user_authorization?.user_id;
  }

  getUserName() {
    return this.user_data?.user_name;
  }

  getDisplayName() {
    return this.user_data?.display_name;
  }

  /** getUserData
   * @returns an object of userdata or null if it empty
   */
  getUserDataFromLocal() {
    return this.getDataObjectFromLocal(STORAGE_KEYS.USER.USER_DATA);
  }

  getUserAvatarPath() {
    return `user${this.getUserId()}_profile.jpg`;
  }

  async getUserAuthFromLocal() {
    const user_auth = await this.getDataObjectFromLocal(
      STORAGE_KEYS.USER.USER_ROLE,
    );

    return user_auth;
  }

  getProfileImageUri() {
    return this.user_data?.avatar;
  }

  // ==========================Trigger notification================

  notifyNewData() {
    this.notify(DATA_KEYS.USER.USER_DATA, this.user_data);
  }

  // ==========================Set Value===========================

  setDisplayName(new_display_name: string) {
    if (!this.user_data) return;

    this.user_data.display_name = new_display_name;
    this.notifyNewData();
  }

  async saveProfileImageUriToLocal(
    uri: string,
    location: "local" | "remote" = "local",
  ) {
    if (!uri) return;

    let destination: string;

    // if image from local we only save because likely it from temp produce from camera
    if (location === "local") {
      destination = await this.saveImageToLocal(uri, this.getUserAvatarPath());
    }
    // if it from outside scope like server
    // we have to download it
    else {
      destination = await this.downloadImageToLocal(
        uri,
        this.getUserAvatarPath(),
      );
    }

    return destination;
  }

  /** Set user data
   * @param {object} userdata - must be an object
   */
  async saveUserDataToLocal(userdata: UserData) {
    try {
      await this.saveDataObjectToLocal(STORAGE_KEYS.USER.USER_DATA, userdata);
    } catch (err) {
      throw new Error(`fail to save user data to local: ${String(err)}`);
    }

    this.user_data = userdata;
    this.notify(DATA_KEYS.USER.USER_DATA, userdata);
  }

  async setUserAuthToLocal(userdata: UserAuthorization) {
    try {
      await this.saveDataObjectToLocal(STORAGE_KEYS.USER.USER_ROLE, userdata);
    } catch (err) {
      throw new Error(
        `fail to set user authorization to local: ${String(err)}`,
      );
    }

    this.user_authorization = userdata;
  }

  /**
   * using stored value when it match version or stored
   * @returns
   */
  async usingStoredUserData() {
    try {
      const stored_userdata = await this.getDataObjectFromLocal(
        STORAGE_KEYS.USER.USER_DATA,
      );

      await this.saveUserDataToLocal(stored_userdata);
    } catch (err) {
      throw new Error(`fail to reuse user data from local: ${String(err)}`);
    }
  }

  async usingStoredUserAuth() {
    try {
      const stored_userauth = await this.getUserAuthFromLocal();
      await this.setUserAuthToLocal(stored_userauth);
    } catch (err) {
      throw new Error(
        `fail to reuse user authorization from local: ${String(err)}`,
      );
    }

    return;
  }

  /**
   *
   */
  async deleteUserDataFromLocal() {
    try {
      let keys_array = await this.getAllKeys();

      keys_array = keys_array.filter((key: string) => key.includes("user."));

      for (const key of keys_array) {
        await this.deleteDataFromLocal(key);
      }

      this.user_data = null;
      this.user_authorization = null;

      this.notifyNewData();
    } catch (err) {
      throw new Error(`failed to delete user keys in local: ${String(err)}`);
    }
  }

  async deleteProfileImage() {
    try {
      await this.deleteImageFromLocal(this.getUserAvatarPath());
    } catch (err) {
      throw new Error(`fail to delete avatar from local: ${String(err)}`);
    }
  }

  async deleteAllUserData() {
    try {
      await this.deleteProfileImage();
      await this.deleteUserDataFromLocal();
    } catch (err) {
      this.clearAllStorage();
    }
  }
}

const user = new UserDataService();

export default user;
