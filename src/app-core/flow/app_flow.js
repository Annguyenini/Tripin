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
import TripContentSyncManager from "./sync/trip_contents_sync_manager"
import safeRun from "../helpers/safe_run"
import {_registerNetworkCallback} from "./sync/network_observer"
class AppFlow{
    constructor(){
        this.LocalStorage = new LocalStorage()
    }
    async tokenAuthorization(){
        const loginViaToken  = await AuthHandler.loginWithTokenHandler()
        if(!loginViaToken){
            await this.LocalStorage.clearAllStorage()
            return false
        }
        if (!await this.onAuthSuccess()) return false

        return true
    }
    
    async onAuthSuccess(){
        await safeRun(()=>UserDataHandler.GetUserDataHandler(),'failed_at_get_user_data')
        // if (!requestUserData){ return false}
        // console.log('main')
        navigate('Permission')
        
        return true
    }
    async onPermissionReady (){
        await this.initDBs()
        navigate('Main')

    }
    async initDBs(){
        try{
            await safeRun(()=>Albumdb.initUserAlbum(),'failed_at_create_album_database')
            await safeRun(()=>TripDatabaseService.initTripTable(),'failed_at_create_trips_database')
        }
        catch(err){
            console.error(err)
        }
    }
    async onAppReady(){
        try{
            const currentTripIdAndVersion = await TripHandler.requestCurrentTripHandler()      
            await safeRun(()=>this.syncCurrentTripContents(),'failed_at_sync_trip_media')

        }
        catch(err){
            console.error('Failed too get current trip data')
        }
        return true

    }
    // request current trip-id
    async onRenderMapSuccess(){
        // const currentTripIdAndVersion = await TripHandler.requestCurrentTripHandler()      
        // await safeRun(()=>this.syncCurrentTripContents(),'failed_at_sync_trip_media')
  
        // return
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
        const trip_id = CurrentTripDataService.getCurrentTripId()
        if (trip_id) {
            console.log('sync')
            await safeRun (()=>TripContentSyncManager.tripCoordinateSync(trip_id),'faild_at_sync_trip_media')
            await safeRun (()=>TripContentSyncManager.tripCoordinateSync(trip_id),'faild_at_sync_trip_coordinate')
            console.log('sync complete')
        }
        // await TripContentsSync.currentTripContentsSync(CurrentTripDataService.getCurrentTripId())
        // return
    }
    
}
export default new AppFlow()