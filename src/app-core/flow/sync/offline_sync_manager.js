import TripService from '../../../backend/services/trip'
import NetworkObserver from './network_observer'
class OfflineSyncManager {
    constructor(){
        this.requestQueue =[]
        this.EVENTS ={
            NEW_TRIP : 'new_trip',
            END_TRIP : 'end_trip',
        }
        NetworkObserver.attach(NetworkObserver.EVENTS.IS_SERVER_REACHABLE)
        this.syncing = false
    }
    /**
     * get object ready to push to queue
     * @param {*} event 
     * @param {*} data_object 
     * @param {*} create_time 
     * @returns 
     */
    getSyncObjectReady(event,data_object,create_time){
        return {
            event :event,
            data:data_object,
            create_time
        }
    }
    /**
     * push to the sync queue
     * @param {*} data_object 
     */
    pushEventToQueue(data_object){
        this.requestQueue.push(data_object)
        
    }
    // update for server reachable status
    update(new_state){
        if(new_state){
            this.processSync()
        }
        return
    }
    // process offlinep sync
    async processSync(){
        if(this.syncing) return
        this.syncing =true
        for(const event of this.requestQueue){
            let respond
            switch (event.event){
                case 'new_trip':
                    respond = await TripService.requestNewTrip(event.data.trip_name,event.data.image_uri)
                    break
                case 'end_trip':
                    respond = await TripService.end_trip(event.data.trip_id)
                    break
                default :
                    console.warn('Unkown event')
                    break
            }
            if (!respond.ok ) {
                console.warn('Failed to continues syncing')
                break
            }
            this.requestQueue.unshift()
        }   
        this.syncing =false
        return
            
    }
    destroy(){
        NetworkObserver.detach(NetworkObserver.EVENTS.IS_SERVER_REACHABLE)

    }
}

export default new OfflineSyncManager()