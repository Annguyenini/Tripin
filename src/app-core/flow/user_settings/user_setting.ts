// purpose of the class is to load user setting that recieve from server before render map

import { navigateToTutorial } from "../../../frontend/navigation/navigationService";
import UserSettings from "../../../types/user_settings.types";
import UserSettingsHandler from "../handlers/user_settings_handler";

type UserSettingsLoaderSteps = "boarding" | "ready";
class UserSettingsLoader {
  private UserSettings: UserSettings | null;
  private state: UserSettingsLoaderSteps;
  private onDone: () => void;
  // this function is for load seting and use to call back to return call the app flow
  async loadUserSettings(callback) {
    const user_settings = await UserSettingsHandler.GetUserSettingsHandler();
    this.UserSettings = user_settings;
    console.log(user_settings);
    // if fail to get setting we process with out loading
    if (user_settings && !user_settings.has_seen_onboarding) {
      this.state = "boarding";
    } else {
      this.state = "ready";
    }
    this.onDone = callback;
    await this.nextStep();
  }
  // this will action a list of task
  async nextStep() {
    switch (this.state) {
      case "boarding":
        navigateToTutorial();
        break;
      case "ready":
        this.onDone();
    }
  }

  // finish boarding, send to server and continues
  async _onFinishBoarding() {
    const settings: UserSettings = { has_seen_onboarding: true };
    try {
      await UserSettingsHandler.UpdateUserSettingHandler(settings);
    } catch (err) {
      console.error(err);
    }
    this.state = "ready";
    this.nextStep();
  }
}

export default new UserSettingsLoader();
