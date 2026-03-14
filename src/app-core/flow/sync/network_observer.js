import LocalStorage  from "../../../backend/storage/base/localStorage";
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
        this.items ={
            [this.EVENTS.IS_SERVER_REACHABLE] : null,
            set(key,value){
                this[key] = value
            },
            get(key){
                return this[key]
            }
        }
    }
    setServerStatus(state){
        this.items.set(this.EVENTS.IS_SERVER_REACHABLE,state)
        if(_onNetworkUpdate){
            _onNetworkUpdate(state)
        }
    }
}
export default new NetworkObserver()