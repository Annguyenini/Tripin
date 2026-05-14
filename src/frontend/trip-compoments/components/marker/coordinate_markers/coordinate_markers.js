import MapboxGL from "@rnmapbox/maps";
import { useEffect, useMemo, useRef, useState } from "react";
import { computeCluster } from "../../../../../backend/addition_functions/compute_cluster";
import eventBus from "../../../../../backend/bridge/UI_event_bus";
const CoordinateMarkers = ({ content_cards, ready }) => {
  const [radiusForGrouping, setRadiusForGrouping] = useState(0);
  const previousClusterKey = useRef("empty");
  // const [coordinatesObject,setCoordinatesObject]=useState({})
  //
  useEffect(() => {
    const radiusListener = (val) => {
      setRadiusForGrouping(val);
    };
    eventBus.on("RadiusChange", radiusListener);
    ready();
    return () => {
      eventBus.off("RadiusChange", radiusListener);
    };
  }, [content_cards]);

  const coordinatesMap = useMemo(() => {
    return new Map([
      [
        0,
        [
          ...content_cards.map((obj) => {
            return [obj.longitude, obj.latitude];
          }),
        ],
      ],
      [
        20,
        [
          ...computeCluster(content_cards, 20, true).map((obj) => {
            return [obj.center.lng, obj.center.lat];
          }),
        ],
      ],
      [
        40,
        [
          ...computeCluster(content_cards, 40, true).map((obj) => {
            return [obj.center.lng, obj.center.lat];
          }),
        ],
      ],
      [
        60,
        [
          ...computeCluster(content_cards, 60, true).map((obj) => {
            return [obj.center.lng, obj.center.lat];
          }),
        ],
      ],
      [
        80,
        [
          ...computeCluster(content_cards, 80, true).map((obj) => {
            return [obj.center.lng, obj.center.lat];
          }),
        ],
      ],
      [
        100,
        [
          ...computeCluster(content_cards, 100, true).map((obj) => {
            return [obj.center.lng, obj.center.lat];
          }),
        ],
      ],
    ]);
  }, [content_cards]);

  const currentCluster = useMemo(() => {
    return coordinatesMap.get(radiusForGrouping);
  }, [coordinatesMap, radiusForGrouping]);

  const clusterKey = useMemo(() => {
    if (!currentCluster || currentCluster.length === 0) {
      return previousClusterKey.current;
    }
    const key = `${currentCluster.length}-${currentCluster[0]}-${currentCluster[currentCluster.length - 1]}`;
    previousClusterKey.current = key;
    return key;
  }, [currentCluster]);
  console.log(currentCluster);
  if (!currentCluster || currentCluster.length === 0) {
    return null;
  }
  const geoJson = {
    type: "FeatureCollection",
    features: [
      // POINTS
      ...currentCluster.map((coors) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coors,
        },
      })),

      // LINE
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: currentCluster,
        },
      },
    ],
  };
  return (
    <MapboxGL.ShapeSource id="route" key={clusterKey} shape={geoJson}>
      <MapboxGL.LineLayer
        id="line-layer"
        style={{
          lineWidth: 2,
          lineColor: "#1a1a1a",
          lineDasharray: [2, 2],
        }}
      />

      <MapboxGL.CircleLayer
        id="points-layer"
        style={{
          circleRadius: 8,
          circleColor: "#1a1a1a",
          circleStrokeWidth: 2,
          circleStrokeColor: "#f0f0ec",
        }}
      />
    </MapboxGL.ShapeSource>
  );
};
export default CoordinateMarkers;
