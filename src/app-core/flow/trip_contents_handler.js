import TripContents from "../../backend/services/trip_contents";
import safeRun from "../helpers/safe_run";
import TripContentsDatabase from "../../backend/storage/database/protected/trip_contents";
import TripContentsSync from "./sync/trip_content_sync";
import CurrentDisplayContentsObserver from "../../frontend/trip-components/observers/current_display_contents_observer";
import Album from "../../backend/storage/album/album";
import TripLocalDataStorage from "../../backend/storage/base/trip_base";
import CurrentTripDataService from "../../backend/storage/hot_data/current_trip";
// in ms
const BUCKET_TIME_INTERVAL = 5000;

class TripContentHandler {
  constructor() {
    this._pending = null;
    this._bucket = [];
  }

  async _requestPresignUrl(content_cards, trip_id) {
    const respond = await TripContents.requestUploadPresignUrl(
      content_cards,
      trip_id,
    );
    if (!respond.ok || respond.status !== 200) return null;

    return respond?.data?.presign_urls;
  }

  async _processUpload(content_cards, trip_id) {
    try {
      const cards = await this._requestPresignUrl(content_cards, trip_id);
      if (!cards) return false;

      const mapped_cards = cards.filter((card) => card.presign_url);
      const unmapped_card = cards.filter((card) => !card.presign_url);

      let successed = [];

      const uploader = async () => {
        while (mapped_cards.length >= 1) {
          const card = mapped_cards.shift();
          const respond = await TripContents.uploadTripMediaToCloud(card);
          if (respond.status === 200) successed.push(card);
        }
      };

      await Promise.all(Array.from({ length: 3 }, uploader));
      // console.log(successed);
      return successed;
    } catch (err) {
      throw new Error("Failed to process upload");
    }
  }

  async _processRequest(content_cards, trip_id) {
    try {
      const respond = await TripContents.requestSync(content_cards, trip_id);
      if (!respond.ok || respond.status !== 200) {
        // request sync
      }
      return true;
    } catch (err) {
      throw new Error("Failed at process requests");
    }
  }

  _processByTimeInterval(content_card, trip_id) {
    try {
      if (!this._bucket) this._bucket = [];
      this._bucket.push(content_card);

      const processRequest = async () => {
        try {
          const temp_bucket = this._bucket;

          this._bucket = [];
          clearInterval(this._pending);
          this._pending = null;

          const request_presign = temp_bucket.filter(
            (object) => object.event === "add",
          );

          let uploaded = null;
          if (request_presign.length >= 1) {
            uploaded = await this._processUpload(request_presign, trip_id);
          }

          const request_delete = temp_bucket.filter(
            (object) => object.event === "remove",
          );
          const requests = [...(uploaded ?? []), ...(request_delete ?? [])];
          await this._processRequest(requests, trip_id);
        } catch (err) {
          console.error(err);
          // this._requestTripContentSync(trip_id);

          // request sync
        } finally {
          this._requestTripContentSync(trip_id);
        }
      };

      if (!this._pending) {
        this._pending = setInterval(() => {
          processRequest();
        }, BUCKET_TIME_INTERVAL);
      }
    } catch (err) {
      console.error("failed to process request", err);
    }
  }
  async _requestTripContentSync(trip_id) {
    // console.log("requestsync ", trip_id);
    if (this._pending) return;
    await TripContentsSync.syncTripContentsHandler(trip_id);
  }
  async _forceRequestTripContentSync(trip_id) {
    // console.log("requestsync ", trip_id);
    if (this._pending) return false;
    await TripContentsSync.forceSyncTripContentHander(trip_id);
    return true;
  }
  async tripContentHandler(content_card, trip_id) {
    try {
      const event = content_card.event;

      switch (event) {
        case "add":
          await safeRun(
            () => TripContentsDatabase.addCardIntoDB([content_card]),
            "failed to save media to local databse ",
          );
          CurrentDisplayContentsObserver.addAssetIntoArray(
            trip_id,
            content_card,
          );
          Album.addToAlbumArray(content_card);
          break;
        case "remove":
          await safeRun(
            () => TripContentsDatabase.deleteCardFromDB(content_card),
            "failed to delete media to local databse ",
          );
          CurrentDisplayContentsObserver.deleteAssestFromArray(
            trip_id,
            content_card,
          );
          Album.deleteFromAlbumArray(content_card);
          break;
        default:
          throw new Error("undified event");
      }

      if (trip_id) {
        this._processByTimeInterval(content_card, trip_id);
      }
    } catch (err) {}
  }

  async getTripContents(trip_id) {
    try {
      if (!trip_id) return [];
      if (trip_id === CurrentTripDataService.getCurrentTripId()) {
        const local_content =
          await TripContentsDatabase.getAssestsFromTripIdJoinTripData(trip_id);
        this._requestTripContentSync(trip_id);
        if (local_content) {
          return local_content;
        }
      }

      const respond = await TripContents.requestTripMedias(trip_id);
      if (!respond.ok || respond.status !== 200) return [];

      return respond?.data?.content_cards;
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

export default new TripContentHandler();
