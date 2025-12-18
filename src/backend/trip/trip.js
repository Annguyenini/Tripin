import { TokenService } from '../token_service';
import { Auth } from '../auth';
import * as API from '../../config/config'
import { UserDataService } from '../userdatas/user';
import { TripDataService } from '../userdatas/trip';
export class Trip{
    constructor(){
        if(Trip.instance) return Trip.instance;
        Trip.instance =this;
        this.TokenService = new TokenService()
        this.AuthService = new Auth()
        this.userDataService = new UserDataService()
        this.tripDataService = new TripDataService()
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
        const trip_id = data.tripid
        if (res.status ===200){
            const trip_data = this.tripDataService.getObjectReady(trip_name, trip_id,Date.now())
            this.tripDataService.setTripData(trip_data)
            this.tripDataService.setTripStatus(true)
            return true
        }
    }
    
}