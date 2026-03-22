import TripContents from '../../backend/services/trip_contents'
import LocationService from '../local_data/local_location_data'
import locationDataService from '../../backend/storage/current_location_data_service'
import TripSync from './sync/trip_contents_sync'
import TripDatabaseService from '../../backend/database/TripDatabaseService'
import TripCoordinateDatabase from '../../backend/database/trip_coordinate_database'
import UserDataService from '../../backend/storage/user'
import CurrentDisplayCoordinateObserver from '../../frontend/map_box/functions/current_display_coordinates_observer'
import Albumdb from '../../backend/album/albumdb'
import safeRun from '../helpers/safe_run'
import Camera from '../../backend/camera/camera_functions'
import CurrentDisplayTripMediaObserver from '../../frontend/map_box/functions/current_display_media_observer'
import HashService from '../../backend/services/hash_service/hash_service'
import TripContentSyncManager from './sync/trip_contents_sync_manager'
import MediaService from '../../backend/media/media_service'
class TripContentHandler{
    constructor(){
        this.TripCoordinateDatabaseService = new TripCoordinateDatabase()
        this._uploadPending = 0;
    }

    async sendCoordinatesHandler(coors_object,version=null){
        console.log('prepare', coors_object,version)
        const respond = await TripContents.send_coordinates(coors_object,version)
        
        if (respond.status ===409){
            // prevent duplicate sync
            if(TripSync.coordinatesSyncing){
                TripSync.addIntoQueue('coordinate',version,coors_object)   
                return respond.ok
            }
            console.log('missing')
            await TripSync.processTripCoordinatesSync(respond.data.missing_versions)
        }
        return respond.ok
    }




    async requestLocationConditionsHandler(){
        const coors = await LocationService.getCurrentCoor()
        if(!coors){
            return false
        }
        const longitude = coors.coords.longitude
        const latitude = coors.coords.latitude
        const respond = await TripContents.request_location_conditions(longitude,latitude)
        if(!respond.ok||respond.status!== 200) return false
        const data = respond.data
        if (data.geo_data){
            await locationDataService.setCurrentLocationConditionToLocal(data.geo_data)
            return true
        }
        return false
    
    }

    async getTripCoordinatesHandler(trip_id) {
        let coordinates
        let version

        if (await safeRun(
            () => this.TripCoordinateDatabaseService.getAllCoordinatesFromTripId(trip_id),
            'get_coordinates_failed'
        )) {
            version = await safeRun(
                () => TripDatabaseService.getTripCoordinateVersion(trip_id),
                'get_version_failed'
            )
        }

        const respond = await safeRun(
            () => TripContents.requestTripCoordinates(trip_id, version),
            'fetch_coordinates_failed'
        )

        if (!respond.ok || respond.status !==200) {
            coordinates = await safeRun(
                () => this.TripCoordinateDatabaseService.getAllCoordinatesFromTripId(trip_id),
                'load_local_coordinates_failed'
            )
            console.log(coordinates)
            return coordinates
        }

        const data = respond.data
        if (!data.coordinates) return null

        coordinates = data.coordinates

        if (data.user_id === UserDataService.getUserId()) {
            if (await safeRun(
                () => this.TripCoordinateDatabaseService.handlerCoordinateFromServer(coordinates, trip_id),
                'save_coordinates_failed'
            )) {
                await safeRun(
                    () => TripDatabaseService.updateTripCorrdinateVersion(trip_id, data.newest_version),
                    'update_version_failed'
                )
            }
        }

        return coordinates
    }
    async requestTripMediasHandler(trip_id){
        const trip_media_hash = await HashService.generateAndSaveTripMediaHash(trip_id)
        const respond = await TripContents.requestTripMedias(trip_id,trip_media_hash)
        let assests =[]
        if(!respond.ok || respond.status ===304){
            assests = await Albumdb.getAssestsFromTripId(trip_id)
            return assests
        }
        else if (respond.status !==200) return []
        else return respond.data.medias

    }
    async uploadTripMediaHandler(media_id,trip_id,media_uri,longitude,latitude){
        if (!media_uri)return
        this._uploadPending =(this._uploadPending||0)+1
        try{
            // pending count to prevent spam lead to loop sync
            // send to server
            const respond = await safeRun(()=>TripContents.sendTripMedia(media_id,trip_id,media_uri,longitude,latitude,'image'),'failed_at_send_media_to_server')
                       
            if(!respond.ok || respond.status !==200) return 
           
            const data = respond.data
           
            // sync leave for later
            const hash = data.hash
            
            // after process all request, check hash and sync
            console.log('peding',this._uploadPending)
            if (hash && this._uploadPending ===1){
                TripContentSyncManager.checkTripMediaHash(hash,trip_id)
            }       
            return respond
        }
        catch(err){
            console.error(err)
        }   
        finally{
            this._uploadPending--
        }
    }
   
    async deleteMediaHandler(trip_id,media_id,media_path,media_lib_path){
         // delete in database
        await safeRun(()=>Albumdb.deleteMediaFromDB(media_id,trip_id),'failed_delete_media_from_db')
        
        
        await safeRun(()=>MediaService.deleteMediaToLocalAlbum(media_id),'failed at delete media from album')
        // delete in album 
        Albumdb.deleteFromAlbumArray(media_lib_path)
        CurrentDisplayTripMediaObserver.deleteAssestFromArrayByUri(trip_id,media_path)

        let respond = null
        if (trip_id){

            respond = await TripContents.deleteMedias(trip_id,media_id)
        }
        if(respond.status==200){   
            const data = respond.data
            const hash = data.hash
            if (hash){
                TripContentSyncManager.checkTripMediaHash(hash,trip_id)
            }
        }
       
        return

    }
    // async requestSTripMedias (){
    //     console.log(CurrentTripDataService.getCurrentTripId())
    //     const respond = await TripContents.requestTripMedias(CurrentTripDataService.getCurrentTripId())
    //     if(!respond.ok || respond.status !==200) return
    //     const data = respond.data
    //     await TripContentsDataService.setCurrentMedias(data.medias)
    // }
}

export default new TripContentHandler()