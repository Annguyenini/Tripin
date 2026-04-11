import LocalStorage from "../../../backend/storage/base/localStorage";
class CurrentDisplayCoordinateObserver extends (LocalStorage) {
    constructor() {
        super()
        this.CoordsArray = {}
    }
    GENERATE_KEY(trip_id) {
        return `coords_array:${trip_id}`
    }
    setDefaultCoordsArray(trip_id, coords_array) {
        try {
            const arr = Array.isArray(coords_array) ? coords_array : []

            if (!this.CoordsArray[trip_id]) {
                this.CoordsArray[trip_id] = arr || []
            }
            this.notify(this.GENERATE_KEY(trip_id), coords_array || [])
        }
        catch (err) {
            console.error(err)
        }

    }
    getCoordArray(trip_id) {
        return this.CoordsArray[trip_id]
    }
    addCoorddinateToArray(trip_id, coords_object) {
        console.log('before', this.CoordsArray[trip_id])
        if (!this.CoordsArray[trip_id]) {
            this.CoordsArray[trip_id] = []
        }
        const new_object = {
            altitude: coords_object.coordinates.altitude,
            latitude: coords_object.coordinates.latitude,
            longitude: coords_object.coordinates.longitude,
            heading: coords_object.coordinates.heading,
            speed: coords_object.coordinates.speed,
            time_stamp: coords_object.time_stamp
        }
        this.CoordsArray[trip_id].push(new_object)
        console.log('after', this.CoordsArray[trip_id])
        this.notify(this.GENERATE_KEY(trip_id), this.CoordsArray[trip_id])
    }
    deleteCoordinateFromArray(trip_id, coordinate_id) {

        try {
            this.CoordsArray[trip_id] = this.CoordsArray[trip_id].filter((media) => {
                return media.coordinate_id != coordinate_id
            })
        }
        catch (error) {
            throw new Error('Failed to delete coordinate from watcher!')
        }
    }
}
export default new CurrentDisplayCoordinateObserver()