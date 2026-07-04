import MapBox from "@rnmapbox/maps";
import { useEffect, useMemo, useRef, useState } from "react";
import { computeCluster } from "../../../../../backend/addition_functions/compute_cluster";
import eventBus from "../../../../../backend/bridge/UI_event_bus";
import { EDGEPOINT_COLORS, EVENT_COLORS } from "../utils/color_cycle";
import ContentsDisplayFeatures from "../../../observers/current_contents/current_display_contents_features";
import { MOCK_CONTENT_CARDS } from "../../../../utils/mock_contents";
const CoordinateMarkers = ({ content_cards, ready }) => {
  const ContentsFeatures = new ContentsDisplayFeatures();
  const [radiusForGrouping, setRadiusForGrouping] = useState(0);
  const previousClusterKey = useRef("empty");
  const [GeoJson, setGeoJson] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const DASH_CYCLE = [
    [0, 2, 2],
    // [0.5, 2, 1.5],
    // [1, 2, 1],
    [1.5, 2, 0.5],
    [2, 2, 0],
    [1.5, 0.5, 2, 1.5],
  ];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % DASH_CYCLE.length);
    }, 100); // lower = faster crawl
    return () => clearInterval(interval);
  }, []);

  // const [coordinatesObject,setCoordinatesObject]=useState({})
  //
  // useEffect(() => {
  //   const radiusListener = (val) => {
  //     setRadiusForGrouping(val);
  //   };
  //   eventBus.on("RadiusChange", radiusListener);
  //   ready();
  //   return () => {
  //     eventBus.off("RadiusChange", radiusListener);
  //   };
  // }, [content_cards]);
  useEffect(() => {
    let GEOJSON = {
      type: "FeatureCollection",
      features: [],
    };
    let event = 0;
    let PointMarker = {
      type: "FeatureCollection",
      features: [],
    };

    for (let i = 0; i < content_cards?.events?.length; i++) {
      try {
        let current_event = content_cards.events[i];
        if (!current_event) continue;
        let color = EVENT_COLORS[event % EVENT_COLORS.length];
        let edge_color = EDGEPOINT_COLORS[i % EVENT_COLORS.length];
        // structure for line string
        let geoLine = {
          type: "Feature",
          properties: {
            //default color
            stroke: color,
          },
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        };
        let edgeLines = [];
        let edgeHeadCoords = null;
        for (let feature of current_event) {
          //point marker

          geoLine.geometry.coordinates.push([
            feature.longitude,
            feature.latitude,
          ]);
          edgeHeadCoords = [feature.longitude, feature.latitude];
        }
        //temp fix for one that have single coor on line
        if (geoLine.geometry.coordinates.length === 1) {
          geoLine.geometry.coordinates.push(edgeHeadCoords);
        }
        const next_event = content_cards?.events[i + 1];
        if (next_event) {
          console.log("next_event", next_event, content_cards);
          const edgeTail = next_event[0];
          const edgeTailCoords = [edgeTail.longitude, edgeTail.latitude];
          const edgeLine = {
            type: "Feature",
            properties: {
              //default color
              stroke: edge_color,
            },
            geometry: {
              type: "LineString",
              coordinates: [edgeHeadCoords, edgeTailCoords],
            },
          };
          // edgeLine.geometry.coordinates.push(edgeHeadCoords);

          // GEOJSON.features.push(edgeLine);
          edgeLines.push(edgeLine);
        }
        GEOJSON.features.push(geoLine);
        GEOJSON.features.push(...edgeLines);

        event++;
      } catch (err) {
        console.log(err);
      }
    }
    console.log(GEOJSON, PointMarker);
    setGeoJson(GEOJSON);
  }, [content_cards]);
  if (!GeoJson) return null;

  return (
    <MapBox.ShapeSource id="route" key={"point"} shape={GeoJson}>
      <MapBox.CircleLayer
        id="points-layer"
        // filter={["==", "$type", "Point"]}
        style={{
          circleRadius: 8,
          circleColor: ["get", "stroke"],
          circleStrokeWidth: 2,
        }}
      />
      <MapBox.LineLayer
        id="line-layer"
        style={{
          lineWidth: 2,
          lineColor: ["get", "stroke"],
          lineDasharray: DASH_CYCLE[frame],

          lineCap: "round",
        }}
      />
    </MapBox.ShapeSource>
  );
};
export default CoordinateMarkers;
