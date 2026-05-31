import TokenService from "../storage/tokens/token_service";
import AuthService from "./auth";
import * as API from "../../config/config_api";
import CurrentTripDataService from "../storage/hot_data/current_trip";
import EtagService from "../storage/etag/etag_service";
import { ETAG_KEY, GENERATE_TRIP_ETAG_KEY } from "../storage/etag/etag_keys";
// mport NetworkObserver from '../../app-core/flow/sync/network_observer';
import fetchFunction from "./fetch_function";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

class Trip {
  constructor() {}
  async requestNewTrip(trip_name: string, created_time: number) {
    /**
     * request to create new trip
     * send via FORMDATA
     * @param trip_name - tripname
     */
    // if there are no token found return false

    const respond = await fetchFunction(API.REQUEST_NEW_TRIP_API, {
      method: "POST",
      body: JSON.stringify({
        trip_name: trip_name,
        created_time: created_time,
      }),
    });
    return respond;
  }
  async uploadTripCoverImage(presign_url: string, imageUri: string) {
    try {
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1920 } }], // resize to width of 300 and preserve aspect ratio
        { compress: 0.9, format: "jpeg" },
      );
      // console.log(resizedPhoto);
      const image = await fetch(resizedPhoto.uri);

      const blob = await image.blob();

      const respond = await fetch(presign_url, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": "image/jpeg" },
      });
      return respond;
    } catch (err) {
      throw new Error("fail to upload trip cover image", err);
    }
  }
  async verifyTripCoverImageUpload(pending_token: string) {
    try {
      const respond = await fetchFunction(API.VERIFY_TRIP_COVER_IMAGE_UPLOAD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pending_token: pending_token,
        }),
      });
      return respond;
    } catch (error) {
      throw new Error("fail to verify upload image", error);
    }
  }
  async end_trip(current_time) {
    try {
      const trip_id = CurrentTripDataService.getCurrentTripId();
      if (!trip_id) throw new Error("Trip_id is null");
      const respond = await fetchFunction(API.END_TRIP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_id: trip_id,
          ended_time: current_time,
        }),
      });
      return respond;
    } catch (err) {
      throw new Error("failed at end trip", err);
    }
  }

  async requestCurrentTripId() {
    const respond = await fetchFunction(API.REQUEST_CURRENT_TRIP_ID, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return respond;
  }

  async requestTripData(trip_id) {
    const etag = await EtagService.getEtagFromLocal(
      GENERATE_TRIP_ETAG_KEY(trip_id),
    );
    const headers = {
      "Content-Type": "application/json",
    };
    if (etag) {
      headers["If-None-Match"] = etag;
    }
    const respond = await fetchFunction(API.REQUEST_TRIP_DATA, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        trip_id: trip_id,
      }),
    });
    return respond;
  }

  async requestTripsData() {
    const etag = await EtagService.getEtagFromLocal(ETAG_KEY.ALL_TRIPS_LIST);
    const headers = {
      "Content-Type": "application/json",
    };
    if (etag) {
      headers["If-None-Match"] = etag;
    }
    const respond = await fetchFunction(API.REQUEST_TRIPS_DATA, {
      method: "GET",
      headers: headers,
    });
    return respond;
  }

  async requestTripsMetadata() {
    const etag = await EtagService.getEtagFromLocal(ETAG_KEY.ALL_TRIPS_LIST);
    const headers = {
      "Content-Type": "application/json",
    };
    // if (etag) {
    //   headers["If-None-Match"] = etag;
    // }
    const respond = await fetchFunction(API.REQUEST_TRIPS_METADATA, {
      method: "GET",
      headers: headers,
    });
    return respond;
  }
  async requestTripDataChange(trip_id, trip_name, image_uri, modified_time) {
    // console.log(modified_time);
    const data = new FormData();
    if (image_uri) {
      data.append("image", {
        uri: image_uri,
        name: `cover_${trip_id}`,
        type: "image/jpeg",
      });
    }
    data.append("trip_id", trip_id ?? "");
    data.append("trip_name", trip_name ?? "");
    data.append("modified_time", modified_time ?? "");

    const respond = await fetchFunction(API.MODIFY_TRIP_DATA, {
      method: "POST",
      body: data,
    });
    return respond;
  }
  async requestRemoveTrip(trip_id, deleted_time) {
    const headers = {
      "Content-Type": "application/json",
    };
    // console.log("delete");
    const respond = await fetchFunction(API.REMOVE_TRIP_DATA, {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify({ trip_id: trip_id, deleted_time: deleted_time }),
    });
    return respond;
  }
  async requestSharedTripLink(trip_id) {
    const headers = {
      "Content-Type": "application/json",
    };
    const respond = await fetchFunction(API.REQUEST_SHARED_TRIP_LINK, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        trip_id: trip_id,
        expired_days: 30,
      }),
    });
    return respond;
  }
}

const trip = new Trip();
export default trip;
