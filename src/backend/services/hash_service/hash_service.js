import LocalStorage from "../../storage/base/localStorage";
import safeRun from "../../../app-core/helpers/safe_run";
import Albumdb from "../../album/albumdb";
class HashService extends LocalStorage{
    GENERATE_TRIP_HASH_KEY(trip_id,type){
        return `trip_${trip_id}:${type}:hash`

    }
    async _generateLocalTripMediaHash(mediaList) {
    
        if (!mediaList || mediaList.length === 0) return null;

        // use image_id — must match server
        const sorted = [...mediaList]
            .filter(item => !item.is_deleted)
            .sort((a, b) => a.image_id - b.image_id)  // sort by image_id

        const idsString = sorted.map(item => String(item.image_id)).join(',')  // String() to match str() in python

        const hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.MD5,
            idsString
        )

        return hash
    }
    
    async saveHashToLocalStorage(trip_id,type,hash){
        await safeRun(this.saveToLocal(this.GENERATE_TRIP_HASH_KEY(trip_id,type),hash),'failed_at_save_hash_to_local')
    }

    async getHashFromLocalStorage(trip_id,type){
        return await safeRun(this.getDataFromLocal(this.GENERATE_TRIP_HASH_KEY(trip_id,type)),'failed_at_get_hash_to_local')
    }
}

export default new HashService