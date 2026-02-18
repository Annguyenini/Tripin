import NetworkObserver from '../../app-core/flow/sync/network_observer'
import * as API from '../../config/config_api'
import AuthService from './auth'
import TokenService from './token_service'
export default async function fetchFunction(url,options ={},retry =true){
    try{    
        const token = await TokenService.getToken('access_token')
        // console.log(token)
        // if(!token) return 
        const headers ={
            ...(options.headers ||{}),
        }
        if (token) headers['Authorization'] =`Bearer ${token}`
        console.log(headers)
        const respond = await fetch(url,{
            ...options,
            headers:headers
        }) 
        if(respond.status === 304){
            return ({'ok':true,'status':304,'data':null})
        }
        const data = await respond.json()

        if (respond.status ==401 && data.code ==='token_expired' && retry){
            console.log(respond,token)
            await AuthService.requestNewAccessToken() 
            return fetchFunction(url,options,false)        
        }
        NetworkObserver.setServerStatus(true)
        console.log(data)
        return({'ok':true,'status':respond.status,'data':data})
    }
    catch(err){
        console.error('Failed to fetch ', err)
        if(err instanceof TypeError && err.message ==='Network request failed'){
            NetworkObserver.setServerStatus(false)
        }
        return ({'ok':false})
    }
}