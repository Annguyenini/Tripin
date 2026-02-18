import { navigate } from "../../frontend/custom_function/navigationService"
import AuthHandler from "./auth_handler"
import TripHandler from "./trip_handler"
import TripContentsHandler from "./trip_contents_handler"
import UserDataHandler from './user_handler'
import Albumdb from "../../backend/album/albumdb"
import CurrentTripDataService from '../../backend/storage/current_trip'
import TripDatabaseService from "../../backend/database/TripDatabaseService"
import TripContentsSync from "./sync/trip_contents_sync"
import LocalStorage from "../../backend/storage/base/localStorage"
class AppFlow{
    constructor(){
        this.LocalStorage = new LocalStorage()
    }
    async tokenAuthorization(){
        const loginViaToken  = await AuthHandler.loginWithTokenHandler()
        console.log('rere',loginViaToken)
        if(!loginViaToken){
            await this.LocalStorage.clearAllStorage()
            return false
        }
        if (!await this.onAuthSuccess()) return false

        return true
    }
    async onAuthSuccess(){
        const requestUserData = await UserDataHandler.GetUserDataHandler()
        if (!requestUserData){ return false}
        console.log('main')
        navigate('Permission')
        
        return true
    }
    async onPermissionReady (){
        await this.initDBs()
        navigate('Main')

    }
    async initDBs(){
        try{
            await Albumdb.initUserAlbum()
            await TripDatabaseService.initTripTable()
        }
        catch(err){
            console.error(err)
        }
    }
    // request current trip-id
    async onRenderMapSuccess(){
        const currentTripIdAndVersion = await TripHandler.requestCurrentTripHandler()        
        await this.syncCurrentTripContents()
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
    async syncCurrentTripContents(){
        await TripContentsSync.currentTripContentsSync(CurrentTripDataService.getCurrentTripId())
        return
    }
    
}
export default new AppFlow()