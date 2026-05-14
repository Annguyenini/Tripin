import TripContents from "../../backend/services/trip_contents";
import TripCoordinateDatabase from "../../backend/storage/database/protected/legacy/trip_coordinate_database";
import safeRun from "../helpers/safe_run";
import TripContentsDatabase from "../../backend/storage/database/protected/trip_contents";

class TripContentHandler {
  constructor() {
    this.TripCoordinateDatabaseService = new TripCoordinateDatabase();
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
          console.log(respond);
          if (respond.status === 200) successed.push(card);
        }
      };

      await Promise.all(Array.from({ length: 3 }, uploader));
      console.log(successed);
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
          if (request_presign) {
            uploaded = await this._processUpload(request_presign, trip_id);
          }

          const request_delete = temp_bucket.filter(
            (object) => object.event === "remove",
          );
          const requests = [...uploaded, ...request_delete];
          await this._processRequest(requests, trip_id);
        } catch (err) {
          // request sync
        }
      };

      if (!this._pending) {
        this._pending = setInterval(() => {
          processRequest();
        }, 5000);
      }
    } catch (err) {
      console.error("failed to process request", err);
    }
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
          break;
        case "remove":
          await safeRun(
            () => TripContentsDatabase.deleteCardFromDB(content_card),
            "failed to delete media to local databse ",
          );
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
      const local_content =
        await TripContentsDatabase.getAssestsFromTripId(trip_id);
      if (local_content) {
        return local_content;
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
