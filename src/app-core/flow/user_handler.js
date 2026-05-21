import * as API from "../../config/config_api";
import UserService from "../../backend/services/user";
import tokenService from "../../backend/storage/tokens/token_service";
import UserDataService from "../../backend/storage/database/user";
import EtagService from "../../backend/storage/etag/etag_service";
import { ETAG_KEY } from "../../backend/storage/etag/etag_keys";
import safeRun from "../helpers/safe_run";
class UserDataHandler {
  async GetUserDataHandler() {
    try {
      let user_id = UserDataService.getUserId();
      if (!user_id) {
        const user_auth = await UserDataService.getUserAuthFromLocal();
        user_id = user_auth.user_id;
        if (!user_id) return false;
      }
      const respond = await UserService.getUserData(user_id);
      if (!respond.ok || respond.status === 304) {
        await UserDataService.usingStoredUserData();
        return true;
      }
      if (respond.status != 200) {
        return false;
      }
      const data = respond.data;
      let userdata = data.user_data;
      console.log(userdata);
      if (userdata.avatar) {
        userdata.avatar = await UserDataService.setProfileImageUriToLocal(
          userdata.avatar,
          "aws",
        );
      }
      await UserDataService.setUserDataToLocal(userdata);

      const etag = data.etag;
      if (etag) {
        await EtagService.saveEtagToLocal(ETAG_KEY.USERDATA, etag);
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async ChangeUserUserAvatarHandler(uri) {
    try {
      const modified_time = Date.now();
      const presign_url_respond = await UserService._requestAvatarPresignUrl();
      if (!presign_url_respond.ok || presign_url_respond.status !== 201)
        return presign_url_respond;

      const presign_url = presign_url_respond?.data?.presign_url;
      const pending_token = presign_url_respond?.data?.pending_token;

      if (!presign_url || !pending_token) {
        throw new TypeError("Presign url or pending_token is null");
      }

      const put_avatar_to_cloud = await safeRun(() =>
        UserService._putAvatarToCloud(presign_url, uri),
      );
      console.log(put_avatar_to_cloud, uri);
      if (put_avatar_to_cloud.status !== 200) {
        throw new Error("Faield to put avatar into cloud");
      }

      const complete_update_avatar = await safeRun(
        () => UserService._compeleteUpdateAvatar(pending_token, modified_time),
        "failed to request complete update avatar",
      );
      console.log(complete_update_avatar, pending_token, modified_time);

      if (!complete_update_avatar.ok || complete_update_avatar.status !== 200) {
        return complete_update_avatar;
      }

      await safeRun(
        () => UserDataService.setProfileImageUriToLocal(uri),
        "failed to save new avatar to local",
      );

      return complete_update_avatar;
    } catch (err) {
      console.error(err.message);
      return { message: "Failed to update user avartar", status: 500 };
    }
  }
}
export default new UserDataHandler();
