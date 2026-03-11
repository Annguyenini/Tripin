import TokenService  from '../services/token_service';
import AuthService from '../services/auth';
import * as API from '../../config/config_api'
import CurrentTripDataService from '../../backend/storage/current_trip'
import EtagService from '../services/etag/etag_service';
import { ETAG_KEY, GENERATE_TRIP_ETAG_KEY } from '../services/etag/etag_keys';
// mport NetworkObserver from '../../app-core/flow/sync/network_observer';
import fetchFunction from './fetch_function';
class Trip{

    constructor(){
    }
    async requestNewTrip(trip_name,imageUri=null){
        /**
         * request to create new trip
         * send via FORMDATA
         * @param trip_name - tripname
         */
            // if there are no token found return false
        const token = await TokenService.getToken("access_token");
        let formData = new FormData()
        if(imageUri){
            formData.append('image',{
            uri:imageUri,
            name:`cover_${CurrentTripDataService.getCurrentTripId()}`,
            type:'image/jpeg'
        })
        }
        formData.append('trip_name',trip_name)
        const respond =await fetchFunction(API.REQUEST_NEW_TRIP_API,{
            method:"POST",
            body: formData
        })
        return respond
        
    }
    async end_trip (trip_id = null){
        if(!trip_id){
                trip_id = CurrentTripDataService.getCurrentTripId()
            }
        const respond = await fetchFunction(API.END_TRIP,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                trip_id:trip_id
            })
        })
        return respond
    }

    
    async requestCurrentTripId(){
        const respond = await fetchFunction(API.REQUEST_CURRENT_TRIP_ID,{
            method :'GET',
            headers:{'Content-Type':'application/json'},
        })
        return respond
    }


    async requestTripData(trip_id){
        const etag = await EtagService.getEtagFromLocal(GENERATE_TRIP_ETAG_KEY(trip_id))
        const headers ={
            'Content-Type':'application/json',
        }
        if (etag){
            headers['If-None-Match'] = etag
        }
        const respond = await fetchFunction(API.REQUEST_TRIP_DATA,{
            method :'POST',
            headers:headers,
            body:JSON.stringify({
                trip_id:trip_id
            })
        })
        return respond 
    }


    async requestTripsData(){
        const etag =  await EtagService.getEtagFromLocal(ETAG_KEY.ALL_TRIPS_LIST)
        console.log(etag)
        const headers = {
            'Content-Type':'application/json',
        }
        if (etag){
            headers['If-None-Match']=etag
        }
        const respond = await fetchFunction(API.REQUEST_TRIPS_DATA,{
            method :'GET',
            headers:headers
        })
        return respond
    }
    async requestTripDataChange(trip_id,trip_name,image_uri){
        const data = new FormData()
        if (image_uri){data.append('image',{
            uri:image_uri,
            name:`cover_${trip_id}`,
            type:'image/jpeg'
        })}
        data.append('trip_id',trip_id ?? '')
        data.append('trip_name',trip_name ?? '')
        const respond = await fetchFunction(API.MODIFY_TRIP_DATA,{
            method:'POST',
            body:data
        })
        return respond
    }
    async requestSharedTripLink(trip_id){
        const headers = {
            'Content-Type':'application/json',
        }
        const respond = await fetchFunction(API.REQUEST_SHARED_TRIP_LINK,{
            method:'POST',
            headers:headers,
            body:JSON.stringify({
                trip_id:trip_id,
                expired_days:30
            })
        })
        return respond
    }
}

const trip = new Trip()
export default trip