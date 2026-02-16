import CurrentTripDataService from '../../backend/storage/current_trip'
import * as API from '../../config/config_api'
import TokenService from './token_service'
import AuthService from './auth'
import getTimestamp from '../addition_functions/get_current_time'
import * as FileSystem from 'expo-file-system/legacy'
import fetchFunction from './fetch_function'
class TripContentService{

    async send_coordinates(coor_object,version){
        const respond = await fetchFunction(API.SEND_COORDINATES+`/${CurrentTripDataService.getCurrentTripId()}/coordinates`,{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                coordinates:coor_object,
                version:version})
        })
        return respond
    }


    async requestTripCoordinates(trip_id,version){
        if(!trip_id) return
        const headers={}
        if(version){
            headers['Version'] =version
        }
        console.log(headers)
        const respond = await fetchFunction(API.REQUEST_TRIP_COORDINATES+`/${trip_id}/coordinates`,{
            method:'GET',
            headers:headers
        })
        
        return respond
    }
     async request_location_conditions(longitude,latitude){
        const respond = await fetchFunction(API.REQUEST_LOCATION_CONDITIONS+`?longitude=${longitude}&latitude=${latitude}`,{
            methods:'GET',
            headers:{'Content-Type':'application/json'},
        })
        return respond
    }


    async sendTripImage(version,trip_id,imageUri,longitude,latitude){
        const form =  new FormData()
        form.append('image',{
            uri:imageUri,
            type:'image/jpeg',
            name:`trip${trip_id}_${getTimestamp()}.jpg`
        })
        form.append('data',JSON.stringify({
            trip_id:String(trip_id),
            longitude:String(longitude),
            latitude:String(latitude),
            time_stamp : getTimestamp(),
            version :String(version)
        }))

    
        const respond = await fetchFunction(API.SEND_MEDIAS_BASE+`/${trip_id}/upload`,{
            method:'POST',
            body:form
        })
        return respond
    }
    async sendTripVideo(trip_id,video_version,videoUri,longitude,latitude){
        
        const form = new FormData()
        const path = `trip${trip_id}_${getTimestamp()}`
        form.append('video',{
            uri:videoUri,
            name:`${path}.mp4`,
            type:'video/mp4'
        })
        form.append('data',JSON.stringify({
            longitude:longitude,
            latitude:latitude,
            time_stamp:getTimestamp(),
            video_version:video_version,
        }))
    
        const respond = await fetchFunction(API.SEND_MEDIAS_BASE+`/${trip_id}/upload`,{
            method:'POST',
            headers:{'Content-Type':'multipart/form-data'},
            body:form
        })
        return respond
    }
    async requestTripMedias(trip_id,version){
        const headers ={}
        if(version){
            headers['Version']= version
        }
        const respond = await fetchFunction(API.REQUEST_TRIP_MEDIAS+`/${trip_id}/medias`,{
                method :'GET',
                headers:headers
            })
        return respond
    }
}
export default new TripContentService()