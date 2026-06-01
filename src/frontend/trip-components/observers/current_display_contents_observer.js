import LocalStorage from "../../../backend/storage/async_storage/localStorage";
class CurrentDisplayContentsObserver extends LocalStorage {
  // watcher class for map box render logic
  constructor() {
    super();
    this.watchArray = {};
  }
  GENERATE_KEY(trip_id) {
    return `contents:${trip_id}`;
  }
  setDefaultArray(trip_id, data_array) {
    if (!this.watchArray[trip_id]) {
      this.watchArray[trip_id] = [];
    }
    // console.log("media", data_array);
    this.watchArray[trip_id] = data_array;
    this.notify(this.GENERATE_KEY(trip_id), data_array);
    return;
  }
  getAssetArray(trip_id) {
    if (!this.watchArray[trip_id]) return [];
    return this.watchArray[trip_id];
  }
  addAssetIntoArray(trip_id, data_object) {
    if (!this.watchArray[trip_id]) {
      this.watchArray[trip_id] = [];
    }
    this.watchArray[trip_id].push(data_object);
    this.notify(this.GENERATE_KEY(trip_id), this.watchArray[trip_id]);
  }
  deleteAssestFromArray(trip_id, data_object) {
    if (!this.watchArray[trip_id]) {
      return;
    }
    this.watchArray[trip_id] = this.watchArray[trip_id].filter(
      (media) => media.uuid != data_object.uuid,
    );

    this.notify(this.GENERATE_KEY(trip_id), this.watchArray[trip_id]);
  }
}
export default new CurrentDisplayContentsObserver();
