import * as API from "../../config/config_api";
// import UserData from '../../app-core/local_data/local_user_data'
import UserDataService from "../storage/async_storage/user";
import TokenService from "../storage/tokens/token_service";
import AuthService from "./auth";
import EtagService from "../storage/etag/etag_service";
import { ETAG_KEY } from "../storage/etag/etag_keys";
import fetchFunction from "./fetch_function";
import safeRun from "../../app-core/helpers/safe_run";
import * as ImageManipulator from "expo-image-manipulator";

class UserService {
  async _requestAvatarPresignUrl() {
    const respond = await fetchFunction(
      API.REQUEST_UPDATE_PROFILE_PRESIGN_URL,
      {
        method: "GET",
      },
    );
    return respond;
  }
  async _putAvatarToCloud(presign_url, uri) {
    try {
      const content_type = "image/jpeg";

      const resizedPhoto = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1920 } }], // resize to width of 300 and preserve aspect ratio
        { compress: 0.9, format: "jpeg" },
      );
      // console.log(resizedPhoto);
      const image = await fetch(resizedPhoto.uri);

      const blob = await image.blob();

      const respond = await fetch(presign_url, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": content_type },
      });

      return respond;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async _compeleteUpdateAvatar(pending_token, modified_time) {
    const respond = await fetchFunction(API.REQUEST_COMPLETE_UPDATE_PROFILE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pending_token: pending_token,
        modified_time: modified_time,
      }),
    });
    return respond;
  }

  async getUserData(user_id) {
    const etag = await EtagService.getEtagFromLocal(ETAG_KEY.USERDATA);

    const headers = {};
    if (etag) {
      headers["If-None-Match"] = etag;
    }
    const respond = await fetchFunction(API.GET_USER_DATA, {
      method: "GET",
      headers: headers,
    });
    return respond;
  }
  async requestDeleteUser() {
    const headers = {};

    const respond = await fetchFunction(API.REQUEST_DELETE_USER, {
      method: "POST",
      headers: headers,
    });
    return respond;
  }
  async deleteUser(code) {
    const respond = await fetchFunction(API.DELETE_USER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code }),
    });
    return respond;
  }
}

const userService = new UserService();
export default userService;
