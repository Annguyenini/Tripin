import React, {
  use,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import MapboxGL from "@rnmapbox/maps";
import Mapbox from "@rnmapbox/maps";
import { View } from "react-native";
import { HelpBarMap } from "./help_bar_map";
import mapData from "./map_data";
import { Marker } from "./components/marker/markers";
import { setCameraMapRef } from "../utils/map_ref";
import MapSharedConfig from "./main_map/map_shared_config";
import LoadingTracker from "./observers/loading_tracker";
MapboxGL.setAccessToken(process.env.EXPO_MAPBOX_PUBLIC_TOKEN);
const Markers = React.memo(({}) => {
  return <Marker></Marker>;
});
// const HelpBar = React.memo((setStyles) => {
//   return <HelpBarMap setStyles={setStyles}></HelpBarMap>;
// });
const MapStyleUrls = {
  street: "mapbox://styles/mapbox/outdoors-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  dark: "mapbox://styles/mapbox/dark-v11",
};
export const MapBoxLayout = ({}) => {
  console.log("render map");
  const [styles, setStyles] = useState("street");
  const defaultMapStyle = "mapbox://styles/mapbox/streets-v12";
  const zoomHandler = (e) => {
    const zoom = Math.floor(e?.properties?.zoom);
    MapSharedConfig.setAndNotifyZoomValue(zoom);
  };
  const setCameraRef = useCallback((ref) => {
    if (ref) {
      MapSharedConfig.setMapCameraRef(ref); // only set when ref is actually populated
    }
  }, []);

  const setMapRef = useCallback((ref) => {
    if (ref) {
      MapSharedConfig.setMapRef(ref); // only set when ref is actually populated
    }
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView
        style={{ flex: 1 }}
        ref={setMapRef}
        projection="globe"
        scrollEnabled={true}
        compassEnabled={true}
        scaleBarEnabled={true}
        onCameraChanged={(e) => {
          zoomHandler(e);
        }}
        onTouchStart={() => {
          MapSharedConfig.setAndNotifyIsFollowingUser(false);
        }}
        styleURL={MapStyleUrls[styles]}
        onDidFinishLoadingMap={() => LoadingTracker.notifyReady("map")}
      >
        <Mapbox.Camera
          ref={setCameraRef}
          // followUserLocation
          zoomLevel={0}
        />
        <Mapbox.UserLocation
          androidRenderMode={"gps"}
          showsUserHeadingIndicator={true}
        />

        {/* <Mapbox.FillExtrusionLayer
          id="building3d"
          sourceLayerID="building"
          style={layerStyles.building}
        />*/}
        {/* <MapboxGL.UserLocation minDisplacement={2} />*/}
        {/* { (isDisplay||tripSelected)&&<CoordinatesPointsLayout trip_id={currentDisplayTripId}></CoordinatesPointsLayout>}
            { (isDisplay||tripSelected)&&<ImageLabel trip_id={currentDisplayTripId} zoomLevel={zoomLevel}></ImageLabel>} */}
        <Markers></Markers>
      </Mapbox.MapView>

      {/* <MarkerManager imageMarkerDisplay={isImageMarkerDisplay} setIsImageMarkerDisplay={setIsImageMarkerDisplay} isCoordsMarkerDisplay ={isCoordsMarkerDisplay} setIsCoordsMarkerDisplay={setIsCoordsMarkerDisplay}></MarkerManager> */}
      {/* <TrackingModeManager></TrackingModeManager> */}
      <HelpBarMap setStyles={setStyles}></HelpBarMap>
    </View>
  );
};
