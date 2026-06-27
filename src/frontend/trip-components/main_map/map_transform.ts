import MapSharedConfig from "./map_shared_config";
import Mapbox from "@rnmapbox/maps";
type MapStyleTypes = "street" | "satellite" | "dark";
type coords = [number, number];
const MapStyleUrls = {
  street: "mapbox://styles/mapbox/streets-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  dark: "mapbox://styles/mapbox/dark-v11",
};
class MapTransform {
  async followingUser() {
    const map_camera_ref = MapSharedConfig.getMapCameraRef();
    try {
      const lastlocation = await Mapbox.locationManager.getLastKnownLocation();
      if (lastlocation && map_camera_ref) {
        map_camera_ref.setCamera({
          centerCoordinate: [
            lastlocation.coords.longitude,
            lastlocation.coords.latitude,
          ],
          zoomLevel: 15,
          animationDuration: 1000,
        });
      }
    } catch (err) {
      console.log(`fail to following user: ${err}`);
    }
  }
  flyTo(coords: coords, zoom: number) {
    const map_camera_ref = MapSharedConfig.getMapCameraRef();
    try {
      if (map_camera_ref) {
        map_camera_ref.setCamera({
          centerCoordinate: coords,
          zoomLevel: zoom,
          animationDuration: 1000,
        });
      }
    } catch (err) {
      console.log(`fail to following user: ${err}`);
    }
  }
}
export default new MapTransform();
