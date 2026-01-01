import { navigate } from "../../frontend/custom_function/navigationService"
import AuthHandler from "./auth_handler"
import TripHandler from "./trip_handler"
import TripContentsHandler from "./trip_contents_handler"
class AppFlow{
    constructor(){
        
    }
    async tokenAuthorization(){
        const loginViaToken  = await AuthHandler.loginWithTokenHandler()
        if(!loginViaToken){
            return false
        }
        await this.onAuthSuccess()
        return true
    }
    async onAuthSuccess(){
        navigate('Main')
        const trips = await TripHandler.requestAllTripHandler() 
        return
    }
    async onRenderMapSuccess(){
        const currentTrip = await TripHandler.requestCurrentTripDataHandler()
        return
    }
    async onRenderCurrentLayoutsSuccess(){
        const currentTripCoors = await TripContentsHandler.requestCurrentTripCoordinatesHandler()
        const currentTripImage = await TripContentsHandler.requestCurrentTripMedias()
        const currentlocationCon = await TripContentsHandler.requestLocationConditionsHandler()
        return
    }
}
export default new AppFlow()