import * as API from "../../config/config_api";
import fetchFunction from "./fetch_function";

class TripContentService {
  async requestUploadPresignUrl(content_cards, trip_id) {
    return await fetchFunction(API.REQUEST_PRESIGN_URLS, {
      method: "POST",
      body: JSON.stringify({ content_cards, trip_id }),
      headers: { "Content-Type": "application/json" },
    });
  }

  async requestSync(content_cards, trip_id) {
    return await fetchFunction(API.REQUEST_CONTENT_CARDS_SYNC, {
      method: "POST",
      body: JSON.stringify({ content_cards, trip_id }),
      headers: { "Content-Type": "application/json" },
    });
  }

  async uploadTripMediaToCloud(card_data) {
    try {
      const content_type =
        card_data.media_type === "video" ? "video/mp4" : "image/jpeg";
      const image = await fetch(card_data.media_path);
      const blob = await image.blob();
      const respond = await fetch(card_data.presign_url, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": content_type },
      });
      return respond;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async requestTripMedias(trip_id) {
    const headers = {};
    // if (trip_media_hash) headers["If-None-Match"] = trip_media_hash;
    return await fetchFunction(API.REQUEST_TRIP_CONTENTS + `/${trip_id}`, {
      method: "GET",
      headers: headers,
    });
  }
  async requestTripContentsHash(trip_id) {
    console.log("request hashs", trip_id);
    const headers = { "Content-Type": "application/json" };
    // if (trip_media_hash) headers["If-None-Match"] = trip_media_hash;
    return await fetchFunction(API.REQUEST_TRIP_CONTENTS_HASH, {
      method: "POST",
      body: JSON.stringify({
        trip_id: trip_id,
      }),
      headers: headers,
    });
  }
  async requestTripContentsMetadata(trip_id) {
    const headers = { "Content-Type": "application/json" };
    // if (trip_media_hash) headers["If-None-Match"] = trip_media_hash;
    return await fetchFunction(API.REQUEST_TRIP_CONTENTS_METADATA, {
      method: "POST",
      body: JSON.stringify({
        trip_id: trip_id,
      }),
      headers: headers,
    });
  }
}

export default new TripContentService();
