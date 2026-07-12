import fetchFunction from "../fetch_function";
import * as API from '../../../config/config_api'
// using to get other users data
class Users {
  async searchUsers(keywords: string) {
    try {
      const response = await fetchFunction(API.SEARCH_USERS + `?keywords=${keywords}`, {
        method:'GET'
      })
      return response
    }
    catch (err) {
      throw new Error(`Failed to search users: ${err}`)
    }
  }
  async getUsersData(user_id:number) {
    try {
      const response = await fetchFunction(API.GET_USERS_DATA + `/${user_id}`, {
        method:'GET'
      })
      return response
    }
    catch (err) {
      throw new Error(`Failed to get user: ${err}`)
    }

  }
}

export default new Users()
