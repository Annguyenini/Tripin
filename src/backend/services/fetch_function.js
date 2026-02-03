import * as API from '../../config/config_api'
import AuthService from './auth'
import TokenService from './token_service'
export default async function fetchFunction(url,options ={}){
    try{    
        const token = await TokenService.getToken('access_token')
        const headers ={
            ...(options.headers ||{}),
            'Authorization':`Bearer ${token}`
        }
        const respond = await fetch(url,{
            ...options,
            headers:headers
        }) 
        if(respond.status === 304){
            return ({'ok':true,'status':304,'data':null})
        }
        const data = await respond.json()

        if (respond.status ==401 && data.code ==='token_expried'){
            await AuthService.requestNewAccessToken() 
            return fetchFunction(url,options)        
        }

        return({'ok':true,'status':respond.status,'data':data})
    }
    catch(err){
        console.error('Failed to fetch ', err)
        return ({'ok':false})
    }
}