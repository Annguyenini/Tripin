import Mapbox from "@rnmapbox/maps";
//types
type MapConfigObserverEvents = "zoom" | "mapStyle" | "isFollowingUser";
type MapStyles = "street" | "satellite" | "dark";
const MapStyleUrls = {
  street: "mapbox://styles/mapbox/streets-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  dark: "mapbox://styles/mapbox/dark-v11",
};

type MapConfigObserverCallbackValues = number | string | boolean;
interface Observer {
  update(value: MapConfigObserverCallbackValues): void;
}
class MapSharedConfig {
  private _zoomValue: number | null = null;
  private _mapCameraref = null;
  private _mapRef = null;
  private _mapStyleUrl: string = null;
  private _isFollowinguser: boolean = false;
  private _observers: Map<MapConfigObserverEvents, Array<Observer>> = new Map();

  attach(observer: Observer, event: MapConfigObserverEvents) {
    let target = this._observers.get(event);
    if (!target) this._observers.set(event, []);
    this._observers.get(event).push(observer);
  }
  detach(observer: Observer, event: MapConfigObserverEvents) {
    let target = this._observers.get(event);
    if (!target) return;
    target = target.filter((obs) => obs !== observer);
    return;
  }
  notify(
    event: MapConfigObserverEvents,
    value: MapConfigObserverCallbackValues,
  ) {
    const observers = this._observers.get(event);
    observers.forEach((obs) => obs.update(value));
  }
  //zoom
  setAndNotifyZoomValue(value: number) {
    if (!value || this._zoomValue === value) return;
    this._zoomValue = value;
    this.notify("zoom", value);
  }
  getZoomValue(): number | null {
    return this._zoomValue;
  }

  //mapstyle
  setAndNotifyMapStyle(value: MapStyles) {
    if (!value || this._mapStyleUrl === MapStyleUrls[value]) return;
    this._mapStyleUrl = MapStyleUrls[value];
    this.notify("mapStyle", value);
  }
  getMapStyle(): string | null {
    return this._mapStyleUrl;
  }

  //followinguser
  setAndNotifyIsFollowingUser(value: boolean) {
    if (!value || this._isFollowinguser === value) return;
    this._isFollowinguser = value;
    this.notify("isFollowingUser", value);
  }
  getIsFollowingUser(): boolean {
    return this._isFollowinguser;
  }

  // mapcameraref
  setMapCameraRef(ref) {
    if (!ref || this._mapCameraref === ref) return;
    this._mapCameraref = ref;
    console.log(this._mapCameraref);
  }
  getMapCameraRef() {
    return this._mapCameraref;
  }

  // mapref
  setMapRef(ref) {
    if (!ref || this._mapRef === ref) return;
    this._mapRef = ref;
  }
  getMapRef() {
    return this._mapRef;
  }
}
export default new MapSharedConfig();
