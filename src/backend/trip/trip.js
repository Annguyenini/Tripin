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

        try{
            // if there are no token found return false
            const token = await TokenService.getToken("access_token");
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
            }
            return ({'ok':true,'status':respond.status, 'data':data})
        }
        catch(err){
            console.error('Fail at request new trip: ',err)
            return ({'ok':false})
        }   
    }
    async end_trip (){
        try{
            const token = await TokenService.getToken('access_token')
            const trip_id = CurrentTripDataService.getCurrentTripId()
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
            }
            return ({'ok':true,'status':res.status,'data':data})
        }
        catch(err){
            console.error('Failed at end trip: ',err)
            return ({'ok':false})
        }
    }

    


    async requestCurrentTripId(){
        try{
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
            }

            return ({'ok':true,'status':respond.status,'data':data})
        }
        catch(err){
            console.error('Failef at request current trip id', err)
            return ({'ok':false})
        }
    }


    async requestTripData(trip_id){
        try{
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
            }
            return ({'ok':true,'status':respond.status,'data':data})
        }
        catch(err){
            console.error("failed at get trip data with: ",err)
            return ({'ok':false})
        }    
    }


    async requestTripsData(){
        try{
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
            }
            return {'ok':true,'status':respond.status,'data':data}
        }
        catch(err){
            console.error('Failed at request all trip data: ',err)
            return ({'ok':false})
        }
    }
}

const trip = new Trip()
export default trip