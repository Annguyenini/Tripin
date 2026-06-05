// the purpose of this class are:
// as a worker the process trip contents requests for handler and sync
// priotiest request
// handler upload to cloud
// handler request to server
import { FetchFuctionRespond } from "../../../../types/fetch_fuction_respond.types";
import { ContentCard } from "../../../../types/content_card.types";
import TripContents from "../../../../backend/services/trip_contents";
class TripContentsBucketProcessor {
  private _pending: ReturnType<typeof setInterval> | null = null;
  private _bucket: Array<ContentCard>;
  private BUCKET_TIME_INTERVAL: number = 5000; // ms

  constructor() {
    this._pending = null;
    this._bucket = [];
  }

  //request upload presign urls for contents, sending out request as an array
  // the presign url get inject into the object request from the backend
  //
  async _requestPresignUrl(
    content_cards: Array<ContentCard>,
    trip_id: number,
  ): Promise<Array<ContentCard>> {
    const respond: FetchFuctionRespond =
      await TripContents.requestUploadPresignUrl(content_cards, trip_id);
    if (!respond.ok || respond.status !== 200) return [];

    return respond?.data?.presign_urls;
  }

  // call request presign urls then process to upload using the presign url
  async _processUpload(content_cards: Array<ContentCard>, trip_id: number) {
    try {
      // request presign urls
      const cards = await this._requestPresignUrl(content_cards, trip_id);
      if (!cards) return [];
      // cards that successfully mapped
      let mapped_cards: Array<ContentCard> = cards.filter(
        (card: ContentCard) => card.presign_url,
      );
      // cards that unsucessfully mapped
      const unmapped_card: Array<ContentCard> = cards.filter(
        (card: ContentCard) => !card.presign_url,
      );
      // retry once, if not we can skip and it will be pick up by sync
      if (unmapped_card.length >= 1) {
        const retry_cards = await this._requestPresignUrl(
          unmapped_card,
          trip_id,
        );
        if (retry_cards && retry_cards.length >= 1) {
          const success_cards: Array<ContentCard> = retry_cards.filter(
            (card: ContentCard) => card.presign_url,
          );
          if (success_cards && success_cards.length >= 1) {
            mapped_cards = [...mapped_cards, ...success_cards];
          }
        }
      }

      let successed: Array<ContentCard> = [];
      let failed: Array<ContentCard> = [];
      const uploader = async (content_cards: Array<ContentCard>) => {
        while (content_cards.length >= 1) {
          const card = content_cards.shift();
          const respond = await TripContents.uploadTripMediaToCloud(card);
          if (respond.status === 200) {
            successed.push(card);
          } else {
            failed.push(card);
          }
        }
      };

      await Promise.all(
        Array.from({ length: 3 }, () => uploader(mapped_cards)),
      );
      // failed, retry once, it will be pickup by sync
      if (failed.length >= 1) {
        await Promise.all(Array.from({ length: 3 }, () => uploader(failed)));
      }
      // console.log(successed);
      return successed;
    } catch (err) {
      throw new Error("Failed to process upload");
    }
  }

  // last step, process sync with server
  async _processRequest(content_cards: Array<ContentCard>, trip_id: number) {
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

  // this function is to prioties request, rathering all the nessary like presign presign_urls
  // then sync it with the server
  PushToBucket(content_card: ContentCard, trip_id: number) {
    try {
      if (!this._bucket) this._bucket = [];
      this._bucket.push(content_card);

      const processRequest = async () => {
        try {
          const temp_bucket = this._bucket;
          clearTimeout(this._pending);

          this._bucket = [];
          this._pending = null;
          // filter cards that need to upload
          const request_upload = temp_bucket.filter(
            (object) => object.event === "add",
          );
          // upload
          let uploaded: Array<ContentCard> = [];
          if (request_upload.length >= 1) {
            uploaded = await this._processUpload(request_upload, trip_id);
          }
          //filter out cards need remove
          const request_delete = temp_bucket.filter(
            (object) => object.event === "remove",
          );
          //merge it upload then delete and send it to backend
          const requests = [...(uploaded ?? []), ...(request_delete ?? [])];
          await this._processRequest(requests, trip_id);
        } catch (err) {
          console.error(err);
          // this._requestTripContentSync(trip_id);

          // request sync
        } finally {
          // this._requestTripContentSync(trip_id);
        }
      };

      if (!this._pending) {
        this._pending = setTimeout(() => {
          processRequest();
        }, this.BUCKET_TIME_INTERVAL);
      }
    } catch (err) {
      console.error("failed to process request", err);
    }
  }
}

export default new TripContentsBucketProcessor();
