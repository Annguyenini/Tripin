import TokenService  from '../services/token_service';
import AuthService from '../services/auth';
import * as API from '../../config/config_api'
import TripDataService from '../storage/trip';
import TripData from '../../app-core/local_data/local_trip_data';
import TripService  from './trip_service';
import locationDataService from '../storage/location';
import timestamp from '../addition_functions/get_current_time';
import LocationService from '../../app-core/local_data/local_location_data'
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

    
        // console.log(trip_id)
        console.log(respond.status)

        if (respond.status ===200){
            const data = await respond.json();
            console.log(data)
            const trip_id = data.trip_id
            const trip_data =TripDataService.getObjectReady(trip_name, trip_id,Date.now())
            console.assert(trip_data === null,"Trip data is null")
            // console.log(trip_data)
            await TripDataService.setCurrentTripData(trip_data)
            await TripDataService.setTripStatus('true')

            TripDataService.setTripsData(data.all_trip_data)
            return true
        }

        else if(respond.status === 401){
            if (data.code ==="token_expired"){
                await AuthService.requestNewAccessToken()
                return await this.requestNewTrip(trip_name)
                
            }
            else if(data.code ==="token_invalid"){
                return false
            }
           
            else if(data.code ==="failed"){
                console.log("failed ")
                return false 

            }
        }
        else if (respond.status === 419){
            return false
        }
        else if (respond.status === 500){
            return false
        }
        return true
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
            await TripDataService.deleteCurrentTripData()
            await TripDataService.setTripStatus('false')
            stop_task = await TripService.stopGPSWatch()
            console.assert(stop_task,'Task not stop')
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
                return await this.send_coordinates(coor_object,last_long,last_lat)
            }
            else if(data.code === 'token_invalid'){
                return false
            }
            return false 
        }
        return true;
        

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
                return false
            }
            return false 
        }

        if (data.current_trip_data){
            const trip_data = TripDataService.getObjectReady(data.current_trip_data.trip_name,data.current_trip_data.trip_id,data.current_trip_data.created_time)
            await TripDataService.setCurrentTripData(trip_data)
            if(data.current_trip_data.trip_image){
                await TripDataService.setTripImageCover(data.current_trip_data.trip_image,'aws')
            }
            await TripDataService.setTripStatus('true')
        }
        if(data.all_trip_data){
            TripDataService.setTripsData(data.all_trip_data)
        }
        return true
    }

    async request_location_conditions(){
        const coors = await LocationService.getCurrentCoor()
        if(!coors){
            return false
        }
        const longitude = coors.coords.longitude
        const latitude = coors.coords.latitude
        const respond = await fetch(API.REQUEST_LOCATION_CONDITIONS+`?longitude=${longitude}&latitude=${latitude}`,{
            methods:'GET',
            headers:{'Content-Type':'application/json','Authorization':`Bearer ${await TokenService.getToken('access_token')}`},
        })
        const data = await respond.json()
        if(respond.status ===401){
            if(data.code === 'token_expired'){
                await AuthService.requestNewAccessToken()
                return await this.request_location_conditions(longitude,latitude)
            }
            else if(data.code === 'token_invalid'){
                return false
            }
            return false 
        }
        if (data.geo_data){
            await locationDataService.setCurrentLocationCondition(data.geo_data)
            await locationDataService.setCurrentCity(data.city)
            return true
        }
        return false
    }


    async sendTripImage(imageUri){
        console.log('called')
        const token = await TokenService.getToken('access_token')
        const coor = await LocationService.getCurrentCoor()
        console.log(coor)
        const longitude = coor.coords.longitude
        const latitude = coor.coords.latitude
        const form =  new FormData()
        form.append('image',{
            uri:imageUri,
            type:'image/jpg',
            name:`trip${TripData.trip_id}_${timestamp}.jpg`
        })
        form.append('data',JSON.stringify({
            trip_id:TripData.trip_id,
            longitude:longitude,
            latitude:latitude,
            time_stamp : timestamp
        }))
        const respond = await fetch(API.SEND_TRIP_IMAGES+`/${TripData.trip_id}/upload`,{
            method:'POST',
            headers:{'Content_type':'multipart/form-data','Authorization':`${token}`},
            body:form
        })
        const data = await respond.json()
        if(respond.status ===401){
            
            if (data.code === 'token_expired'){
                await TokenService.requestNewAccessToken()
                return await this.sendTripImage(imageUri)
            }
            else if (data.code === 'token_invalid'){
                return false
            }
        }
        else if (respond.status === 200){
            console.log(data)
            return true
        }
    }
}

const trip = new Trip()
export default trip