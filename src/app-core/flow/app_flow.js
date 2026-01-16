import { navigate } from "../../frontend/custom_function/navigationService"
import AuthHandler from "./auth_handler"
import TripHandler from "./trip_handler"
import TripContentsHandler from "./trip_contents_handler"
import UserDataHandler from './user_handler'
import Albumdb from "../../backend/album/albumdb"
class AppFlow{
    constructor(){
        
    }
    async tokenAuthorization(){
        const loginViaToken  = await AuthHandler.loginWithTokenHandler()
        if(!loginViaToken){
            return false
        }
        if (!await this.onAuthSuccess()) return false

        return true
    }
    async onAuthSuccess(){
        const requestUserData = await UserDataHandler.GetUserDataHandler()
        if (!requestUserData){ return false}
        navigate('Main')
        await this.initDBs()
        return true
    }
    async initDBs(){
        await Albumdb.initUserAlbum()
    }
    // request current trip-id
    async onRenderMapSuccess(){
        const currentTripIdAndVersion = await TripHandler.requestCurrentTripHandler()        

        return
    }
    async onRenderUserData(){
        const trips = await TripHandler.requestAllTripHandler() 
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