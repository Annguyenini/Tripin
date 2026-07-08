import TripContents from "../../../../backend/services/trip_contents";
import safeRun from "../../../helpers/safe_run";
import TripContentsDatabase from "../../../../backend/storage/database/protected/trip_contents";
import CurrentDisplayContentsObserver from "../../../../frontend/trip-components/observers/current_contents/current_display_contents_observer";
import Album from "../../../../backend/storage/album/album";
import { ContentCard } from "../../../../types/content_card.types";
import { FetchFuctionRespond } from "../../../../types/fetch_fuction_respond.types";
import TripContentsBucketProcessor from "./process_bucket";
import TripContentsSync from "../../sync/trip_content_sync";
import CurrentTripDataService from "../../../../backend/storage/hot_data/current_trip";
import MediaStorageService from "../../../../backend/media/media_storage_service";
import * as Location from "expo-location";
import { version } from "react";
// in ms

class TripContentHandler {
  async tripContentHandler(content_card: ContentCard, trip_id: number) {
    try {
      const event = content_card.event;
      const fg = await Location.getForegroundPermissionsAsync();

      switch (event) {
        case "add":
          if (fg.granted) {
            console.log("add to server");
            await safeRun(
              () => TripContentsDatabase.addCardIntoDB([content_card]),
              "failed to save media to local databse ",
            );
            CurrentDisplayContentsObserver.addAssetIntoArray(
              trip_id,
              content_card,
            );
            if (trip_id) {
              TripContentsBucketProcessor.PushToBucket(content_card, trip_id);
            }
          }

          Album.addToAlbumArray(content_card);
          break;
        case "remove":
          await safeRun(
            () => TripContentsDatabase.deleteCardFromDB(content_card),
            "failed to delete media to local databse ",
          );
          await MediaStorageService.deleteMediaToLocalAlbum(
            content_card.media_path,
          );
          CurrentDisplayContentsObserver.deleteAssestFromArray(
            trip_id,
            content_card,
          );
          Album.deleteFromAlbumArray(content_card);
          if (trip_id) {
            TripContentsBucketProcessor.PushToBucket(content_card, trip_id);
          }
          break;
        default:
          throw new Error("undified event");
      }
    } catch (err) {}
  }

  async getTripContentsVersion(trip_id) {
    try {
      const respond = await TripContents.requestTripContentsVersion(trip_id);
      if (!respond.ok || respond.status !== 200) {
        return null;
      }
      return respond.data.version;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getTripContents(trip_id) {
    try {
      if (!trip_id) return [];
      const local_content =
        await TripContentsDatabase.getAssestsFromTripIdJoinTripData(trip_id);
      async function compareVersion() {
        const local_version =
          await TripContentsDatabase.getTripContentsVersion(trip_id);
        const server_version = await this.getTripContentsVersion(trip_id);
        return local_version === server_version;
      }

      async function forceMergeContent() {
        const respond = await TripContents.requestTripMedias(trip_id);
        console.log("dsdsdsdsd");
        const server_content = respond?.data?.content_cards;
        if (!server_content) return local_content;
        if (!local_content) return server_content;
        let result = [...server_content];
        local_content.forEach((local) => {
          const duplicateIdx = result.findIndex(
            (server) => local.uuid === server.uuid,
          );
          if (duplicateIdx !== -1) {
            const duplicate = result[duplicateIdx];
            if (local.modified_time > duplicate.mofified_time) {
              result[duplicateIdx] = local;
            }
          } else {
            result.push(local);
          }
        });
        return result;
      }
      if (!(await compareVersion())) {
        const sync = await TripContentsSync.syncTripContentsHandler(trip_id);
        if (!sync) {
          return await forceMergeContent();
        }
        // compare the version second time
        if (!(await compareVersion())) {
          return await forceMergeContent();
        }
        // if match
      }
      return local_content;
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

export default new TripContentHandler();
