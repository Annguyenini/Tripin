import AuthService from "../../backend/services/auth"
import Trip from "../../backend/trip/trip"
import TripContentsService from '../../backend/services/trip_contents'
import Subject from "../../backend/storage/subject"
import TripDataService from '../../backend/storage/trip'
import {navigate} from '../../frontend/custom_function/navigationService' 
class AppFlow extends Subject{
    constructor(){
        super()
        this.item={
            'authorization':false,
        }
        
    }
    async requestAuthorization(){
        // longin via token
        const login_via_token = await AuthService.loginWithAccessToken()
        if(login_via_token){
            navigate('Main')
        }
        return login_via_token
    }
    async setAuthorization(status){
        this.authorization = status
        if(status){
            this.notify('authorization',true)
            navigate('Main')            
        }
        return
    }
    async mainScreenReady(){
        const allTripStatus = await Trip.requestTripsData()
    }
    async mapScreenReady(){
        const currentTripStatus = await Trip.requestCurrentTripData()
        const tripStatus =await TripDataService.getTripStatus()
        if(tripStatus === 'true'){
            const locationStatus = await Trip.request_location_conditions()
            await this.requestCurrentTripCoors()
        }
        return
    }
    async requestCurrentTripCoors(){
        const currentTripCStatus = await TripContentsService.requestCurrentTripCoordinates()

    }
}
export default new AppFlow()