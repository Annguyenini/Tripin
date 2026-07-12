import Users from "../../../../backend/services/users/users"

// using to get other user data
class UsersHandler{

  async searchUsers(keywords: string) {
    try{
      if (keywords.length < 3) return []
      const response = await Users.searchUsers(keywords)
      if (!response.ok || response.status !== 200) return null
      return response?.data?.users ?? []
    }
    catch (err) {
      console.log(`Failed to search for users: ${err}`)
      return null
    }
  }

  async getUsers(user_id: number) {
    try {
      if (!user_id) return null
      const response = await Users.getUsersData(user_id)
      if (!response.ok || response.status !== 200) return null
      return response?.data?.user_data ?? null
    }
    catch (err) {
      console.log(`Failed to get user data: ${err}`)
      return null
    }
  }
}
export default new UsersHandler()
