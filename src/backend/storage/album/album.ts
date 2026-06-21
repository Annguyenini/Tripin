import SqliteService from "../database/sqlite/sqlite";
import UserDataService from "../async_storage/user";

import * as MediaLibrary from "expo-media-library";
import * as MediaPermission from "../../album/album_permission";
import { ContentCard } from "../../../types/content_card.types";
const GENERATE_MEDIA_ID = (media_type: string, id: string) => {
  // return `${trip_id ? `trip_${trip_id}`:''}:${media_type}:${time_stamp}`
  return `${media_type}:${id}`;
};
type Observer = { update: (value: Array<ContentCard>) => void };
class Album {
  private AlbumsArray: Array<ContentCard> = [];
  private observers: Array<Observer> = [];
  constructor() {}
  attach(observer: Observer) {
    if (this.observers.find((obs) => obs === observer)) return;
    this.observers.push(observer);
  }
  detach(observer: Observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }
  notify() {
    for (const obs of this.observers) {
      obs.update(this.AlbumsArray);
    }
  }

  addToAlbumArray(object: ContentCard) {
    // if(typeof(object)!=='object'){
    //     console.error('Failed to add into Album array ')
    //     return
    // }
    try {
      this.AlbumsArray.unshift(object);
    } catch (err) {
      console.error("Failed to add into Album array ", err);
      throw new Error("Error at add to watch");
    }
    this.notify();
  }
  deleteFromAlbumArray(object: ContentCard) {
    try {
      this.AlbumsArray = this.AlbumsArray.filter((item) => {
        return item.uuid !== object.uuid;
      });
    } catch (err) {
      console.error("Failed to delete from Album array ", err);
      throw new Error("Error at delete from Album");
    }
    this.notify();
  }

  async getAllMediasFromDb() {
    const DB = await SqliteService.connectDB();
    const user_id = UserDataService.getUserId();
    let result: Array<ContentCard>;
    try {
      result = await DB.getAllAsync(
        `SELECT * FROM content_cards WHERE event = ? ORDER BY time_stamp DESC`,
        "add",
        user_id,
      );
      return result;
    } catch (err) {
      throw new Error(`Failed to get all medias from database:${err}`);
    }
  }
  async getAllMediasFromAlbum(media_type = null) {
    // return an array of assets
    try {
      const permission = await MediaPermission.getAlbumPermission();
      if (permission.accessPrivileges !== "all") return null;
      const album = await MediaLibrary.getAlbumAsync("Tripin_album");
      const options = {
        album: album,
        sortBy: [MediaLibrary.SortBy.creationTime],
        first: 100,
        mediaType: ["video", "photo"],
      };
      if (media_type) {
        options["mediaType"] = media_type;
      }
      const assets = await MediaLibrary.getAssetsAsync(options);
      return assets.assets;
    } catch (err) {
      throw new Error("Failed to get all medias from local album", err);
    }
  }
  async mergeMediasFromAlbumAndDB(db_array: Array<ContentCard>, album_array) {
    // console.log("merge1 ", db_array);
    // console.log("merge2 ", album_array);
    try {
      let hash_map = {};
      for (const object of album_array) {
        // create media_id,
        object.media_id = GENERATE_MEDIA_ID(object.mediaType, object.uri);

        hash_map[object.media_id] = object;
      }
      const merge = album_array.filter((album) => {
        !db_array.find((db) => db.media_id == album.id);
      });
      const result = [...db_array, ...merge];

      return result;
    } catch (err) {
      throw new Error("failed merge data from database and album", err);
    }
  }
  async mergeAlbum() {
    try {
      const assets = await this.getMergedMediasArray();
      this.AlbumsArray = [...assets];
    } catch (err) {
      throw new Error(err);
    }
  }
  async getMergedMediasArray() {
    console.log("init album");
    try {
      const db_medias = await this.getAllMediasFromDb();
      console.log("merge", db_medias);

      const album_medias = await this.getAllMediasFromAlbum();
      console.log("merge", db_medias, album_medias);
      if (!album_medias || album_medias.length === 0) {
        return db_medias;
      }
      const result = await this.mergeMediasFromAlbumAndDB(
        db_medias,
        album_medias,
      );
      // console.log("init album", result);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }
}

export default new Album();
