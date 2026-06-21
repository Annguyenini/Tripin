// the service purpose is to handle media produce by camera or user request
import TripContentHandler from "../../app-core/flow/handlers/trip_contents/trip_contents_handler";
import CurrentTripDataService from "../storage/hot_data/current_trip";
import LocationData from "../../app-core/local_data/local_location_data";
import safeRun from "../../app-core/helpers/safe_run";
import * as Crypto from "expo-crypto";
import {
  copyAsync,
  deleteAsync,
  documentDirectory,
  downloadAsync,
  makeDirectoryAsync,
} from "expo-file-system/legacy";
import { ContentCard } from "../../types/content_card.types";
import MediaStorageService from "./media_storage_service";
const ALBUM_NAME = "Tripin_album";

class MediaService {
  GENERATE_MEDIA_ID(media_type: string, id) {
    // return `${trip_id ? `trip_${trip_id}`:''}:${media_type}:${time_stamp}`
    return `${media_type}:${id}`;
  }
  async saveNewMediaToTrip(media_uri: string, type: string) {
    const time_stamp = Date.now();
    const trip_id = CurrentTripDataService.getCurrentTripId();
    return this.saveMediaHandler(media_uri, type, time_stamp, trip_id);
  }
  async saveMediaToTrip(
    media_uri: string,
    type: string,
    trip_id: number,
    time_stamp: number,
  ) {
    return this.saveMediaHandler(media_uri, type, time_stamp, trip_id);
  }
  async saveMediaHandler(
    media_uri: string,
    type: string,
    time_stamp: number,
    trip_id: number,
  ) {
    let content_card: ContentCard;
    let media_id: string;
    let local_uri: string;
    let uuid: string;
    // let time_stamp = Date.now();

    // get coordinate for image
    const location_data = await safeRun(
      () => LocationData.getCurrentCoor(),
      "failed_at_get_location",
    );

    try {
      // save to camera roll, gallery
      local_uri = await safeRun(
        () => MediaStorageService.saveMediaToLocalAlbum(media_uri, type),
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
      content_card = {
        uuid: uuid,
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
      };
    } catch (err) {
      console.error("Failed to save media to local db", err);
      throw new Error("Failed to save image to local");
    }
    try {
      TripContentHandler.tripContentHandler(content_card, trip_id);
    } catch (err) {
      console.error(err);
    }

    return;
  }
}
export default new MediaService();
