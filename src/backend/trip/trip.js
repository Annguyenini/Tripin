import { TokenService } from '../token_service';
import { Auth } from '../auth';
import * as API from '../../config/config'
import { UserDataService } from '../userdatas/user';
import { TripDataService } from '../userdatas/trip';
export class Trip{
    static instance

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
        console.log("called",trip_name)
        /**
         * request to create new trip
         * @param trip_name - tripname
         */
        // if there are no token found return false
        const token = await this.TokenService.getToken("access_token");
        console.log(token)
        if (!token) {
            return false 
        }
        // only send trip name b/c we took userdata straight out from token
        const res = await fetch(API.REQUEST_NEW_TRIP_API,{
            method:"POST",
            headers:{"Content-Type":"application/json","Authorization": `Bearer ${token}`},
            body:JSON.stringify({
                trip_name: trip_name
            })
        });
        const data = await res.json();
        console.log(data)
        console.log(res.status)

        const trip_id = data.tripid
        console.log(trip_id)

        if (res.status ===200){
            const trip_data = this.tripDataService.getObjectReady(trip_name, trip_id,Date.now())
            console.log(trip_data)
            await this.tripDataService.setTripData(trip_data)
            await this.tripDataService.setTripStatus('true')
            return true
        }

        if(res.status === 401){

            if (data.code ==="token_expired"){
                await this.AuthService.requestNewAccessToken()
                setTimeout(async()=>{
                    await this.requestNewTrip(trip_name)
                },2000)
                
            }
            else if(data.code ==="token_invalid"){
                return false
            }
            else if(res.status != 419 ){
                return false
            }
            return false
        }
    }
    
}