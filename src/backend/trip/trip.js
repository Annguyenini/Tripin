import TokenService  from '../services/token_service';
import AuthService from '../services/auth';
import * as API from '../../config/config_api'
import CurrentTripDataService from '../../backend/storage/current_trip'
import EtagService from '../services/etag/etag_service';
import { ETAG_KEY, GENERATE_TRIP_ETAG_KEY } from '../services/etag/etag_keys';
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
        // console.log(token)
        if (!token) {
            return false 
        }

        let formData = new FormData()
        formData.append('image',{
            uri:imageUri,
            name:`cover_${CurrentTripDataService.getCurrentTripId()}`,
            type:'image/jpeg'
        })
        formData.append('trip_name',trip_name)

        // only send trip name b/c we took userdata straight out from token
        const respond = await fetch(API.REQUEST_NEW_TRIP_API,{
            method:"POST",
            headers:{"Authorization": `Bearer ${token}`},
            body: formData
        });
        const data = await respond.json()
        console.log(data)
        if(respond.status === 401){
            if (data.code ==="token_expired"){
                await AuthService.requestNewAccessToken()
                return await this.requestNewTrip(trip_name,imageUri)
                
            }
            else if(data.code ==="token_invalid"){
                return null
            }
        }
        return ({'status':respond.status, 'data':data})
    }
    async end_trip (){
        //oldcode
        const token = await TokenService.getToken('access_token')
        // const trip_data = awaitTripDataService.getTripData()

        // const trip_id =trip_data.trip_id 
        const trip_id = CurrentTripDataService.getCurrentTripId()
        // console.log("tripid",trip_id)
        const res = await fetch(API.END_TRIP,{
            method:"POST",
            headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
            body:JSON.stringify({
                trip_id:trip_id
            })
        })
        const data = await res.json()
        if (res.status===401){
            // console.log(data.code)
            if(data.code ==="token_expired"){
                await AuthService.requestNewAccessToken()
                return await this.end_trip()
            }
            else if(data.code==="token_invalid"){
                return null
            }
        }
        return ({'status':res.status,'data':data})
    }
    


    async requestCurrentTripId(){
        const token = await TokenService.getToken('access_token')
        const respond = await fetch(API.REQUEST_CURRENT_TRIP_ID,{
            method :'GET',
            headers:{'Content-Type':'application/json', 'Authorization':`Bearer ${token}`},
        })
        const data = await respond.json()

        if(respond.status ===401){
            if(data.code === 'token_expired'){
                await AuthService.requestNewAccessToken()
                return await this.requestCurrentTripId()
            }
            else if(data.code === 'token_invalid'){
                return null
            }
        }

        return ({'status':respond.status,'data':data})
    }


    async requestTripData(trip_id){

        const token = await TokenService.getToken('access_token')
        const etag = await EtagService.getEtagFromLocal(GENERATE_TRIP_ETAG_KEY(trip_id))
        const headers ={
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
        if (etag){
            headers['If-None-Match'] = etag
        }
        const respond = await fetch(API.REQUEST_TRIP_DATA,{
            method :'POST',
            headers:headers,
            body:JSON.stringify({
                trip_id:trip_id
            })
        })
        if(respond.status ===304){return {'status':respond.status,'data':null}}
        const data = await respond.json()
        if(respond.status ===401){
            if(data.code === 'token_expired'){
                await AuthService.requestNewAccessToken()
                return await this.requestCurrentTripId()
            }
            else if(data.code === 'token_invalid'){
                return null
            }
        }
        return ({'status':respond.status,'data':data})
        
    }


    async requestTripsData(){
        const token = await TokenService.getToken('access_token')
        const etag =  await EtagService.getEtagFromLocal(ETAG_KEY.ALL_TRIPS_LIST)
        const headers = {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
        if (etag){
            headers['If-None-Match']=etag
        }
        const respond = await fetch(API.REQUEST_TRIPS_DATA,{
            method :'GET',
            headers:headers
        })

        if(respond.status===304) return {'status':respond.status,'data':null}

        const data = await respond.json()

        if(respond.status ===401){
            console.log("401")
            if(data.code === 'token_expired'){
                await AuthService.requestNewAccessToken()
                return await this.requestTripsData()
            }
            else if(data.code === 'token_invalid'){
                return null
            }
        }
        return {'status':respond.status,'data':data}
    }
    
}

const trip = new Trip()
export default trip