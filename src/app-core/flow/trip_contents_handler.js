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
    /*
    return a list of object that mapped with the url
    */
    const respond = await TripContents.requestUploadPresignUrl(
      content_cards,
      trip_id,
    );
    if (!respond.ok || respond.status !== 200) {
      return null;
    }
    console.log("add", respond);
    return respond?.data?.presign_urls;
    // handler
  }
  async _processUpload(content_cards, trip_id) {
    try {
      const cards = await this._requestPresignUrl(content_cards, trip_id);
      const mapped_cards = cards.filter((card) => card.presign_url);
      const unmapped_card = cards.filter((card) => !card.presign_url);
      if (!cards) return false;
      let failed_cards = [];
      let MAX_RETRY = 2;
      const uploader = async () => {
        while (mapped_cards.length >= 1) {
          const card = mapped_cards.shift();
          const respond = await TripContents.uploadTripMediaToCloud(card);
          if (!respond.ok || respond.status !== 200) {
            failed_cards.append(card);
          }
        }
      };
      await Promise.all(Array.from({ length: 3 }, uploader));
      // for now let the failed,unmapped beside, that can be resolve in sync
      return mapped_cards.filter(
        (mapped_card) =>
          !failed_cards.find(
            (failed_card) => failed_card.uuid === mapped_card.uuid,
          ),
      );
    } catch (err) {
      throw new Error("Failed to process upload");
    }
  }
  async _processRequest(content_cards, trip_id) {
    try {
      const respond = await TripContents.requestSync(content_cards, trip_id);
      if (!respond.ok || respond.status !== 200) {
        //request sync
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
      console.log("add", this._bucket);

      if (!this._pending) {
        this._pending = setInterval(() => {
          processRequest();
        }, 5000);
      }
      const processRequest = async () => {
        try {
          const temp_bucket = this._bucket;
          console.log("add", temp_bucket);

          this._bucket = [];

          clearInterval(this._pending);
          this._pending = null;

          const request_presign = temp_bucket.filter((object) => {
            return object.event === "add";
          });
          let uploaded = null;
          console.log("adddd", request_presign);

          if (request_presign) {
            uploaded = await this._processUpload(request_presign, trip_id);
          }
          // handle request_presign
          const request_delete = temp_bucket.filter((object) => {
            return object.event === "remove";
          });
          const requests = [...uploaded, ...request_delete];
          await this._processRequest(requests, trip_id);
        } catch (err) {
          //request sync
        }
      };
    } catch (err) {
      console.error("failed to process request", err);
    }
  }
  async tripContentHandler(content_card, trip_id) {
    try {
      console.log("add", content_card, trip_id);
      const event = content_card.event;
      console.log("add", event);

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
        console.log("add", trip_id);

        this._processByTimeInterval(content_card, trip_id);
      }
    } catch (err) {}
  }
}

export default new TripContentHandler();
