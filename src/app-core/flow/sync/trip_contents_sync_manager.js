import TripContentsSyncService from "../../../backend/services/sync/trip_contents_sync";
import HashService from "../../../backend/services/hash_service/hash_service";
import Albumdb from "../../../backend/album/albumdb";
import safeRun from "../../helpers/safe_run";
import TripContentsSync from "./trip_contents_sync";
import TripDatabaseService from "../../../backend/database/TripDatabaseService";
import { UseOverlay } from "../../../frontend/overlay/overlay_main";
import TripContents from "../../../backend/services/trip_contents";
import MediaService from "../../../backend/media/media_service";
let _onCallBack = null
export const _registerSyncingCallback =(callback)=>{
    _onCallBack = callback
}
class TripContentSyncManager{
    
    /**
     * request server trip media hash and compare with the local
     * @param {*} trip_id 
     * @returns 
     */
    async _getAndCompareTripMediasHash(trip_id){
        const response = await safeRun(()=>TripContentsSyncService.requestTripMediasHash(trip_id),'failed_at_get_trip_media_hash_from_server')
        if (!response.ok || response.status !== 200 || !response.data.hash) return false
        // localhash
        const local_hash = await HashService.generateAndSaveTripMediaHash(trip_id)
        return response.data.hash === local_hash
    }
    /**
     * handle when user have no data related to the trip media but server do
     * @param {*} imageArray 
     */
    async _freshSaveMediasHandler(trip_id){
        const response = await TripContents.requestTripMedias(trip_id);
        if (!response.ok || response.sattus!==200) return false
        const serverMedias = response.data
        let savedArray
        try{
            savedArray= await Promise.all(
            serverMedias.map(async(asset)=>{
                const localPath= await MediaService._saveMediaToLocalStorage (asset.media_path,asset.media_type)
                asset.media_path = localPath
                return asset
            })

            )
            // save into database
            await Promise.all(async()=>{
                serverMedias.map(async(asset)=>{
                    try{
                        await Albumdb.addMediaIntoDB(asset.media_type,asset.media_path,asset.time_stamp,asset.media_id,asset.longitude,asset.latitude,asset.coordinate_id)
                    }
                    catch(err){
                        console.error("failed at save medias to database",err)
                        throw err
                    }
                })
            })
            return true
        }   
        catch(error){
            console.error(error)
            return false
        }
    }
    /**
     * request trip media metadata, compare and request sync if need
     * @param {*} trip_id 
     * @returns 
     */
    async _getAndProcessTripMediasMetadata(trip_id){
        const response = await safeRun(()=>TripContentsSyncService.requestTripMediasMetadata(trip_id),'failed_at_get_trip_media_metadata_from_server')
        const server_metadata = response.data.metadata
        if (!response.ok || response.status !== 200 || !server_metadata) return null
        

        const local_trip_media_assets = await safeRun( ()=>Albumdb.getAssestsFromTripId(trip_id),'failed_at_get_trip_media')
        // if some how user doesn't have any data (reinstall app...)
        // pass into function that save all current medias to local cache
        // update it 
        // note this doable because every trip create have there own table
        // event if trip empty it will return [] not null
        
        if (!local_trip_media_assets) {
            // make a fucntion that save image of trip to local
            const freshSave = await this._freshSaveMediasHandler(trip_id)
            if (!freshSave) return
        }
        // define at items marked as remove in local but not in server
        const delete_array = server_metadata.filter( server_media =>
            local_trip_media_assets.find(local => local.media_id === server_media.media_id && local.event =='remove' && server_media.event =='add')
        )
        //define as items that local carry but server not 
        const upload_array = local_trip_media_assets.filter(local=>
            ! server_metadata.find(server=>server.media_id === local.media_id)
        ) 
        if ( delete_array )await safeRun(()=>this._processRequestDeleteTripMedias(trip_id,delete_array),'failed_to_process_trip_media_delete_sync')
        if ( upload_array )await safeRun(()=>this._processRequestUploadTripMedias(trip_id,upload_array),'failed_to_process_trip_upload_delete_sync')
        return
    }
    /**
     * sync fucntion for delete media
     * @param {*} trip_id 
     * @param {*} delete_array 
     * @returns 
     */
    async _processRequestDeleteTripMedias(trip_id,delete_array){
        delete_array.forEach(element => {
            TripContentsSync.addIntoQueue('delete_media',null,element)
        });
        await safeRun (()=>TripContentsSync.process(),'failed_at_process_delete_media_sync')
        return
    }

    /**
     * sync function for upload media
     * @param {*} trip_id 
     * @param {*} upload_array 
     * @returns 
     */
    async _processRequestUploadTripMedias(trip_id,upload_array){
        upload_array.forEach(element => {
            TripContentsSync.addIntoQueue('media',null,element)
        });
        await safeRun (()=>TripContentsSync.process(),'failed_at_process_upload_media_sync')
        return
    }

    async tripCoordinateSync(trip_id){
        // callback to ui
        if (_onCallBack)_onCallBack(true)


        const respond = await safeRun(()=>TripContentsSyncService.requestTripCoordinateVersions(trip_id),'failed_at_request_trip_coordinate_version')
        if (!respond.ok||respond.status!==200) return
        const server_version = respond.data.coordinates_version
        const local_service = await safeRun(()=>TripDatabaseService.getTripCoordinateVersion(trip_id),'failed_at_get_trip_coordinate_version')
        
        if (server_version===local_service){
            if (_onCallBack)_onCallBack(false)
            return
        }
        await safeRun(()=>TripContentsSync.processTripCoordinatesSync(server_version),'failed_at_process_trip_coordinate_sync')
        // callback to ui
        if (_onCallBack)_onCallBack(false)


    }
    /**
     * handler trip media sync 
     * @param {*} trip_id 
     * @returns 
     */
    async tripMediaSyncHandler(trip_id){
        // callback to ui
        if (_onCallBack)_onCallBack(true)
        const compare_hash = await this._getAndCompareTripMediasHash(trip_id)
        if (!compare_hash){
            await safeRun(()=>this._getAndProcessTripMediasMetadata(trip_id),'failed_at_trip_media_sync_manager')
        }
        // callback to ui
        if (_onCallBack)_onCallBack(false)

        return
    }

    /**
     * function use to check hash from server and local and request sync if need
     * @param {*} hash 
     * @param {*} trip_id 
     * @returns 
     */
    async checkTripMediaHash(hash,trip_id){
        // callback to ui
        if (_onCallBack)_onCallBack(true)
        const local_hash = await safeRun(()=>HashService.generateTripMediaHash(trip_id),'faild_at_generate_and_save_trip_hash')
        if (local_hash && local_hash !== hash){
            // await this._getAndProcessTripMediasMetadata(trip_id)
            try{
                await this._getAndProcessTripMediasMetadata(trip_id)
                if (_onCallBack)_onCallBack(false)
                return {'ok':true,'code':'sync_complete'}
            }
            catch(err){
                if (_onCallBack)_onCallBack(false)
                return {'ok':false,'code':'sync_failed'}
            }
        }
        // callback to ui
        if (_onCallBack)_onCallBack(false)
        if(!local_hash) return {'ok':true,'code':'fresh'}
        return {'ok':true,'code':'no_sync'}
    }
    
    async tripCoordinateSyncHandler(trip_id){

    }
}
export default new TripContentSyncManager