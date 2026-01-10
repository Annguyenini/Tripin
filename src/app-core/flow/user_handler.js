import * as API from '../../config/config_api'
import UserService from '../../backend/services/user'
import tokenService from '../../backend/services/token_service'
import UserDataService from '../../backend/storage/user'
import EtagService from '../../backend/services/etag/etag_service'
import { ETAG_KEY } from '../../backend/services/etag/etag_keys'
class UserDataHandler{
    async GetUserDataHandler(){
        const user_id= UserDataService.getUserId()
        if (!user_id){
            const user_auth = await UserDataService.getUserAuthFromLocal()
            user_id = user_auth.user_id
            if(!user_id) return false
        }
        const respond = await UserService.getUserData(user_id)
        console.log(respond)
        if (respond.status ===304){
            await UserDataService.usingStoredUserData()
            return true
        }
        if (respond.status != 200){
            return false
        }
        const data = respond.data
        const userdata = data.user_data
        console.log('userdatdsa',userdata)
        if (userdata.avatar){
            userdata.avatar = await UserDataService.setProfileImageUriToLocal(userdata.avatar,'aws')
        }
        await UserDataService.setUserDataToLocal(userdata)

        const etag = data.etag
        if (etag){
            
            await EtagService.saveEtagToLocal(ETAG_KEY.USERDATA,etag)
        }
       return true
    }

}
export default new UserDataHandler()