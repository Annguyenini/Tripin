import Albumdb from "../album/albumdb"
import TripContentHandler from "../../app-core/flow/trip_contents_handler"
import CurrentTripCoordinateService from '../trip_coordinates/current_trip_coordinate_service'
import CurrentTripDataService from '../storage/current_trip'
import CurrentDisplayTripMediaObserver from "../../frontend/map_box/functions/current_display_media_observer"
import LocationData from "../../app-core/local_data/local_location_data"
import safeRun from "../../app-core/helpers/safe_run"
import * as MediaLibrary from 'expo-media-library';
import * as Crypto from 'expo-crypto';
import * as AlbumPermission from '../album/album_permission'
import { copyAsync, deleteAsync, documentDirectory, downloadAsync, makeDirectoryAsync } from 'expo-file-system/legacy';

const ALBUM_NAME = "Tripin_album";

class MediaService {
    GENERATE_MEDIA_ID(media_type, id) {
        // return `${trip_id ? `trip_${trip_id}`:''}:${media_type}:${time_stamp}`
        return `${media_type}:${id}`

    }
    async saveMediaHandler(media_uri, type) {
        let asset_object
        let media_id
        let local_uri
        let coordinate_id
        let time_stamp = Date.now()
        const trip_id = CurrentTripDataService.getCurrentTripId()
        // get coordinate for image
        const { coords: location_data } = await safeRun(() => LocationData.getCurrentCoor(), 'failed_at_get_location')
        if (!location_data) {
            return
        }
        const longitude = location_data.longitude
        const latitude = location_data.latitude
        try {
            // save to camera roll, gallery
            local_uri = await safeRun(() => this.saveMediaToLocalAlbum(media_uri, type), 'failed_at_save_media_to_gallery')
            if (!local_uri) {
                throw new Error('Failed to generate asset!')
            }
            // generate media an unique media id 
            media_id = this.GENERATE_MEDIA_ID(type, local_uri)
            coordinate_id = Crypto.randomUUID()
            // get object ready to insert into album 
            asset_object = Albumdb.getAlbumAssetObjectReady(local_uri, media_id, type, latitude, longitude, coordinate_id)

            // add media into sqlite 3
            await safeRun(() => Albumdb.addMediaIntoDB(type, local_uri, time_stamp, media_id, longitude, latitude, coordinate_id), 'failed_at_save_image_to_sqlite3')

            // insert into album 
            Albumdb.addToAlbumArray(asset_object)
        }
        catch (err) {
            console.error('Failed to save media to local db', err)
            throw new ('Failed to save image to local')
        }
        // if in a active trip 
        if (trip_id) {
            try {

                TripContentHandler.uploadTripMediaHandler(media_id, trip_id, media_uri, longitude, latitude, coordinate_id, type, time_stamp)
                // generate a location object
                const coordinate_object = CurrentTripCoordinateService.generateCoordinatePayload(location_data, coordinate_id)
                // add the coordinate obejct to service
                CurrentTripCoordinateService.push(coordinate_object)
                // display to map
                CurrentDisplayTripMediaObserver.addAssetIntoArray(trip_id, asset_object)
            }
            catch (err) {
                console.error(err)
            }
        }
        return
    }

    async _saveMediaToCameraroll(uri) {
        try {
            const asset = await safeRun(() => MediaLibrary.createAssetAsync(uri), 'failed_to_save_asset')
            const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
            if (album) {
                const safeToAlbum = await safeRun(() => MediaLibrary.addAssetsToAlbumAsync([asset], album, false), 'failed_at_save_to_camera_roll_album')
                return asset.uri
            }
            else {
                await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset);
                return await this.saveMediaToLocalAlbum(uri)
            }
        }
        catch (error) {
            console.error("Error at save media to album: ", error);
            throw new Error('failed to save image to gallery')
        }
    }

    async _saveMediaToLocalStorage(uri, type, source = 'local') {
        try {
            let fileName
            if (type === 'video') {
                const ext = uri.endsWith('.mov') ? 'mov' : 'mp4';
                fileName = `${Crypto.randomUUID()}.${ext}`;
            }
            else {
                fileName = `${Crypto.randomUUID()}.jpg`;
            }

            const localUri = `${documentDirectory}media/${fileName}`;
            await makeDirectoryAsync(
                `${documentDirectory}media/`,
                { intermediates: true }
            );
            if (source != 'local') {
                await downloadAsync(uri, localUri);
            }
            else {
                await copyAsync({ from: uri, to: localUri });
            }
            return localUri
        }
        catch (error) {
            console.error("Error at save media to album: ", error);
            throw new Error('failed to save image to local storage')
        }
    }
    async saveMediaToLocalAlbum(uri, type) {
        /**
         * save to local, depend on user allow app to access full album
         * generate depe
         */
        try {
            const albumPermission = await safeRun(() => AlbumPermission.getAlbumPermission())
            if (albumPermission.accessPrivileges === 'all') {
                const assetUri = await this._saveMediaToCameraroll(uri)
                return assetUri
            }
            else if (albumPermission.accessPrivileges === 'limited') {
                const localUri = await this._saveMediaToLocalStorage(uri, type)
                return localUri
            }
        }
        catch (error) {
            console.error(error)
            return null
        }
        // console.log("save successfully")

    }


    async deleteMediaToLocalAlbum(path) {
        const id = path.replace(/^(photo|video):/, '').replace(/^ph:\/\//, ''); if (id.length < 10) return
        console.log('id', id)
        try {
            if (id.includes('file://')) {
                await safeRun(() => deleteAsync(id), 'faild_to_delete_media_document')
                return
            }
            const permission = await AlbumPermission.getAlbumPermission()
            if (permission.accessPrivileges !== 'all') return
            await MediaLibrary.deleteAssetsAsync([id])
        }
        catch (error) {
            console.error("Error at delete from album: ", error);
            // throw new Error('Failed to delete from gallery')
        }
        // console.log("save successfully")

    }
}
export default new MediaService