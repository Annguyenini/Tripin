import TripContents from "../../../../backend/services/trip_contents";
import safeRun from "../../../helpers/safe_run";
import TripContentsDatabase from "../../../../backend/storage/database/protected/trip_contents";
import CurrentDisplayContentsObserver from "../../../../frontend/trip-components/observers/current_display_contents_observer";
import Album from "../../../../backend/storage/album/album";
import { ContentCard } from "../../../../types/content_card.types";
import { FetchFuctionRespond } from "../../../../types/fetch_fuction_respond.types";
import TripContentsBucketProcessor from "./process_bucket";
import TripContentsSync from "../../sync/trip_content_sync";
import CurrentTripDataService from "../../../../backend/storage/hot_data/current_trip";
// in ms

class TripContentHandler {
  async tripContentHandler(content_card: ContentCard, trip_id: number) {
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
        TripContentsBucketProcessor.PushToBucket(content_card, trip_id);
      }
    } catch (err) {}
  }

  async getTripContents(trip_id) {
    try {
      if (!trip_id) return [];
      const local_content =
        await TripContentsDatabase.getAssestsFromTripIdJoinTripData(trip_id);
      if (CurrentTripDataService.getCurrentTripId() === trip_id) {
        TripContentsSync.syncTripContentsHandler(trip_id);
      }

      if (!local_content || local_content.length <= 0) {
        const respond = await TripContents.requestTripMedias(trip_id);
        console.log("dsdsdsdsd");
        return respond?.data?.content_cards;
      }
      return local_content;
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

export default new TripContentHandler();
