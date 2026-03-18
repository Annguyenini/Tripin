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


    async sendTripMedia(media_id, trip_id, mediaUri, longitude, latitude, mediaType) {
        const form = new FormData()
        const path = `trip${trip_id}_${getTimestamp()}`
        const isVideo = mediaType === 'video'

        form.append(isVideo ? 'video' : 'image', {
            uri: mediaUri,
            name: `${path}.${isVideo ? 'mp4' : 'jpg'}`,
            type: isVideo ? 'video/mp4' : 'image/jpeg'
        })

        form.append('data', JSON.stringify({
            trip_id: String(trip_id),
            longitude: String(longitude),
            latitude: String(latitude),
            time_stamp: getTimestamp(),
            media_id: media_id
        }))

        const respond = await fetchFunction(API.SEND_MEDIAS_BASE + `/${trip_id}/upload`, {
            method: 'POST',
            body: form
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
    async requestTripDataVersions(trip_id){
                console.log('trip sync2')

        const respond = await fetchFunction(API.TRIP_DATA_VERSION,{
            method :'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({'trip_id':trip_id})  
        })
        return respond
    }
    async deleteMedias(trip_id,version){
        const respond = await fetchFunction(API.DELETE_TRIP_MEDIA,{
            method:'DELETE',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({trip_id:trip_id,version:version})
        })
        return respond
    }
}
export default new TripContentService()