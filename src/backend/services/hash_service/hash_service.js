import LocalStorage from "../../storage/base/localStorage";
import safeRun from "../../../app-core/helpers/safe_run";
import * as Crypto from 'expo-crypto';
import Albumdb from "../../album/albumdb";
class HashService extends LocalStorage{
    GENERATE_TRIP_HASH_KEY(trip_id,type){
        return `trip_${trip_id}:${type}:hash`

    }
    async _generateLocalTripMediaHash(mediaList) {
        if (!mediaList || mediaList.length === 0) return null;

        const sorted = [...mediaList]
            .sort((a, b) => a.media_id.localeCompare(b.media_id))


        const idsString = sorted.map(item => String(item.media_id)).join(',')

        const hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.MD5,
            idsString
        )

        return hash
    }
    
    async saveHashToLocalStorage(trip_id,type,hash){
        await safeRun(()=>this.saveToLocal(this.GENERATE_TRIP_HASH_KEY(trip_id,type),hash),'failed_at_save_hash_to_local')
    }

    async getHashFromLocalStorage(trip_id,type){
        return await safeRun(()=>this.getDataFromLocal(this.GENERATE_TRIP_HASH_KEY(trip_id,type)),'failed_at_get_hash_from_local')
    }
    // 
    /**
     * get and save local hash to local storage
     * @param {*} trip_id 
     * @returns 
     */
    async generateAndSaveTripMediaHash(trip_id){
        let local_hash = await safeRun(()=> this.getHashFromLocalStorage(trip_id,'trip_media'),'failed_at_get_local_hash')
        if (local_hash) return local_hash
        
        const media_metadata = await safeRun(()=>Albumdb.getAssestsFromTripId(trip_id))
        local_hash = await safeRun(()=>this._generateLocalTripMediaHash(media_metadata),'failed_at_generate_trip_media_hash')
        if(local_hash){
            await safeRun(()=>this.saveHashToLocalStorage(trip_id,'trip_media',local_hash),'failed_at_save_hash_to_local')
        }
        return local_hash
    }
    async generateTripMediaHash(trip_id){
        const media_metadata = await safeRun(()=>Albumdb.getAssestsFromTripId(trip_id))
        const local_hash = await safeRun(()=>this._generateLocalTripMediaHash(media_metadata),'failed_at_generate_trip_media_hash')
        if(local_hash){
            await safeRun(()=>this.saveHashToLocalStorage(trip_id,'trip_media',local_hash),'failed_at_save_hash_to_local')
        }
        return local_hash
    }
}

export default new HashService