import CurrentTripDataService from "../storage/hot_data/current_trip";
import * as API from "../../config/config_api";
import TokenService from "../storage/tokens/token_service";
import AuthService from "./auth";
import getTimestamp from "../addition_functions/get_current_time";
import * as FileSystem from "expo-file-system/legacy";
import fetchFunction from "./fetch_function";
class TripContentService {
  async requestUploadPresignUrl(content_cards, trip_id) {
    const headers = { "Content-Type": "application/json" };
    const respond = await fetchFunction(API.REQUEST_PRESIGN_URLS, {
      method: "POST",
      body: JSON.stringify({ content_cards: content_cards, trip_id: trip_id }),
      headers: headers,
    });
    return respond;
  }

  async putMediaObjectWithPresignUrl(url, media_object) {
    const fileRes = await fetch(media_object.media_path);
    const blob = await fileRes.blob();
    headers = {
      "Content-Type": `${media_object.media_type === "video" ? "video/mp4" : "image/jpeg"}`,
    };
    const respond = await fetchFunction(url, {
      method: "PUT",
      headers: headers,
      body: blob,
    });
    return respond;
  }

  async requestSync(content_cards, trip_id) {
    const headers = {};
    const respond = await fetchFunction(API.REQUEST_CONTENT_CARDS_SYNC, {
      method: "POST",
      body: JSON.stringify({ content_cards: content_cards, trip_id: trip_id }),
      headers: headers,
    });
    return respond;
  }

  async uploadTripMediaToCloud(card_data) {
    const form = new FormData();
    const path = `trip${trip_id}_${time_stamp}`;
    const isVideo = mediaType === "video";
    console.log(mediaUri);
    form.append(isVideo ? "video" : "image", {
      uri: mediaUri,
      name: `${path}.${isVideo ? "mp4" : "jpg"}`,
      type: isVideo ? "video/mp4" : "image/jpeg",
    });

    form.append(
      "data",
      JSON.stringify({
        trip_id: String(trip_id),
        longitude: String(longitude),
        latitude: String(latitude),
        time_stamp: time_stamp,
        media_id: media_id,
        coordinate_id: coordinate_id,
        city: city,
        region: region,
        country: country,
        iso_country_code: iso_country_code,
      }),
    );
    // const headers = {
    //     'id': media_id
    // }
    const respond = await fetchFunction(
      API.SEND_MEDIAS_BASE + `/${trip_id}/upload`,
      {
        // headers: headers,
        method: "POST",
        body: form,
      },
    );
    return respond;
  }
  async requestTripMedias(trip_id, trip_media_hash) {
    const headers = {};
    if (trip_media_hash) {
      headers["If-None-Match"] = trip_media_hash;
    }
    const respond = await fetchFunction(
      API.REQUEST_TRIP_MEDIAS + `/${trip_id}/medias`,
      {
        method: "GET",
        headers: headers,
      },
    );
    return respond;
  }
}
export default new TripContentService();
