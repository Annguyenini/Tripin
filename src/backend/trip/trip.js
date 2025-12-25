import TokenService  from '../services/token_service';
import AuthService from '../services/auth';
import * as API from '../../config/config'
import TripDataService from '../storage/trip';
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
        const data = await respond.json();
        // console.log(data)
        // console.log(respond.status)

        const trip_id = data.trip_id
        // console.log(trip_id)

        if (respond.status ===200){
            const trip_data =TripDataService.getObjectReady(trip_name, trip_id,Date.now())
            console.assert(trip_data === null,"Trip data is null")
            // console.log(trip_data)
            await TripDataService.setTripData(trip_data)
            await TripDataService.setTripStatus('true')
            return true
        }

        if(respond.status === 401){
            console.log("401")
            console.log(data.code)
            if (data.code ==="token_expired"){
                await AuthService.requestNewAccessToken()
                setTimeout(async()=>{
                    await this.requestNewTrip(trip_name)
                },2000)
                
            }
            else if(data.code ==="token_invalid"){
                return false
            }
            else if(respond.status != 419 ){
                return false
            }
            else if(data.code ==="failed"){
                console.log("failed ")
                return false 

            }
        }
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
                return false
            }
        }
        else if(res.status === 200){
            await TripDataService.deleteTripData()
            await TripDataService.setTripStatus('false')
            return true
        }
    }
    async send_coordinates(coor_object){
        console.log("called")
        const token = await TokenService.getToken('access_token')
        const respond = await fetch(API.SEND_COORDINATES+`/${TripData.trip_id}/coordinates`,{
            method:'POST',
            headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
            body:JSON.stringify({coordinates:coor_object})
        })
        const data = await respond.json()
        if(respond.status ===401){
            console.log("401")
            if(data.code === 'token_expired'){
                await AuthService.requestNewAccessToken()
                return await this.send_coordinates(coor_object)
            }
            else if(data.code === 'token_invalid'){
                return false
            }
            return false 
        }
        else if(respond.status===200){
            return true;
        }

    }
}

const trip = new Trip()
export default trip