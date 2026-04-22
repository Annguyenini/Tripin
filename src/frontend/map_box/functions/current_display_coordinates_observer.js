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
        try {
            console.log('before', this.CoordsArray[trip_id])
            if (!this.CoordsArray[trip_id]) {
                this.CoordsArray[trip_id] = []
            }
            const new_object = {
                altitude: coords_object.altitude,
                latitude: coords_object.latitude,
                longitude: coords_object.longitude,
                heading: coords_object.heading,
                speed: coords_object.speed,
                time_stamp: coords_object.time_stamp,
                coordinate_id: coords_object.coordinate_id
            }
            this.CoordsArray[trip_id].push(new_object)
            console.log('after', this.CoordsArray[trip_id])
            this.notify(this.GENERATE_KEY(trip_id), this.CoordsArray[trip_id])
        }
        catch (error) {
            console.error(error)
        }
    }
    deleteCoordinateFromArray(trip_id, coordinate_id) {

        try {
            this.CoordsArray[trip_id] = this.CoordsArray[trip_id].filter((media) =>
                media.coordinate_id !== coordinate_id)
            console.log(this.CoordsArray[trip_id])
            this.notify(this.GENERATE_KEY(trip_id), this.CoordsArray[trip_id])
        }
        catch (error) {
            throw new Error('Failed to delete coordinate from watcher!')
        }
    }
}
export default new CurrentDisplayCoordinateObserver()