import fetchFunction from "../../../backend/services/fetch_function";
import * as API from "../../../config/config_api";
import UserSettings from "../../../types/user_settings.types";
import UserSettingsService from "../../../backend/services/user_settings";
class UserSettingsHandler {
  async GetUserSettingsHandler(): Promise<UserSettings | null> {
    try {
      const response = await UserSettingsService.GetUserSettings();
      if (response.status !== 200) return null;
      return response?.data?.settings;
    } catch (err) {
      console.error(`fail to get user setting: ${err}`);
    }
  }
  async UpdateUserSettingHandler(settings: UserSettings): Promise<boolean> {
    try {
      const response = await UserSettingsService.UpdateUserSetting(settings);
      if (response.status !== 200) return false;
      return true;
    } catch (err) {
      console.error(`fail to update user setting: ${err}`);
    }
  }
}

export default new UserSettingsHandler();
