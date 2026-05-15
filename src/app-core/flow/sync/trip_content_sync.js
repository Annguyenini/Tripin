import TripContents from "../../../backend/services/trip_contents";
import TripContentsDatabase from "../../../backend/storage/database/protected/trip_contents";
import safeRun from "../../helpers/safe_run";
let _onCallBack = null;

export const _registerSyncingCallback = (callback) => {
  _onCallBack = callback;
};
class TripContentsSync {
  constructor() {
    this._pending = false;
  }
  async forceSyncTripContentHander(trip_id) {
    console.log("force sync");
    if (this._pending) return;
    this._pending = true;

    try {
      if (_onCallBack) {
        _onCallBack(true);
      }
      await this._getAndProcessTripContentsMetadata(trip_id);
    } catch (err) {
      console.error(err);
    } finally {
      this._pending = false;
      if (_onCallBack) {
        _onCallBack(false);
      }
    }
  }
  async syncTripContentsHandler(trip_id) {
    if (this._pending) return;
    this._pending = true;

    console.log("sync handler", trip_id);
    try {
      if (_onCallBack) {
        _onCallBack(true);
      }
      const local_hash =
        await TripContentsDatabase.getTripContentsHash(trip_id);
      const respond = await TripContents.requestTripContentsHash(trip_id);
      const server_hash = respond?.data?.hash;
      console.log("hash", local_hash, server_hash);
      if (local_hash === server_hash && local_hash && server_hash) return;
      await this._getAndProcessTripContentsMetadata(trip_id);
    } catch (err) {
      console.error(err);
    } finally {
      this._pending = false;

      if (_onCallBack) {
        _onCallBack(false);
      }
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
  async _getAndProcessTripContentsMetadata(trip_id) {
    try {
      const response = await safeRun(
        () => TripContents.requestTripContentsMetadata(trip_id),
        "failed_at_get_trip_media_metadata_from_server",
      );
      console.log(response);
      if (!response.ok || response.status !== 200) return null;
      const server_metadata = response.data.content_cards;

      const local_trip_content_assets = await safeRun(
        () => TripContentsDatabase.getAssestsFromTripId(trip_id),
        "failed_at_get_trip_media",
      );

      const delete_array = local_trip_content_assets.filter((local) =>
        server_metadata.find(
          (server) =>
            server.uuid === local.uuid &&
            server.event == "add" &&
            local.event == "remove",
        ),
      );

      const upload_array = local_trip_content_assets.filter(
        (local) =>
          !server_metadata.find((server) => server.uuid === local.uuid),
      );

      const download_array = server_metadata.filter(
        (server) =>
          !local_trip_content_assets.find(
            (local) => local.uuid === server.uuid,
          ),
      );
      console.log("sync", upload_array, delete_array, download_array);

      if (upload_array.length >= 1 || delete_array.length >= 1) {
        await safeRun(
          () =>
            TripContents.requestSync(
              [...upload_array, ...delete_array],
              trip_id,
            ),
          "failed to request upload",
        );
      }
      await safeRun(() => this._downloadMedias(trip_id, download_array));
      return;
    } catch (error) {
      console.error(err);
      return;
    }
  }
}
export default new TripContentsSync();
