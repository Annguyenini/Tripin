import * as API from '../../config/config_api'
// import UserData from '../../app-core/local_data/local_user_data'
import UserDataService from '../storage/user'
import TokenService from './token_service'
import AuthService from './auth'
import EtagService from './etag/etag_service'
import { ETAG_KEY } from './etag/etag_keys'
import fetchFunction from './fetch_function'
class UserService {

    async updateUserProfileImage(uri){
        const formdata = new FormData()
        formdata.append('image',{
            uri:uri,
            name:`user${UserDataService.getUserId()}_profile_pic`,
            type:'image/jpeg'
        })
        // formdata.append('userdata',{
        //     user_id:user_id
        // })
        const respond = await fetchFunction(API.UPDATE_PROFILE_IMAGE,{
            method:'POST',
            body: formdata
        })
        return respond   
    }
    async getUserData(user_id){
        const etag = await EtagService.getEtagFromLocal(ETAG_KEY.USERDATA)
            
        const headers ={}
        if (etag){
            headers['If-None-Match'] = etag
        }
        const respond = await fetchFunction(API.GET_USER_DATA,{
            method:'GET',
            headers:headers
        })
        return respond
    }
    
}

const userService = new UserService()
export default userService