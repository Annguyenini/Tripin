import UserTripContents from "../../../../backend/services/users/users_trips"
// using to get other user data
class UsersTripsHandler{
  async getUsersTrips(user_id: number) {
    try {
      if (!user_id) return null
      const response = await UserTripContents.getUsersTrips(user_id)
      if (!response.ok || response.status !== 200) return null
      return response?.data?.all_trip_data ?? null
    }
    catch (err) {
      console.log(`Failed to get user data: ${err}`)
      return null
    }
  }
}
export default new UsersTripsHandler()
