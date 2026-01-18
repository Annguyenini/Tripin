import CurrentTripDataService from '../../backend/storage/current_trip'
import * as API from '../../config/config_api'
import TripContentsDataService from '../storage/trip_contents'
import TokenService from './token_service'
import AuthService from './auth'
import timestamp from '../addition_functions/get_current_time'
class TripContentService{

    async send_coordinates(coor_object,version){
        const token = await TokenService.getToken('access_token')
        try{
            const respond = await fetch(API.SEND_COORDINATES+`/${CurrentTripDataService.getCurrentTripId()}/coordinates`,{
                method:'POST',
                headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
                body:JSON.stringify({
                    coordinates:coor_object,
                    version:version})
            })
        }
        catch(err){
            console.log(err)
            return  {'status':404}
        }
        const data = await respond.json()
        console.log(data)
        if(respond.status ===401){
            if(data.code === 'token_expired'){
                await AuthService.requestNewAccessToken()
                return await this.send_coordinates(coor_object,version)
            }
            else if(data.code === 'token_invalid'){
                return {'status':respond.status}
            }
                return {'status':respond.status}
        }
        return {'status':respond.status,'data':data}
        

    }

    async

    async requestCurrentTripCoordinates(){
        
        const respond = await fetch(API.REQUEST_TRIP_COORDINATES+`/${CurrentTripDataService.getCurrentTripId()}/coordinates`,{
            method:'GET',
            headers:{'Authorization':`Bearer ${await TokenService.getToken('access_token')}`}
        })
        const data = await respond.json()
        if(respond.status ===401){
            if(data.code === 'token_expired'){
                await AuthService.requestNewAccessToken()
                return await this.requestTripsData()
            }
            else if(data.code === 'token_invalid'){
                return null
            }
            return null  
        }
        else if(respond.status === 429){
            return null
        }
        
        return ({'status':respond.status,'data':data})
    }
     async request_location_conditions(longitude,latitude){
        
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
                return null
            }
            return null
        }
        return({'status':respond.status,'data':data})
    }


    async sendTripImage(imageUri,longitude,latitude){
        const token = await TokenService.getToken('access_token')
        const form =  new FormData()
        form.append('image',{
            uri:imageUri,
            type:'image/jpg',
            name:`trip${CurrentTripDataService.getCurrentTripId()}_${timestamp}.jpg`
        })
        form.append('data',JSON.stringify({
            trip_id:CurrentTripDataService.getCurrentTripId(),
            longitude:longitude,
            latitude:latitude,
            time_stamp : timestamp
        }))
        const respond = await fetch(API.SEND_MEDIAS_BASE+`/${CurrentTripDataService.getCurrentTripId()}/upload`,{
            method:'POST',
            headers:{'Content_type':'multipart/form-data','Authorization':`Bearer ${token}`},
            body:form
        })
        const data = await respond.json()
        if(respond.status ===401){
            
            if (data.code === 'token_expired'){
                await TokenService.requestNewAccessToken()
                return await this.sendTripImage(imageUri,longitude,latitude)
            }
            else if (data.code === 'token_invalid'){
                return false
            }
        }
        else if (respond.status === 200){            
            return true
        }
    }
    async sendTripVideo(videoUri,thumbnailsUri,longitude,latitude){
        const form = new FormData()
        const path = `trip${CurrentTripDataService.getCurrentTripId()}_${timestamp}`
        form.append('video',{
            uri:videoUri,
            name:`${path}.mp4`,
            type:'video/mp4'
        })
        form.append('data',JSON.stringify({
            longitude:longitude,
            latitude:latitude,
            time_stamp:timestamp
        }))
        form.append('thumpnail',{
            uri:thumbnailsUri,
            type:'image/jpg',
            name:`${path}_thump.jpg`
        })
        const token = await TokenService.getToken('access_token')
        const respond = await fetch(API.SEND_MEDIAS_BASE+`/${CurrentTripDataService.getCurrentTripId()}/upload`,{
            method:'POST',
            headers:{'Content-Type':'multipart/form-data','Authorization':`Bearer ${token}`},
            body:form
        })
        if(respond.status===401){
            if (data.code === 'token_expired'){
                await TokenService.requestNewAccessToken()
                return await this.sendTripVideo(videoUri,longitude,latitude)
            }
            else if (data.code === 'token_invalid'){
                return false
            }
        }
        else if (respond.status === 200){            
            return true
        }

    }


    async requestTripMedias(trip_id){
        const respond = await fetch(API.REQUEST_TRIP_MEDIAS+`/${trip_id}/medias`,{
            method :'GET',
            headers:{'Authorization':`Bearer ${await TokenService.getToken('access_token')}`}
        })
        const data = await respond.json()
        if(respond.status===401){
            if (data.code === 'token_expired'){
                await TokenService.requestNewAccessToken()
                return await this.sendTripVideo(videoUri,longitude,latitude)
            }
            else if (data.code === 'token_invalid'){
                return null
            }
        }
        return({'status':respond.status,'data':data})
    }
}
export default new TripContentService()