import FriendShips from "../../../backend/services/friendships";
import * as API from '../../../config/config_api'

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
  async getOverview() {
    try {
      const response = await FriendShips.getOverview()
      if (!response.ok || response.status !== 200) return null

      const friendlist = response?.data?.overview
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
      console.log(response)
      if (!response.ok || response.status !== 200) return false
      return true
    }
    catch (err) {
      console.log(`failed to accept friend: ${err}`)
      return false
    }
  }
  private async handleDeleteRelationship(
      target_user_id: number,
      endpoint: string
    ) {
      try {
        const response = await FriendShips.deleteRelationship(
          target_user_id,
          endpoint
        );

        if (!response.ok || response.status !== 200) return false;

        return true;
      } catch (err) {
        console.log(`failed to delete relationship: ${err}`);
        return false;
      }
    }

    async removeFriend(target_user_id: number) {
      return this.handleDeleteRelationship(
        target_user_id,
        API.REMOVE_FRIEND
      );
    }

    async rejectFriendRequest(target_user_id: number) {
      return this.handleDeleteRelationship(
        target_user_id,
        API.REJECT_FRIEND_REQUEST
      );
    }

    async cancelFriendRequest(target_user_id: number) {
      return this.handleDeleteRelationship(
        target_user_id,
        API.CANCEL_FRIEND_REQUEST
      );
    }

    async deleteRelationship(target_user_id: number) {
      return this.handleDeleteRelationship(
        target_user_id,
        API.DELETE_RELATIONSHIP
      );
    }
}
export default new FriendShipsHandler()
