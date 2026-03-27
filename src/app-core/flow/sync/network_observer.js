import LocalStorage  from "../../../backend/storage/base/localStorage";

import * as API from '../../../config/config_api'
let _onNetworkUpdate = null
export const _registerNetworkCallback =(callback)=>{
    _onNetworkUpdate = callback
}
class NetworkObserver extends (LocalStorage){
    constructor(){
        super()
        this.EVENTS ={
            IS_SERVER_REACHABLE : 'is_server_reachable'
        }
        this.isReachable = null
    }
    setServerStatus(state){
        this.isReachable = state
        if(_onNetworkUpdate){
            _onNetworkUpdate(state)
        }
    }
    async callServer(){
        console.log('net callserver')
        try{
            const respone = await fetch(API.BASE_API,{
                method:'POST'
            })
            this.setServerStatus(true)
            // await app_flow.onAppReady()
        }
        catch(err){
            if (err instanceof TypeError && err.message === 'Network request failed') {
                this.setServerStatus(false)
            }  
        }
    }
}
export default new NetworkObserver()