// OUT OF USE/ do not use


export class UserDataTrip{
    constructor(){
        if (UserDataTrip.instance){
            return UserDataTrip.instance
        }
        UserDataTrip.instance = this
        
        this.trip_name = null
        this.trip_id = null
        this.trip_status = null
    }
    set_trip_name(trip_name){
        this.trip_name = trip_name
    }   

    set_trip_id(trip_id){
        this.trip_id = trip_id
    }   

    set_trip_status(trip_status){
        this.trip_status = trip_status
    }   

    get_trip_name(){
        return this.trip_name
    }

    get_trip_id(){
        return this.trip_id
    }

    get_trip_status(){
        return this.trip_status
    }
}