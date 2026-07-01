import LocalStorage from "../../../../backend/storage/async_storage/localStorage";
import { ContentCard } from "../../../../types/content_card.types";

class CurrentDisplayContentsObserver extends LocalStorage {
  // watcher class for map box render logic
  private watchArray: Record<string, Array<ContentCard>>;
  constructor() {
    super();
    this.watchArray = {};
  }
  GENERATE_KEY(trip_id: number) {
    return `contents:${trip_id}`;
  }
  setDefaultArray(trip_id: number, data_array: ContentCard[]) {
    if (!this.watchArray[trip_id]) {
      this.watchArray[trip_id] = [];
    }
    // console.log("media", data_array);
    this.watchArray[trip_id] = data_array;
    this.notify(this.GENERATE_KEY(trip_id), data_array);
    return;
  }
  getAssetArray(trip_id: number) {
    if (!this.watchArray[trip_id]) return [];
    return this.watchArray[trip_id];
  }
  addAssetIntoArray(trip_id: number, data_object: ContentCard) {
    if (!this.watchArray[trip_id]) {
      this.watchArray[trip_id] = [];
    }
    this.watchArray[trip_id].push(data_object);
    this.notify(this.GENERATE_KEY(trip_id), this.watchArray[trip_id]);
  }
  deleteAssestFromArray(trip_id: number, data_object: ContentCard) {
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
