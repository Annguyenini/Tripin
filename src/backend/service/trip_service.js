import { TokenService } from '../token_service';
import * as API from '../../config/config'
export class Trip{
    constructor(){
        if(Trip.instance) return Trip.instance;
        Trip.instance =this;
        this.TokenService = new TokenService()
    }
    verifyTripName(trip_name){

    }
    async requestNewTrip(trip_name){
        const token = await this.TokenService.getToken("access_token");
        const res = await fetch(API.REQUEST_NEW_TRIP_API,{
            method:"POST",
            headers:{"Content-Type":"application/json","Authorization": `Bearer ${token}`},
            body:JSON.stringify({
                trip_name: trip_name
            })
        });
        if(res.status != 200 ){
            return;
        }
        const datas = await res.json();

    }
    
}