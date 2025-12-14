import { TokenService } from '../token_service';
import { Auth } from '../auth';
import * as API from '../../config/config'
import { UserDataTrip } from '../userdatas/userdata_trip';
export class Trip{
    constructor(){
        if(Trip.instance) return Trip.instance;
        Trip.instance =this;
        this.TokenService = new TokenService()
        this.AuthService = new Auth()
        this.UserTripService = new UserDataTrip()
    }

    verifyTripName(trip_name){

    }
    async requestNewTrip(trip_name){
        const token = await this.TokenService.getToken("access_token");
        if (!token) {
            return false 
        }
        const res = await fetch(API.REQUEST_NEW_TRIP_API,{
            method:"POST",
            headers:{"Content-Type":"application/json","Authorization": `Bearer ${token}`},
            body:JSON.stringify({
                trip_name: trip_name

            })
        });
        if(res.status === 401){
            this.AuthService.requestNewAccessToken()
            setTimeout(async()=>{
                this.requestNewTrip(trip_name)
            },2000)
        }
        else if(res.status != 419 ){
            return false
        }
        const data = await res.json();
        if (res.status ===200){
            this.UserTripService.set_trip_id(data.tripid)
            this.UserTripService.set_trip_name(data.trip_name)
            this.UserTripService.set_trip_status()
            return true
        }
    }
    
}