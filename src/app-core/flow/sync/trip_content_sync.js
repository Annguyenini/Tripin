import TripContents from "../../../backend/services/trip_contents";
import TripContentsDatabase from "../../../backend/storage/database/protected/trip_contents";
class TripContentSync {
  async syncTripContentsHandler(trip_id) {
    const local_hash = await TripContentsDatabase.getTripContentsHash(trip_id);
    const server_hash = await TripContents.requestTripContentsHash(trip_id);
    if (local_hash === server_hash && local_hash && server_hash) return;

    // request content hash
    // check contents hash
    // separate into each buckets
    // process to sync
  }
  async _downloadMedias(trip_id, localArray) {
    const response = await TripContents.requestTripMedias(trip_id);
    if (!response.ok || response.status !== 200) return false;

    const serverMedias = response.data.medias;
    const download_array = serverMedias.filter((server) => {
      return !localArray.find((local) => local.media_id === server.media_id);
    });
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
            "faiel",
          );
          asset.media_path = localPath;
          return asset;
        }),
      );

      await Promise.all(
        savedArray.map(async (asset) => {
          try {
            await Albumdb.addMediaIntoDB(
              asset.media_type,
              asset.media_path,
              asset.time_stamp,
              asset.media_id,
              asset.longitude,
              asset.latitude,
              asset.coordinate_id,
              asset.city,
              asset.region,
              asset.country,
              asset.iso_country_code,
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
    const response = await safeRun(
      () => TripContents.requestTripContentsMetadata(trip_id),
      "failed_at_get_trip_media_metadata_from_server",
    );
    const server_metadata = response.data.metadata;
    if (!response.ok || response.status !== 200) return null;
    const local_trip_media_assets = await safeRun(
      () => TripContentsDatabase.getAssestsFromTripId(trip_id),
      "failed_at_get_trip_media",
    );
    const delete_array = server_metadata.filter((server_media) =>
      local_trip_media_assets.find(
        (local) =>
          local.media_id === server_media.media_id &&
          local.event == "remove" &&
          server_media.event == "add",
      ),
    );

    const upload_array = local_trip_media_assets.filter(
      (local) =>
        !server_metadata.find((server) => server.media_id === local.media_id),
    );
    if (delete_array)
      await safeRun(
        () => this._processRequestDeleteTripMedias(trip_id, delete_array),
        "failed_to_process_trip_media_delete_sync",
      );
    if (upload_array)
      await safeRun(
        () => this._processRequestUploadTripMedias(trip_id, upload_array),
        "failed_to_process_trip_upload_delete_sync",
      );
    await safeRun(() => this._downloadMedias(trip_id, local_trip_media_assets));
    return;
  }
}
