import { navigate } from "../../frontend/custom_function/navigationService"
import AuthHandler from "./auth_handler"
import TripHandler from "./trip_handler"
import TripContentsHandler from "./trip_contents_handler"
import UserDataHandler from './user_handler'
import Albumdb from "../../backend/album/albumdb"
import CurrentTripDataService from '../../backend/storage/current_trip'
import TripDatabaseService from "../../backend/database/TripDatabaseService"

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
        await TripDatabaseService.initTripTable()
    }
    // request current trip-id
    async onRenderMapSuccess(){
        const currentTripIdAndVersion = await TripHandler.requestCurrentTripHandler()        
        await this.fetchCurrentTripContents()
        return
    }
    async onRenderUserData(){
        const trips = await TripHandler.requestAllTripHandler() 
        return
    }

    // async onRenderCurrentLayoutsSuccess(){
    //     const currentTripCoors = await TripContentsHandler.requestCurrentTripCoordinatesHandler()
    //     const currentTripImage = await TripContentsHandler.requestCurrentTripMedias()
    //     const currentlocationCon = await TripContentsHandler.requestLocationConditionsHandler()
    //     return
    // }
    async fetchCurrentTripContents(){
        if(!CurrentTripDataService.getCurrentTripStatus()) return
        const currentTripCoors = await TripContentsHandler.requestCurrentTripCoordinatesHandler()
        const currentTripImage = await TripContentsHandler.requestCurrentTripMedias()
        const currentlocationCon = await TripContentsHandler.requestLocationConditionsHandler()
        return
    }
    
}
export default new AppFlow()