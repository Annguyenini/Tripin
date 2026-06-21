import fetchFunction from "../services/fetch_function";
import * as API from "../../config/config_api";
import UserSettings from "../../types/user_settings.types";
class UserSettingsService {
  async GetUserSettings() {
    try {
      const response = await fetchFunction(API.USER_SETTINGS, {
        method: "GET",
      });
      return response;
    } catch (err) {}
  }
  async UpdateUserSetting(settings: UserSettings) {
    try {
      const response = await fetchFunction(API.USER_SETTINGS, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      return response;
    } catch (err) {}
  }
}

export default new UserSettingsService();
