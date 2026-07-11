import fetchFunction from "./fetch_function";
import * as API from '../../config/config_api'
class FriendShips{
  async getFriends() {
    try{
    const response = await fetchFunction(API.GET_FRIENDS, {
      method:'GET'
    })
      return response
    }
    catch (err) {
      throw new Error(`Fail to fetch friends: ${err}`)
    }
  }
  async getIncomingFriendRequests() {
    try{
    const response = await fetchFunction(API.GET_INCOMING_FRIEND_REQUESTS, {
      method:"GET"
    })
      return response
    }
    catch (err) {
      throw new Error(`Fail to fetch incoming requests: ${err}`)
    }
  }
  async getOutcomingFriendRequests() {
    try{
    const response = await fetchFunction(API.GET_OUTCOMING_FRIEND_REQUESTS, {
      method:"GET"
    })
      return response
    }
    catch (err) {
      throw new Error(`Fail to fetch outcoming requests: ${err}`)
    }
  }
  async getRelationship(target_user_id: number) {
    try{
    const response = await fetchFunction(API.GET_RELATIONSHIP+`/${target_user_id}`, {
      method:"GET"
    })
      return response
    }
    catch (err) {
      throw new Error(`Fail to fetch relationship: ${err}`)
    }
  }
  async acceptFriendRequest(target_user_id: number) {
    try{
    const response = await fetchFunction(API.ACCEPT_FRIEND_REQUEST, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_user_id:target_user_id
      })
    })
      return response
    }
    catch (err) {
      throw new Error(`Fail to accept request: ${err}`)
    }
  }
  async requestFriend(target_user_id) {
    try{
    const response = await fetchFunction(API.REQUEST_FRIEND, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_user_id:target_user_id
      })
    })
      return response
    }
    catch (err) {
      throw new Error(`Fail to request friend: ${err}`)
    }
  }
  async deleteRelationship(target_user_id: number) {
    try{
    const response = await fetchFunction(API.DELETE_RELATIONSHIP, {
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_user_id:target_user_id
      })
    })
      return response
    }
    catch (err) {
      throw new Error(`Fail to accept request: ${err}`)
    }
  }
}

export default new FriendShips()
