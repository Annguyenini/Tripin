import * as API from '../../config/config_api'
import UserData from '../../app-core/local_data/local_user_data'
import UserDataService from '../storage/user'
import TokenService from './token_service'
import AuthService from './auth'
class UserService {

    async updateUserProfileImage(uri){
        const formdata = new FormData()
        const token = await TokenService.getToken('access_token')
        formdata.append('image',{
            uri:uri,
            name:`user${UserData.user_id}_profile_pic`,
            type:'image/jpeg'
        })
        const respond = await fetch(API.UPDATE_PROFILE_IMAGE,{
            method:'POST',
            headers:{'Authorization':`Bearer ${token}`},
            body: formdata
        })
        const data = await respond.json()
        if(respond.status === 401){
            if(data.code ==='token_expired'){
                await AuthService.requestNewAccessToken()
                return this.updateUserProfileImage(uri)
            }
            else if(data.code === 'token_invalid'){
                return false
            }
        }
        else if(respond.status === 419){
            return false
        }
        else if(respond.status ===200){
            return true
        }   
    }
}

const userService = new UserService()
export default userService