import SqliteService from "../database/sqlite/sqlite";
import UserDataService from "../database/user";

import * as MediaLibrary from "expo-media-library";
import * as MediaPermission from "../../album/album_permission";
const GENERATE_MEDIA_ID = (media_type, id) => {
  // return `${trip_id ? `trip_${trip_id}`:''}:${media_type}:${time_stamp}`
  return `${media_type}:${id}`;
};
class Album {
  constructor() {
    this.AlbumsArray = [];
    this.observers = [];
  }
  attach(observer) {
    if (this.observers.find((obs) => obs === observer)) return;
    this.observers.push(observer);
  }
  detach(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }
  notify() {
    for (const obs of this.observers) {
      obs.update(this.AlbumsArray);
    }
  }

  addToAlbumArray(object) {
    // if(typeof(object)!=='object'){
    //     console.error('Failed to add into Album array ')
    //     return
    // }
    try {
      this.AlbumsArray = [object, ...this.AlbumsArray];
    } catch (err) {
      console.error("Failed to add into Album array ", err);
      throw new Error("Error at add to watch");
    }
    this.notify();
  }
  deleteFromAlbumArray(object) {
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
    let result;
    try {
      result = await DB.getAllAsync(
        `SELECT * FROM content_cards WHERE event = ?  ORDER BY time_stamp DESC`,
        "add",
      );
      return result;
    } catch (err) {
      console.error(err);
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
    } catch (err) {}
  }
  async mergeMediasFromAlbumAndDB(db_array, album_array) {
    console.log("merge1 ", db_array);
    console.log("merge2 ", album_array);

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
  }
  async mergeAlbum() {
    const assets = await this.getMergedMediasArray();
    this.AlbumsArray = [...assets];
  }
  async getMergedMediasArray() {
    console.log("init album");
    try {
      const db_medias = await this.getAllMediasFromDb();
      const album_medias = await this.getAllMediasFromAlbum();

      if (!album_medias || album_medias.length === 0) {
        return db_medias;
      }
      const result = await this.mergeMediasFromAlbumAndDB(
        db_medias,
        album_medias,
      );
      console.log("init album", result);
      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

export default new Album();
