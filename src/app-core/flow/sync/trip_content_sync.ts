// the purpose of this calss

import TripContents from "../../../backend/services/trip_contents";
import TripContentsDatabase from "../../../backend/storage/database/protected/trip_contents";
import safeRun from "../../helpers/safe_run";
import TripContentsHandler from "../handlers/trip_contents/trip_contents_handler";
import TripContentsBucketProcessor from "../handlers/trip_contents/process_bucket";
import { ContentCard } from "../../../types/content_card.types";
type CallBack = (value: boolean) => void;
class TripContentsSync {
  private _pending: boolean = false;
  private _callBacks: Array<CallBack> = [];
  registerSyncingCallback(callback: CallBack) {
    this._callBacks.push(callback);
  }
  emit(value: boolean) {
    if (this._callBacks.length <= 1) return;
    this._callBacks.forEach((callback) => {
      try {
        callback(value);
      } catch (err) {
        console.error(`error emit message: ${err}`);
      }
    });
    return;
  }
  async forceSyncTripContentHander(trip_id: number) {
    if (this._pending) return;
    this._pending = true;

    try {
      this.emit(true);
      await this._getAndProcessTripContentsMetadata(trip_id);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      this._pending = false;
      this.emit(false);
    }
  }
  async syncTripContentsHandler(trip_id: number) {
    if (this._pending) return;
    console.log("pending");
    this._pending = true;

    try {
      this.emit(true);
      // const local_hash =
      //   await TripContentsDatabase.getTripContentsHash(trip_id);

      // const respond = await TripContents.requestTripContentsHash(trip_id);
      // const server_hash = respond?.data?.hash;
      // if (local_hash === server_hash && local_hash && server_hash) return;
      await this._getAndProcessTripContentsMetadata(trip_id);
    } catch (err) {
      console.error(err);
    } finally {
      this._pending = false;

      this.emit(false);
    }
    // request content hash
    // check contents hash
    // separate into each buckets
    // process to sync
  }
  async _downloadMedias(trip_id, download_array) {
    if (!download_array) return;

    let savedArray;
    try {
      savedArray = await Promise.all(
        download_array.map(async (asset) => {
          const localPath = await safeRun(
            () =>
              MediaService._saveMediaToLocalStorage(
                asset.media_path,
                asset.media_type,
                "s3",
              ),
            "failed_to_download",
          );
          asset.media_path = localPath;
          return asset;
        }),
      );

      await Promise.all(
        savedArray.map(async (asset) => {
          try {
            const content_cards = TripContentsDatabase.createContentCard({
              uuid: asset.uuid,
              trip_id: asset.trip_id,
              media_type: asset.media_type,
              media_path: asset.media_path,
              time_stamp: asset.time_stamp,
              media_id: asset.media_id,
              event: "add",
              altitude: asset.altitude,
              latitude: asset.latitude,
              longitude: asset.longitude,
              speed: asset.speed,
              heading: asset.heading,
              city: asset.city,
              region: asset.region,
              country: asset.country,
              iso_country_code: asset.iso_country_code,
              filename: asset.filename,
              minetype: asset.minetype,
            });
            await safeRun(
              () => TripContentsDatabase.addCardIntoDB(content_cards),
              "failed to download medias",
            );
          } catch (err) {
            console.error("failed at save medias to database", err);
            throw err;
          }
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      return;
    }
  }
  async _getAndProcessTripContentsMetadata(trip_id: number) {
    try {
      //get the data
      const response = await safeRun(
        () => TripContents.requestTripMedias(trip_id),
        "failed_at_get_trip_media_metadata_from_server",
      );
      if (!response.ok || response.status !== 200) return null;
      const server_contents = response.data.content_cards;

      const local_trip_content_assets = await safeRun(
        () => TripContentsDatabase.getAssestsFromTripId(trip_id),
        "failed_at_get_trip_media",
      );

      const delete_array = local_trip_content_assets.filter(
        (local: ContentCard) =>
          server_contents.find(
            (server: ContentCard) =>
              server.uuid === local.uuid &&
              server.event == "add" &&
              local.event == "remove",
          ),
      );

      const upload_array = local_trip_content_assets.filter(
        (local: ContentCard) =>
          !server_contents.find(
            (server: ContentCard) => server.uuid === local.uuid,
          ),
      );

      const download_array = server_contents.filter(
        (server: ContentCard) =>
          !local_trip_content_assets.find(
            (local: ContentCard) => local.uuid === server.uuid,
          ),
      );

      if (upload_array.length >= 1 || delete_array.length >= 1) {
        for (const content_card of [...upload_array, ...delete_array]) {
          console.log("sync add");
          TripContentsBucketProcessor.PushToBucket(content_card, trip_id);
        }
      }
      await safeRun(() => this._downloadMedias(trip_id, download_array));
      return;
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
export default new TripContentsSync();
