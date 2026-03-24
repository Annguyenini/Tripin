import TripContentsSyncService from "../../../backend/services/sync/trip_contents_sync";
import HashService from "../../../backend/services/hash_service/hash_service";
import Albumdb from "../../../backend/album/albumdb";
import safeRun from "../../helpers/safe_run";
import TripContentsSync from "./trip_contents_sync";
import TripDatabaseService from "../../../backend/database/TripDatabaseService";
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
     * request trip media metadata, compare and request sync if need
     * @param {*} trip_id 
     * @returns 
     */
    async _getAndProcessTripMediasMetadata(trip_id){
        const response = await safeRun(()=>TripContentsSyncService.requestTripMediasMetadata(trip_id),'failed_at_get_trip_media_metadata_from_server')
        const server_metadata = response.data.metadata
        if (!response.ok || response.status !== 200 || !server_metadata) return null
        

        const local_trip_media_assets = await safeRun( ()=>Albumdb.getAssestsFromTripId(trip_id),'failed_at_get_trip_media')
        // define as items that server carry but local not \

        const delete_array = server_metadata.filter( server_media =>
            ! local_trip_media_assets.find(local => local.media_id === server_media.media_id)
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
        const respond = await safeRun(()=>TripContentsSyncService.requestTripCoordinateVersions(trip_id),'failed_at_request_trip_coordinate_version')
        if (!respond.ok||respond.status!==200) return
        const server_version = respond.data.coordinates_version
        const local_service = await safeRun(()=>TripDatabaseService.getTripCoordinateVersion(trip_id),'failed_at_get_trip_coordinate_version')
        if (server_version===local_service)return
        await safeRun(()=>TripContentsSync.processTripCoordinatesSync(server_version),'failed_at_process_trip_coordinate_sync')
    }
    /**
     * handler trip media sync 
     * @param {*} trip_id 
     * @returns 
     */
    async tripMediaSyncHandler(trip_id){
        const compare_hash = await this._getAndCompareTripMediasHash(trip_id)
        if (!compare_hash){
            await safeRun(()=>this._getAndProcessTripMediasMetadata(trip_id),'failed_at_trip_media_sync_manager')
        }
        return
    }

    /**
     * function use to check hash from server and local and request sync if need
     * @param {*} hash 
     * @param {*} trip_id 
     * @returns 
     */
    async checkTripMediaHash(hash,trip_id){
        const local_hash = await safeRun(()=>HashService.generateTripMediaHash(trip_id),'faild_at_generate_and_save_trip_hash')
        if (local_hash !== hash){
            // await this._getAndProcessTripMediasMetadata(trip_id)
            await safeRun(()=> this._getAndProcessTripMediasMetadata(trip_id),'failed_at_sync_trip_media')
        }
        return
    }
    
    async tripCoordinateSyncHandler(trip_id){

    }
}
export default new TripContentSyncManager