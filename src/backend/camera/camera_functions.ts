import MediaService from "../media/media_service";
import safeRun from "../../app-core/helpers/safe_run";
class CameraService {
  private album_name: string = "Tripin_album";
  private video = null;
  // constructor() {
  //   this.album_name = "Tripin_album";
  //   this.video = null;
  // }

  async takePicture(cameraRef, options) {
    if (cameraRef.current) {
      try {
        // const options = {quality: 1, base64 :true}; // control option for picture
        const photo = await cameraRef.current.takePhoto(options); // return a photo
        console.log(photo);
        await safeRun(
          () => MediaService.saveNewMediaToTrip(photo.path, "photo"),
          "faile_at_save_imgae",
        );
        return photo;
      } catch (err) {
        console.error("Failed to take picture", err);
        return null;
      }
    }
  }

  async recordVideo(cameraRef) {
    if (cameraRef.current) {
      try {
        await cameraRef.current.startRecording({
          onRecordingFinished: (video) => (this.video = video),
          onRecordingError: (error) => console.error(error),
        });
      } catch (err) {
        console.error("Failed to record Video", err);
        return null;
      }
    }
  }
  async stopRecording(cameraRef) {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // console.log(this.video);
    if (this.video?.path) {
      try {
        await MediaService.saveNewMediaToTrip(this.video.path, "video");
      } catch (err) {
        console.error("failed to save video!", err);
      }
      console.log(this.video);
      return this.video;
    } else {
      console.warn("No video URI found yet!");
    }
  }
}

const camera = new CameraService();
export default camera;
