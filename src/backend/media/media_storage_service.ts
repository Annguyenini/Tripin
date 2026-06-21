// this service purpose is to convert and save/ delete media files
import safeRun from "../../app-core/helpers/safe_run";
import * as MediaLibrary from "expo-media-library";
import * as Crypto from "expo-crypto";
import * as AlbumPermission from "../album/album_permission";
import {
  copyAsync,
  deleteAsync,
  documentDirectory,
  downloadAsync,
  makeDirectoryAsync,
} from "expo-file-system/legacy";
import { ContentCard } from "../../types/content_card.types";

class MediaStorageService {
  // async _saveMediaToCameraroll(uri) {
  //   try {
  //     const asset = await safeRun(
  //       () => MediaLibrary.createAssetAsync(uri),
  //       "failed_to_save_asset",
  //     );
  //     const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
  //     if (album) {
  //       const safeToAlbum = await safeRun(
  //         () => MediaLibrary.addAssetsToAlbumAsync([asset], album, false),
  //         "failed_at_save_to_camera_roll_album",
  //       );
  //       return asset.uri;
  //     } else {
  //       await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset);
  //       return await this.saveMediaToLocalAlbum(uri);
  //     }
  //   } catch (error) {
  //     console.error("Error at save media to album: ", error);
  //     throw new Error("failed to save image to gallery");
  //   }
  // }

  async _saveMediaToLocalStorage(uri: string, type: string, source = "local") {
    try {
      let fileName: string;
      if (type === "video") {
        const ext = uri.endsWith(".mov") ? "mov" : "mp4";
        fileName = `${Crypto.randomUUID()}.${ext}`;
      } else {
        fileName = `${Crypto.randomUUID()}.jpg`;
      }

      const localUri = `${documentDirectory}media/${fileName}`;
      await makeDirectoryAsync(`${documentDirectory}media/`, {
        intermediates: true,
      });
      if (source != "local") {
        await downloadAsync(uri, localUri);
      } else {
        await copyAsync({ from: uri, to: localUri });
      }
      return localUri;
    } catch (error) {
      console.error("Error at save media to album: ", error);
      throw new Error("failed to save image to local storage");
    }
  }
  async saveMediaToLocalAlbum(uri, type) {
    /**
     * save to local, depend on user allow app to access full album
     * generate depe
     */
    try {
      const albumPermission = await safeRun(() =>
        AlbumPermission.getAlbumPermission(),
      );
      //turn off
      // if (albumPermission.accessPrivileges === "all") {
      //   const assetUri = await this._saveMediaToCameraroll(uri);
      // }
      const localUri = await this._saveMediaToLocalStorage(uri, type);
      return localUri;
    } catch (error) {
      console.error(error);
      return null;
    }
    // console.log("save successfully")
  }

  async deleteMediaToLocalAlbum(path: string) {
    const id = path.replace(/^(photo|video):/, "").replace(/^ph:\/\//, "");
    if (id.length < 10) return;
    console.log("id", id);
    try {
      if (id.includes("file://")) {
        await safeRun(() => deleteAsync(id), "faild_to_delete_media_document");
        return;
      }
      const permission = await AlbumPermission.getAlbumPermission();
      if (permission.accessPrivileges !== "all") return;
      await MediaLibrary.deleteAssetsAsync([id]);
    } catch (error) {
      throw new Error(`Error at delete from album: ${error}`);
      console.error("Error at delete from album: ", error);
    }
    // console.log("save successfully")
  }
}
export default new MediaStorageService();
