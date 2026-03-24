import fetchFunction from "../fetch_function"
import * as API from '../../../config/config_api'
class TripContentsSyncService{
    
    async requestTripMediasHash(trip_id){
        const response = await fetchFunction(API.TRIP_MEDIAS_HASH,{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                trip_id:trip_id,
                })
        })
        return response
    }
    async requestTripMediasMetadata(trip_id){
        const response = await fetchFunction(API.TRIP_MEDIAS_METADATA,{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                trip_id:trip_id,
                })
        })
        return response
    }
    async requestTripCoordinateVersions(trip_id){
        const respond = await fetchFunction(API.TRIP_COORDINATE_VERSION,{
            method :'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({'trip_id':trip_id})  
        })
        return respond
    }
}

export default new TripContentsSyncService