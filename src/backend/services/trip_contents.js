import CurrentTripDataService from '../../backend/storage/current_trip'
import * as API from '../../config/config_api'
import TokenService from './token_service'
import AuthService from './auth'
import getTimestamp from '../addition_functions/get_current_time'
import * as FileSystem from 'expo-file-system/legacy'
import fetchFunction from './fetch_function'
class TripContentService {

    async send_coordinates(coor_object, version) {
        const respond = await fetchFunction(API.SEND_COORDINATES + `/${CurrentTripDataService.getCurrentTripId()}/coordinates`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", 'id': version },
            body: JSON.stringify({
                coordinates: coor_object,
                version: version
            })
        })
        return respond
    }
    async deleteCoordinate(trip_id, coordinate_id, modified_time) {
        const respond = await fetchFunction(API.DELETE_TRIP_COORDINATE, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json", 'id': coordinate_id },
            body: JSON.stringify({
                trip_id: trip_id,
                coordinate_id: coordinate_id,
                modified_time: modified_time
            })
        })
        return respond
    }

    async requestTripCoordinates(trip_id, version) {
        if (!trip_id) return
        const headers = {}
        // if(version){
        //     headers['Version'] =version
        // }
        const respond = await fetchFunction(API.REQUEST_TRIP_COORDINATES + `/${trip_id}/coordinates`, {
            method: 'GET',
            headers: headers
        })

        return respond
    }
    async request_location_conditions(longitude, latitude) {
        const respond = await fetchFunction(API.REQUEST_LOCATION_CONDITIONS + `?longitude=${longitude}&latitude=${latitude}`, {
            methods: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        return respond
    }


    async sendTripMedia(media_id, trip_id, mediaUri, longitude, latitude, mediaType, coordinate_id, time_stamp) {
        const form = new FormData()
        const path = `trip${trip_id}_${time_stamp}`
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
            time_stamp: time_stamp,
            media_id: media_id,
            coordinate_id: coordinate_id
        }))
        const headers = {
            'id': media_id
        }
        const respond = await fetchFunction(API.SEND_MEDIAS_BASE + `/${trip_id}/upload`, {
            headers: headers,
            method: 'POST',
            body: form
        })
        return respond
    }
    async requestTripMedias(trip_id, trip_media_hash) {
        const headers = {}
        if (trip_media_hash) {
            headers['If-None-Match'] = trip_media_hash
        }
        const respond = await fetchFunction(API.REQUEST_TRIP_MEDIAS + `/${trip_id}/medias`, {
            method: 'GET',
            headers: headers
        })
        return respond
    }

    async deleteMedias(trip_id, media_id, modified_time) {
        const respond = await fetchFunction(API.DELETE_TRIP_MEDIA, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trip_id: trip_id, media_id: media_id, modified_time: modified_time })
        })
        return respond
    }

}
export default new TripContentService()