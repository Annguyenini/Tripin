import { UserDataService } from "./userdata"

class TripService{
    constructor(){
        if(TripService.instance) return TripService.instance
        TripService.instance = this
        this.UserDataService = new UserDataService()
    }
    async requestCurrentTripStatus(){
        const respond = await fetch('')
    }
    async requestCurentTripData(){}
    async requestAllTrips(){}
    async requestTripData(){}
    async createNewTrip(tripname,createdtime, startedlocation){
        const access_token = this.UserDataService.getToken("access_token");
        console.assert(access_token!= undefined)
        const respond = await fetch ('',{
            method:["POST"],
            headers:{"Content-Type":"application/json",
                "Authorization":`Bearer ${access_token}`
            },
            body: JSON.stringify({
                trip_name: tripname,
                created_time: createdtime,
                started_location: startedlocation
            })
        }
        )
        console.assert(respond.status===200);
    }
}