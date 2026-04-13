

import * as SQLite from 'expo-sqlite';
import * as DBCONFIG from '../../config/config_db'
import CurrentTripDataService from '../storage/current_trip'
import * as Location from 'expo-location'
import SqliteService from '../database/sqlite/sqlite';
import TripContentsHandler from '../../app-core/flow/trip_contents_handler';
import TripCoordinateDatabase from '../database/trip_coordinate_database';
import TripDatabase from '../database/TripDatabaseService'
import CurrentDisplayCoordinateObserver from '../../frontend/map_box/functions/current_display_coordinates_observer';
class CurrentTripCoordinateService extends TripCoordinateDatabase {
    // storing trip coordinate to db

    constructor() {
        super()
        this.storage = []
        this.isTimerStart = false
    }

    async init_new_trip(trip_id) {

        return await this.create_trip(trip_id)
    }
    async insert_into_DB(temp_storage) {
        console.log('save to database', temp_storage)
        const DB = await SqliteService.connectDB()
        const current_version = await TripDatabase.getTripCoordinateVersion(CurrentTripDataService.getCurrentTripId()) + 1
        await DB.withTransactionAsync(async () => {

            for (const item of temp_storage) {

                try {
                    await DB.runAsync(`INSERT INTO trip_${CurrentTripDataService.getCurrentTripId()} (altitude, latitude, longitude,heading,speed,time_stamp,version,event,coordinate_id,modified_time) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                        [item.altitude,
                        item.latitude,
                        item.longitude,
                        item.heading,
                        item.speed,
                        item.time_stamp,
                            current_version,
                        item.event,
                        item.coordinate_id,
                        item.modified_time])
                }
                catch (err) {
                    console.error(err)
                }
            }
        })
        return current_version
    }

    // async printAllCoordinatesFromTripId(trip_id){
    //     const DB = await SqliteService.connectDB()
    //     try{
    //         const allRows = await DB.getAllAsync(`SELECT * FROM trip_${trip_id};`)

    //     }
    //     catch(err){
    //         console.error (err)
    //     }
    // }
    startTimer() {
        if (this.isTimerStart) return
        this.isTimerStart = true
        setTimeout(() => {
            console.log('start timer')
            this.coordinatesStorageHandler()
            this.isTimerStart = false
        }, 1000)
    }
    async coordinatesStorageHandler() {
        const temp_storage = [...this.storage]
        this.storage.length = 0
        if (temp_storage.length === 0) return
        console.log('befor save')
        const version = await this.insert_into_DB(temp_storage)

        await TripDatabase.updateTripCorrdinateVersion(CurrentTripDataService.getCurrentTripId(), version)

        const send_coor = await TripContentsHandler.sendCoordinatesHandler(temp_storage, version)
        // const request_con = await Trip.request_location_conditions()
    }
    /**
     * 
     * @param {*} time - timestamp of an object
     * @param {*} trip_data_object - the object it self
     */
    async push(trip_data_object = null) {
        console.log('push', trip_data_object)
        if (trip_data_object === null) {
            const temp = await Location.getCurrentPositionAsync()
            const payload = {
                time_stamp: Date.now(),
                latitude: temp.coords.latitude,
                longitude: temp.coords.longitude,
                altitude: temp.coords.altitude,
                speed: temp.coords.speed,
                heading: temp.coords.heading,

                type: null
            };
            trip_data_object = payload
        }

        console.assert(typeof (trip_data_object) === 'object', 'trip data must be an object')
        console.assert(this.storage, "storage undefined")
        this.storage.push(trip_data_object);
        CurrentDisplayCoordinateObserver.addCoorddinateToArray(CurrentTripDataService.getCurrentTripId(), trip_data_object)
        this.startTimer()
        this.coordinatesStorageHandler()

    }
    generateCoordinatePayload(coordinate_payload, coordinate_id, time_stamp) {
        const payload = {
            time_stamp: time_stamp,

            ...coordinate_payload,
            event: 'add',
            coordinate_id: coordinate_id,
            modified_time: time_stamp,

            type: null
        };
        return payload
    }


}



const trip_storage = new CurrentTripCoordinateService()
export default trip_storage