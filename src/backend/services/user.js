import * as API from '../../config/config_api'
// import UserData from '../../app-core/local_data/local_user_data'
import UserDataService from '../storage/user'
import TokenService from './token_service'
import AuthService from './auth'
import EtagService from './etag/etag_service'
import { ETAG_KEY } from './etag/etag_keys'
class UserService {

    async updateUserProfileImage(uri){
        const formdata = new FormData()
        const token = await TokenService.getToken('access_token')
        formdata.append('image',{
            uri:uri,
            name:`user${UserDataService.getUserId()}_profile_pic`,
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
    async getUserData(user_id){
        const token = await TokenService.getToken('access_token')
        const etag = await EtagService.getEtagFromLocal(ETAG_KEY.USERDATA)
        
        const headers ={
            'Authorization':`Bearer ${token}`
        }
        if (etag){
            headers['If-None-Match'] = etag
        }
        const respond = await fetch(API.GET_USER_DATA+``,{
            method:'GET',
            headers:headers
        })
        if(respond.status ===304){
            return ({'status':respond.status,'data':null})
        }
        const data = await respond.json()
        if(respond.status === 401){
            if(data.code ==='token_expired'){
                await AuthService.requestNewAccessToken()
                return this.getUserData(user_id)
            }
            else if(data.code === 'token_invalid'){
                return null
            }
        }
        else if(respond.status === 419){
            return null
        }
       
        return ({'status':respond.status,'data':data})
    }
}

const userService = new UserService()
export default userService