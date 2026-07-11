import FriendShips from "../../../backend/services/friendships";

class FriendShipsHandler{
  async getFriendsHandler() {
    try {
      const response = await FriendShips.getFriends()
      if (!response.ok || response.status !== 200) return null

      const friendlist = response?.data?.friends_list
      return friendlist ??[]
    }
    catch (err) {
      console.log(`failed to get friend handle: ${err}`)
      return null
    }
  }
  async getIncomingFriendRequests() {
    try {
      const response = await FriendShips.getIncomingFriendRequests()
      if (!response.ok || response.status !== 200) return null

      const friendlist = response?.data?.incoming_friend_requests
      return friendlist ??[]
    }
    catch (err) {
      console.log(`failed to get friend handle: ${err}`)
      return null
    }
  }
  async getOutcomingFriendRequests() {
    try {
      const response = await FriendShips.getOutcomingFriendRequests()
      if (!response.ok || response.status !== 200) return null

      const friendlist = response?.data?.outcoming_friend_requests
      return friendlist ??[]
    }
    catch (err) {
      console.log(`failed to get friend handle: ${err}`)
      return null
    }
  }
  async getRelationship(target_user_id:number) {
    try {
      const response = await FriendShips.getRelationship(target_user_id)
      if (!response.ok || response.status !== 200) return null

      const relationship = response?.data?.relationship
      return relationship ??null
    }
    catch (err) {
      console.log(`failed to get relationship: ${err}`)
      return null
    }
  }
  async acceptFriendRequest(target_user_id) {
    try {
      const response = await FriendShips.acceptFriendRequest(target_user_id)
      if (!response.ok || response.status !== 200||response?.data?.status !== 'FRIEND') return false
      return true
    }
    catch (err) {
      console.log(`failed to accept friend: ${err}`)
      return false
    }
  }
  async requestFriend(target_user_id) {
    try {
      const response = await FriendShips.requestFriend(target_user_id)
      if (!response.ok || response.status !== 200||response?.data?.status !== 'REQ_1'||response?.data?.status !== 'REQ_2') return false
      return true
    }
    catch (err) {
      console.log(`failed to accept friend: ${err}`)
      return false
    }
  }
  async deleteRelationship(target_user_id) {
    try {
      const response = await FriendShips.deleteRelationship(target_user_id)
      if (!response.ok || response.status !== 200) return false
      return true
    }
    catch (err) {
      console.log(`failed to accept friend: ${err}`)
      return false
    }
  }
}
export default new FriendShipsHandler()
