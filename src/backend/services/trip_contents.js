import TripData from '../../app-core/local_data/local_trip_data'
import * as API from '../../config/config_api'
import TripContentsDataService from '../storage/trip_contents'
import tokenService from './token_service'
import AuthService from './auth'
class TripContentService{
    async requestCurrentTripCoordinates(){
        const respond = await fetch(API.REQUEST_TRIP_COORDINATES+`/${TripData.trip_id}/coordinates`,{
            method:'GET',
            headers:{'Authorization':`Bearer ${await tokenService.getToken('access_token')}`}
        })
        const data = await respond.json()
        if(respond.status ===401){
            if(data.code === 'token_expired'){
                await AuthService.requestNewAccessToken()
                return await this.requestTripsData()
            }
            else if(data.code === 'token_invalid'){
                return false
            }
            return false 
        }
        else if(respond.status === 429){
            return false
        }
        if (data.coordinates){
            await TripContentsDataService.SetCurrentCoordinates(data.coordinates)
        }
        return true
    }
}
export default new TripContentService()