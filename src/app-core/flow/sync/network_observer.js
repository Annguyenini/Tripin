import LocalStorage  from "../../../backend/storage/base/localStorage";
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
        this.notify(this.EVENTS.IS_SERVER_REACHABLE,state) 
    }
}
export default new NetworkObserver()