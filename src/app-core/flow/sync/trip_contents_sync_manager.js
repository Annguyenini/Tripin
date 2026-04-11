import TripContentsSyncService from "../../../backend/services/sync/trip_contents_sync";
import HashService from "../../../backend/services/hash_service/hash_service";
import Albumdb from "../../../backend/album/albumdb";
import safeRun from "../../helpers/safe_run";
import TripContentsSync from "./trip_contents_sync";
import TripDatabaseService from "../../../backend/database/TripDatabaseService";
import { UseOverlay } from "../../../frontend/overlay/overlay_main";
import TripContents from "../../../backend/services/trip_contents";
import MediaService from "../../../backend/media/media_service";
import TripCoordinateDatabase from "../../../backend/database/trip_coordinate_database";

let _onCallBack = null

export const _registerSyncingCallback = (callback) => {
    _onCallBack = callback
}

class TripContentSyncManager {

    constructor() {
        this.TripCoordinateDatabaseService = new TripCoordinateDatabase()
    }

    // ─── Media Hash ───────────────────────────────────────────────────────────

    async _getAndCompareTripMediasHash(trip_id) {
        const response = await safeRun(() => TripContentsSyncService.requestTripMediasHash(trip_id), 'failed_at_get_trip_media_hash_from_server')
        if (!response.ok || response.status !== 200 || !response.data.hash) return false

        const local_hash = await safeRun(() => Albumdb.getMediaHash(trip_id), 'failed to get max modified time')
        console.log('down', local_hash, response.data.hash)

        return response.data.hash == local_hash
    }

    // ─── Media Download ───────────────────────────────────────────────────────

    async _downloadMedias(trip_id, localArray) {
        const response = await TripContents.requestTripMedias(trip_id)
        if (!response.ok || response.status !== 200) return false

        const serverMedias = response.data.medias
        const download_array = serverMedias.filter((server) => {
            return !localArray.find((local) => local.media_id === server.media_id)
        })
        if (!download_array) return

        let savedArray
        try {
            savedArray = await Promise.all(
                download_array.map(async (asset) => {
                    const localPath = await safeRun(() => MediaService._saveMediaToLocalStorage(asset.media_path, asset.media_type, 's3'), 'faiel')
                    asset.media_path = localPath
                    return asset
                })
            )

            await Promise.all(
                savedArray.map(async (asset) => {
                    try {
                        console.log(asset)
                        await Albumdb.addMediaIntoDB(asset.media_type, asset.media_path, asset.time_stamp, asset.media_id, asset.longitude, asset.latitude, asset.coordinate_id)
                    } catch (err) {
                        console.error("failed at save medias to database", err)
                        throw err
                    }
                })
            )
        } catch (error) {
            console.error(error)
        } finally {
            return
        }
    }

    // ─── Media Metadata ───────────────────────────────────────────────────────

    async _getAndProcessTripMediasMetadata(trip_id) {
        const response = await safeRun(() => TripContentsSyncService.requestTripMediasMetadata(trip_id), 'failed_at_get_trip_media_metadata_from_server')
        const server_metadata = response.data.metadata
        if (!response.ok || response.status !== 200 || !server_metadata) return null

        const local_trip_media_assets = await safeRun(() => Albumdb.getAssestsFromTripId(trip_id), 'failed_at_get_trip_media')
        if (!local_trip_media_assets) {
            const freshSave = await this._freshSaveMediasHandler(trip_id)
            if (!freshSave) return
        }

        const delete_array = server_metadata.filter(server_media =>
            local_trip_media_assets.find(local =>
                local.media_id === server_media.media_id &&
                local.event == 'remove' &&
                server_media.event == 'add'
            )
        )

        const upload_array = local_trip_media_assets.filter(local =>
            !server_metadata.find(server => server.media_id === local.media_id)
        )

        if (delete_array) await safeRun(() => this._processRequestDeleteTripMedias(trip_id, delete_array), 'failed_to_process_trip_media_delete_sync')
        if (upload_array) await safeRun(() => this._processRequestUploadTripMedias(trip_id, upload_array), 'failed_to_process_trip_upload_delete_sync')
        await safeRun(() => this._downloadMedias(trip_id, local_trip_media_assets))
        return
    }

    // ─── Coordinate Sync ──────────────────────────────────────────────────────

    async _getAndProcessTripCoordinateHash(trip_id) {
        const server_coordinate = await safeRun(() => TripContentsService.requestTripCoordinates(trip_id))
        const local_coordinate = await safeRun(() => this.TripCoordinateDatabase.getAllCoordinatesFromTripId(trip_id))

        const delete_array = server_coordinate.filter((server) => {
            local_coordinate.find((local) =>
                local.coordinate_id === server.coordinate_id &&
                local.event === 'remove' &&
                server.event !== 'remove'
            )
        })

        const upload_array = local_coordinate.filter((local) => {
            !server_coordinate.find((server) => { server.coordinate_id === local.coordinate_id })
        })

        const download_array = server_coordinate.filter((server) => {
            !local_coordinate.find((local) => { local.coordinate_id === server.coordinate_id })
        })
    }

    async tripCoordinateSync(trip_id) {
        const respond = await safeRun(() => TripContentsSyncService.requestTripCoordinateHash(trip_id), 'failed_at_request_trip_coordinate_hash')
        if (!respond.ok || respond.status !== 200) return

        const server_hash = respond.data.hash
        const local_hash = await safeRun(() => this.TripCoordinateDatabaseService.getTripCoordinateHash(trip_id), 'failed_at_get_trip_coordinate_version')

        if (server_hash === local_hash) {
            if (_onCallBack) _onCallBack(false)
            return
        }

        await safeRun(() => TripContentsSync.processTripCoordinatesSync(trip_id), 'failed_at_process_trip_coordinate_sync')
        if (_onCallBack) _onCallBack(false)
    }

    async tripCoordinateSyncHandler(trip_id) {

    }

    // ─── Media Sync ───────────────────────────────────────────────────────────

    async _processRequestDeleteTripMedias(trip_id, delete_array) {
        delete_array.forEach(element => {
            TripContentsSync.addIntoQueue('delete_media', null, element)
        })
        await safeRun(() => TripContentsSync.process(), 'failed_at_process_delete_media_sync')
        return
    }

    async _processRequestUploadTripMedias(trip_id, upload_array) {
        upload_array.forEach(element => {
            TripContentsSync.addIntoQueue('media', null, element)
        })
        await safeRun(() => TripContentsSync.process(), 'failed_at_process_upload_media_sync')
        return
    }

    async tripMediaSyncHandler(trip_id) {
        if (_onCallBack) _onCallBack(true)
        const compare_hash = await this._getAndCompareTripMediasHash(trip_id)
        if (!compare_hash) {
            await safeRun(() => this._getAndProcessTripMediasMetadata(trip_id), 'failed_at_trip_media_sync_manager')
        }
        if (_onCallBack) _onCallBack(false)
        return
    }

    // ─── Hash Check ───────────────────────────────────────────────────────────

    async checkTripMediaHash(hash, trip_id) {
        if (_onCallBack) _onCallBack(true)
        const local_hash = await safeRun(() => Albumdb.getMediaHash(trip_id), 'failed to get max modified time')

        if (local_hash && local_hash != hash) {
            try {
                await this._getAndProcessTripMediasMetadata(trip_id)
                if (_onCallBack) _onCallBack(false)
                return { 'ok': true, 'code': 'sync_complete' }
            } catch (err) {
                if (_onCallBack) _onCallBack(false)
                return { 'ok': false, 'code': 'sync_failed' }
            }
        }

        if (_onCallBack) _onCallBack(false)
        if (!local_hash) return { 'ok': true, 'code': 'fresh' }
        return { 'ok': true, 'code': 'no_sync' }
    }

}

export default new TripContentSyncManager