import TokenService  from '../services/token_service';
import AuthService from '../services/auth';
import * as API from '../../config/config_api'
import TripData from '../../app-core/local_data/local_trip_data';

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
            name:`cover_${TripData.trip_id}`,
            type:'image/jpeg'
        })
        formData.append('trip_name',trip_name)

        // only send trip name b/c we took userdata straight out from token
        const respond = await fetch(API.REQUEST_NEW_TRIP_API,{
            method:"POST",
            headers:{"Authorization": `Bearer ${token}`},
            body: formData
        });
        const data =respond.json()
        if(respond.status === 401){
            if (data.code ==="token_expired"){
                await AuthService.requestNewAccessToken()
                return await this.requestNewTrip(trip_name)
                
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
        const trip_id = TripData.trip_id
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
    
    async requestCurrentTripData(){
        const token = await TokenService.getToken('access_token')
        const respond = await fetch(API.REQUEST_CURRENT_TRIP_DATA,{
            method :'GET',
            headers:{'Content-Type':'application/json', 'Authorization':`Bearer ${token}`},
        })
        const data = await respond.json()

        if(respond.status ===401){
            if(data.code === 'token_expired'){
                await AuthService.requestNewAccessToken()
                return await this.requestCurrentTripData()
            }
            else if(data.code === 'token_invalid'){
                return null
            }
        }

        return ({'status':respond.status,'data':data})
    }
    async requestTripsData(){
        const token = await TokenService.getToken('access_token')
        const respond = await fetch(API.REQUEST_TRIPS_DATA,{
            method :'GET',
            headers:{'Content-Type':'application/json', 'Authorization':`Bearer ${token}`},
        })
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