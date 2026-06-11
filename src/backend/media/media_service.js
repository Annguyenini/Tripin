import TripContentsDatabase from "../storage/database/protected/trip_contents";
import TripContentHandler from "../../app-core/flow/handlers/trip_contents/trip_contents_handler";
import CurrentTripDataService from "../storage/hot_data/current_trip";
import LocationData from "../../app-core/local_data/local_location_data";
import safeRun from "../../app-core/helpers/safe_run";
import * as MediaLibrary from "expo-media-library";
import * as Crypto from "expo-crypto";
import * as AlbumPermission from "../album/album_permission";
import {
  copyAsync,
  deleteAsync,
  documentDirectory,
  downloadAsync,
  makeDirectoryAsync,
} from "expo-file-system/legacy";

const ALBUM_NAME = "Tripin_album";

class MediaService {
  GENERATE_MEDIA_ID(media_type, id) {
    // return `${trip_id ? `trip_${trip_id}`:''}:${media_type}:${time_stamp}`
    return `${media_type}:${id}`;
  }
  async saveMediaHandler(media_uri, type) {
    let content_cards;
    let media_id;
    let local_uri;
    let uuid;
    let time_stamp = Date.now();
    const trip_id = CurrentTripDataService.getCurrentTripId();
    const trip_name = CurrentTripDataService.getCurrentTripName();

    // get coordinate for image
    const location_data = await safeRun(
      () => LocationData.getCurrentCoor(),
      "failed_at_get_location",
    );

    try {
      // save to camera roll, gallery
      local_uri = await safeRun(
        () => this.saveMediaToLocalAlbum(media_uri, type),
        "failed_at_save_media_to_gallery",
      );
      // console.log("uri", local_uri);
      if (!local_uri) {
        throw new Error("Failed to generate asset!");
      }
      // generate media an unique media id
      media_id = this.GENERATE_MEDIA_ID(type, local_uri);
      uuid = Crypto.randomUUID();
      // get object ready to insert into album
      content_cards = TripContentsDatabase.createContentCard({
        uuid,
        trip_id: trip_id ?? null,
        media_type: type,
        media_path: local_uri,
        time_stamp: time_stamp,
        media_id: media_id,
        event: "add",
        altitude: location_data.altitude,
        latitude: location_data.latitude,
        longitude: location_data.longitude,
        speed: location_data.speed,
        heading: location_data.heading,
        city: location_data.city,
        region: location_data.region,
        country: location_data.country,
        iso_country_code: location_data.isoCountryCode,
        // filename: `trip${trip_id}_${time_stamp}.${type === "video" ? "mp4" : "jpeg"}`,
        // minetype: `${type === "video" ? "video/mp4" : "image/jpeg"}`,
        trip_name: trip_name ?? "unkown",
      });
    } catch (err) {
      console.error("Failed to save media to local db", err);
      throw new "Failed to save image to local"();
    }
    try {
      TripContentHandler.tripContentHandler(content_cards, trip_id);
    } catch (err) {
      console.error(err);
    }

    return;
  }

  async _saveMediaToCameraroll(uri) {
    try {
      const asset = await safeRun(
        () => MediaLibrary.createAssetAsync(uri),
        "failed_to_save_asset",
      );
      const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
      if (album) {
        const safeToAlbum = await safeRun(
          () => MediaLibrary.addAssetsToAlbumAsync([asset], album, false),
          "failed_at_save_to_camera_roll_album",
        );
        return asset.uri;
      } else {
        await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset);
        return await this.saveMediaToLocalAlbum(uri);
      }
    } catch (error) {
      console.error("Error at save media to album: ", error);
      throw new Error("failed to save image to gallery");
    }
  }

  async _saveMediaToLocalStorage(uri, type, source = "local") {
    try {
      let fileName;
      if (type === "video") {
        const ext = uri.endsWith(".mov") ? "mov" : "mp4";
        fileName = `${Crypto.randomUUID()}.${ext}`;
      } else {
        fileName = `${Crypto.randomUUID()}.jpg`;
      }

      const localUri = `${documentDirectory}media/${fileName}`;
      await makeDirectoryAsync(`${documentDirectory}media/`, {
        intermediates: true,
      });
      if (source != "local") {
        await downloadAsync(uri, localUri);
      } else {
        await copyAsync({ from: uri, to: localUri });
      }
      return localUri;
    } catch (error) {
      console.error("Error at save media to album: ", error);
      throw new Error("failed to save image to local storage");
    }
  }
  async saveMediaToLocalAlbum(uri, type) {
    /**
     * save to local, depend on user allow app to access full album
     * generate depe
     */
    try {
      const albumPermission = await safeRun(() =>
        AlbumPermission.getAlbumPermission(),
      );
      if (albumPermission.accessPrivileges === "all") {
        const assetUri = await this._saveMediaToCameraroll(uri);
      }
      const localUri = await this._saveMediaToLocalStorage(uri, type);
      return localUri;
    } catch (error) {
      console.error(error);
      return null;
    }
    // console.log("save successfully")
  }

  async deleteMediaToLocalAlbum(path) {
    const id = path.replace(/^(photo|video):/, "").replace(/^ph:\/\//, "");
    if (id.length < 10) return;
    console.log("id", id);
    try {
      if (id.includes("file://")) {
        await safeRun(() => deleteAsync(id), "faild_to_delete_media_document");
        return;
      }
      const permission = await AlbumPermission.getAlbumPermission();
      if (permission.accessPrivileges !== "all") return;
      await MediaLibrary.deleteAssetsAsync([id]);
    } catch (error) {
      console.error("Error at delete from album: ", error);
      // throw new Error('Failed to delete from gallery')
    }
    // console.log("save successfully")
  }
}
export default new MediaService();
