import Auth from "../../backend/services/auth";
import TokenService from "../../backend/storage/tokens/token_service";
import UserDataService from "../../backend/storage/database/user";
import { ETAG_KEY } from "../../backend/storage/etag/etag_keys";
import Etag_Service from "../../backend/storage/etag/etag_service";
class AuthHandler {
  async loginHandler(username, email, password) {
    const respond = await Auth.requestLogin(username, email, password);

    if (!respond.ok || respond.status != 200) return respond;
    const data = respond.data;
    const token = data.tokens;
    await TokenService.deleteToken("access_token");
    await TokenService.deleteToken("refresh_token");
    await TokenService.setToken("refresh_token", token.refresh_token);
    await TokenService.setToken("access_token", token.access_token);
    await UserDataService.setUserAuthToLocal(data.user_data);

    return respond;
  }
  async providerVerifyHandler(idToken, provider) {
    const respond = await Auth.providerVerify(idToken, provider);
    if (!respond.ok || respond.status != 200) return respond;
    const data = respond.data;
    const token = data.tokens;
    await TokenService.deleteToken("access_token");
    await TokenService.deleteToken("refresh_token");
    await TokenService.setToken("refresh_token", token.refresh_token);
    await TokenService.setToken("access_token", token.access_token);
    // console.log(data, respond);
    await UserDataService.setUserAuthToLocal(data.user_data);
    return respond;
  }
  async loginWithTokenHandler() {
    // this function will validate token and set user_id and role to local data
    // -----------request token validation with server-------
    const res = await Auth.authenticateToken("access_token");
    const data = await res.data;
    // ----------- if offline ------------------
    if (!res.ok) {
      return await this._offlineAuthHandler();
    }
    // --------------if token expired-----------
    if (res.status === 401) {
      //
      if (data.code === "token_expired") {
        //access_token expired case
        // request new access_token
        const tokendata = await Auth.authenticateToken("refresh_token");

        // if refresh token invalid or expired
        // delete both access_token and refresh_token from asyncsecure storage
        try {
          if (tokendata.status === 401) {
            await TokenService.deleteToken("access_token");
            await TokenService.deleteToken("refresh_token");
            return false;
          }
          // store new access_token in to storage
          else if (tokendata.status === 200) {
            await TokenService.deleteToken("access_token");
            await Auth.requestNewAccessToken();
            return await this.loginWithTokenHandler();
          } else if (!tokendata.ok || tokendata.code === "network_error") {
            return await this._offlineAuthHandler();
          }
        } catch (err) {
          console.error(err);
          return false;
        }
      }
      // token_invalid
      else if (data.code === "token_invalid") {
        try {
          await TokenService.deleteToken("access_token");
          await TokenService.deleteToken("refresh_token");
        } catch (err) {
          console.error("failed to delete access and refresh token", err);
        }
        return false;
      }
    }
    // rate limit hit
    if (res.status === 429) {
      return false;
    }
    //
    await UserDataService.setUserAuthToLocal(data.user_data);

    return true;
  }

  async signUpHandler(email, displayName, username, password) {
    const respond = await Auth.requestSignup(
      email,
      displayName,
      username,
      password,
    );
    return respond;
  }
  async signUpProviderHandler(pending_token, displayName, username, password) {
    const respond = await Auth.providerSignupComplete(
      pending_token,
      username,
      displayName,
      password,
    );
    return respond;
  }
  async emailVerificationHandler(email, code) {
    const respond = await Auth.requestVerification(email, code);
    return respond;
  }
  async _offlineAuthHandler() {
    // offline mode validation
    // using refresh token
    const { status } = await TokenService.verifyTokenOffline(
      await TokenService.getToken("refresh_token"),
    );
    if (!status) return false;
    await UserDataService.usingStoredUserAuth();
    return true;
  }
}

export default new AuthHandler();
