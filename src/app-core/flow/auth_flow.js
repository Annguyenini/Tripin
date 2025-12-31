import Auth from '../../backend/services/auth'
import TokenService from '../../backend/services/token_service';
import { navigate } from '../../frontend/custom_function/navigationService';
import UserDataService from '../../backend/storage/user'
class AuthFlow{
    async loginHandler(username,password){
        const respond = await Auth.requestLogin(username,password)
        if(respond.status !=200) return respond.status;
        const data = respond.data
        const token = data.tokens
        await TokenService.deleteToken("access_token");
        await TokenService.deleteToken("refresh_token");
        await TokenService.setToken("refresh_token", token.refresh_token);
        await TokenService.setToken("access_token", token.access_token);

        navigate('main')

        const userdata ={
            user_id :data.user_data.user_id,
            user_name : data.user_data.user_name,
            display_name : data.user_data.display_name,
            role:data.user_data.role
        }

        await UserDataService.setUserData(userdata)
        if(data.user_data.avatar_uri){
            await UserDataService.downloadProfileImageUri(data.user_data.avatar_uri)
        }
       
        return respond.status;
    }
    async loginWithTokenHandler(){
        const res = await Auth.authenticateToken("access_token");
        const data =await res.data
        // console.log(data)
        if (res.status===401){
            if (data.code === "token_expired") {
                const tokendata = await this.authenticateToken("refresh_token");
            
                if (tokendata.status === 401) {
                    await TokenService.deleteToken("access_token");
                    await TokenService.deleteToken("refresh_token");
                return false;
                } 
                else if (tokendata.status === 200) {
                    await TokenService.deleteToken("access_token");
                    await Auth.requestNewAccessToken();
                    return await this.loginWithTokenHandler();
                }
            }
            
            else if (data.code === "token_invalid") {
                    await TokenService.deleteToken("access_token");
                    await TokenService.deleteToken("refresh_token");        
                    return false;
            }
        }
        if(res.status ===429){
            return false
        }
        navigate('Main')
        const userdata ={
            user_id: data.user_data.user_id,
            user_name: data.user_data.user_name,
            display_name: data.user_data.display_name
        }        

        await UserDataService.setUserData(userdata)
        if (data.user_data.avatar_uri){
            await UserDataService.setProfileImageUri(data.user_data.avatar_uri,'aws')

        }
        return true;
        };
    
}