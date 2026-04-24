import { DATA_KEYS } from './keys/storage_keys'

import TripLocalDataStorage from './base/trip_base'
import TripDatabaseService from '../database/TripDatabaseService';
import safeRun from '../../app-core/helpers/safe_run';
class CurrentTripDataService extends TripLocalDataStorage {
    /**
     * trip data service, use to store trip_name...
     * struct of data object {
     * "trip_name":trip_name,
            "trip_id":trip_id,
            "created_time":created_time
     * }
     * @returns
     */
    constructor() {
        super()

        this._init_values()
    }

    _init_values() {
        console.log('init')
        this.item = {
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA]: null,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID]: null,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_NAME]: null,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE]: null,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_CREATED_TIME]: null,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS]: false,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STORAGE_KEY]: null,
            [DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_COORDINATES_ARRAY]: [],
            set(prop, value) {
                this[prop] = value
            },
            get(prop) {
                return this[prop]
            }
        }
    }

    // =====================GET==============
    getCurrentTripId() { return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID) }
    getCurrentTripImageUri() { return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE) }
    getCurrentCreatedTime() { return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_CREATED_TIME) }
    getCurrentTripStatus() { return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS) }
    getCurrentTripName() { return this.item.get(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_NAME) }

    /** getTripData
     * trip_data={
     *  "trip_name":trip_name,
        "trip_id":trip_id,
        "created_time":created_time
     * }
     * @returns an object of trip data or null if it empty */


    getCurrentTripDataFromLocal() {
        return TripDatabaseService.getCurrentTripData()
        // return this.getTripDataObjectFromLocal(STORAGE_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA)
    }

    // ==========================================================

    /** Set user data 
    * @paran trip_id
    * @param {object}trip_data - must be an object 
    */

    async saveCurrentTripDataToLocal(trip_data) {

        if (!trip_data || typeof (trip_data) !== 'object' || Array.isArray(trip_data)) {
            console.log('trip_data must be object')
        }
        try {
            // await this.saveTripDataObjectToLocal(STORAGE_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA,trip_data)
            await safeRun(() => TripDatabaseService.addTripToDatabase(trip_data), 'failed_at_save_to_database')
            this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA, trip_data)
            this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID, trip_data.trip_id)
            this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_NAME, trip_data.trip_name)
            this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_CREATED_TIME, trip_data.created_time)
            this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS, true)
            this.item.set(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_IMAGE, trip_data.image)
            this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA, trip_data)
            return true
        }
        catch (err) {
            throw new Error('Failed at save current trip data tp local', err)
        }
    }


    async loadCurrentTripDataFromLocal() {
        try {
            const trip_data = await this.getCurrentTripDataFromLocal()
            if (!trip_data) return false
            if (!await this.saveCurrentTripDataToLocal(trip_data)) return false
            return true

        }
        catch (err) {
            console.error('Failed at loading stored current trip data')
        }
    }
    /**
     * 
     * @param {string} imageUri 
     * @returns final image path inside documentDir
     */
    async setCurrentTripImageCoverToLocal(imageUri, trip_id, source = 'local') {
        try {
            const filename = `${trip_id}_cover.jpg`;
            // save image to local 
            const local_trip_imageuri = await this.saveTripImageToLocal(imageUri, filename, source)
            // update image to database
            await TripDatabaseService.updateValueInDatabase('image', local_trip_imageuri, 'trip_id', trip_id)
            return local_trip_imageuri
        }
        catch (err) {
            console.error('Failed to set trip image', err)
            throw new Error('Failed to set trip image', err)
        }
    }



    async deleteTripImageCoverFromLocal() {
        try {
            const trip_data = await TripDatabaseService.getCurrentTripData()
            const file_path = trip_data['image']
            if (!file_path) return
            await this.deleteDataFromLocal(file_path)
            await this.deleteImageFromLocal(file_path)

        }
        catch (err) {
            console.error('Failed at delete trip image', err)
        }
    }

    /**
     * delete the trip data object
     */
    // async deleteCurrentTripDataFromLocal(){
    //     try{
    //         await this.deleteDataFromLocal(STORAGE_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA)
    //     }
    //     catch(err){
    //         console.error('Failed at delete current trip data',err)
    //     }
    // }

    /**
     * This function will delete trip data, trip image, and set the trip status back to false
     */
    async endCurrentTrip() {
        try {
            await this.deleteTripImageCoverFromLocal()
            await safeRun(() => TripDatabaseService.updateValueInDatabase('active', false, 'trip_id', this.getCurrentTripId()), 'failed_at_set_trip_active')
            await safeRun(() => TripDatabaseService.updateValueInDatabase('ended_time', Date.now(), 'trip_id', this.getCurrentTripId()), 'failed_at_set_ended_time')

        }
        catch (err) {
            console.error('Failed at reset current trip data', err)
        }
        this._init_values()
        this.notify(DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA, null)
    }



    getObjectReady(user_id, trip_id, trip_name, image_path = null, active) {
        return {
            user_id,
            trip_id,
            trip_name,
            created_time: Date.now(),
            image: image_path,
            active: active

        }
    }
    generateCurrentTripIdKey(user_id) {
        return `user_${user_id}:current_trip_id`
    }



}

export default new CurrentTripDataService()