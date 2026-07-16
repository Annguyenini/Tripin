import fetchFunction from "../fetch_function";
import * as API from '../../../config/config_api'
// using to get other users data
class UsersTrips {
  async getUsersTrips(user_id:number) {
    try {
      const response = await fetchFunction(API.GET_USERS_TRIPS + `/${user_id}`, {
        method:'GET'
      })
      return response
    }
    catch (err) {
      throw new Error(`Failed to get user: ${err}`)
    }

  }
}

export default new UsersTrips()
