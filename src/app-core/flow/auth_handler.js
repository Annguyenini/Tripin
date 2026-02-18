import Auth from '../../backend/services/auth'
import TokenService from '../../backend/services/token_service';
import { navigate } from '../../frontend/custom_function/navigationService';
import UserDataService from '../../backend/storage/user'
import { ETAG_KEY } from '../../backend/services/etag/etag_keys';
import Etag_Service from '../../backend/services/etag/etag_service';
class AuthHandler{
    async loginHandler(username,password){
        const respond = await Auth.requestLogin(username,password)
        
        if(!respond.ok || respond.status !=200) return respond;
        const data = respond.data
        const token = data.tokens
        console.log('new tokesn',token)
        await TokenService.deleteToken("access_token");
        await TokenService.deleteToken("refresh_token");
        await TokenService.setToken("refresh_token", token.refresh_token);
        await TokenService.setToken("access_token", token.access_token);
        await UserDataService.setUserAuthToLocal(data.user_data)
       
        return respond;
    }

    async loginWithTokenHandler(){
        const userdata_etag = await Etag_Service.getEtagFromLocal(ETAG_KEY.USERDATA) 
        
        const res = await Auth.authenticateToken("access_token",userdata_etag);
        if(!res.ok )return false
        const data =await res.data
        console.log('via token', data)
        if (res.status===401){
            if (data.code === "token_expired") {
                const tokendata = await Auth.authenticateToken("refresh_token");
            
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
        console.log(data.user_data)
        await UserDataService.setUserAuthToLocal(data.user_data)

        return true;
    
    };

    async signUpHandler(email,displayName,username,password){
        const respond = await Auth.requestSignup(email,displayName,username,password);
        return(respond)
    }
    async emailVerificationHandler(email,code){
        const respond = await Auth.requestVerifycation(email,code)
        return respond
    }
    
}

export default  new AuthHandler()