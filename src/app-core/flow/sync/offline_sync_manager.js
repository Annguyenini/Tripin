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
    }
    getSyncObjectReady(event,data_object,create_time){
        return {
            event :event,
            data:data_object,
            create_time
        }
    }
    pushEventToQueue(data_object){
        this.push(data_object)
        
    }
    // update for server reachable status
    update(new_state){
        if(new_state){
            this.processSync()
        }
        return
    }
    async processSync(){
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
        return
            
    }
    destroy(){
        NetworkObserver.detach(NetworkObserver.EVENTS.IS_SERVER_REACHABLE)

    }
}

export default new OfflineSyncManager()