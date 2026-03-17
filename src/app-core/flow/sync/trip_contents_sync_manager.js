import TripContentsSyncService from "../../../backend/services/sync/trip_contents_sync";
import HashService from "../../../backend/services/hash_service/hash_service";
import Albumdb from "../../../backend/album/albumdb";
import safeRun from "../../helpers/safe_run";
import TripContentsSync from "./trip_contents_sync";
class TripContentSyncManager{


    async checkTripMediaHash(hash,trip_id){
        let local_hash = await safeRun(()=>HashService.getHashFromLocalStorage(trip_id,'trip_media'),'failed_at_get_local_trip_media_hash')
        if(!local_hash){
            const media_metadata = await safeRun(()=>Albumdb.getAssestsFromTripId(trip_id))
            local_hash = await safeRun(()=>HashService._generateLocalTripMediaHash(media_metadata),'failed_at_generate_trip_media_hash')
            if(local_hash){
                await safeRun(()=>HashService.saveHashToLocalStorage(trip_id,'trip_media'),'failed_at_save_hash_to_local')
            }
        }
        if (local_hash !== hash){
            await this._getAndProcessTripMediasMetadata(trip_id)
        }
        return
    }
    
    async tripMediaSyncManager(trip_id){

    }
    
    async _getAndCompareTripMediasHash(trip_id){
        const response = await safeRun(()=>TripContentsSyncService.requestTripMediasHash(trip_id),'failed_at_get_trip_media_hash_from_server')
        if (!response.ok || response.status !== 200 || !response.data.hash) return false
        // localhash
        let local_hash = await safeRun(()=>HashService.getHashFromLocalStorage(trip_id,'trip_media'),'failed_at_get_local_trip_media_hash')
        if(!local_hash){
            const media_metadata = await Albumdb.getAssestsFromTripId(trip_id)
            local_hash = await HashService._generateLocalTripMediaHash(media_metadata)
            if(local_hash){
                await HashService.saveHashToLocalStorage(trip_id,'trip_media')
            }
        }
        return response.data.hash === local_hash
    }

    async _getAndProcessTripMediasMetadata(trip_id){
        const response = await safeRun(()=>TripContentsSyncService.requestTripMediasMetadata(trip_id),'failed_at_get_trip_media_metadata_from_server')
        const server_metadata = response.data.metadata
        if (!response.ok || response.status !== 200 || !server_metadata) return null
        

        const local_trip_media_assets = await safeRun( ()=>Albumdb.getAssestsFromTripId(trip_id),'failed_at_get_trip_media')
        // define as items that server carry but local not 
        const delete_array = server_metadata.filter( server_media =>
            ! local_trip_media_assets.find(local => local.image_id === server_media.image_id)
        )
        //define as items that local carry but server not 
        const upload_array = local_trip_media_assets.filter(local=>
            ! server_metadata.find(server=>server.image_id === local.image_id)
        ) 

    }
    async _processRequestDeleteTripMedias(trip_id){
        
    }
    async _processRequestUploadTripMedias(trip_id,id_array){
        
    }
    async syncTripMedia(trip_id){
        // server hash 
        //get local hash
        // if not match
        // request metadatas
        // compare with current storage
        // add to queue
        const response = await TripContentsSyncService.requestTripMediasHash(trip_id)
        
        // localhash
        const local_hash = await HashService.getHashFromLocalStorage(trip_id,'trip_media')

    }
}
export default new TripContentSyncManager