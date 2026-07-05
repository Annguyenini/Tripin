import MapBox from "@rnmapbox/maps";
// import type { FeatureCollection, LineString, Point } from "geojson";

import { useEffect, useMemo, useRef, useState } from "react";
import { computeCluster } from "../../../../../backend/addition_functions/compute_cluster";
import eventBus from "../../../../../backend/bridge/UI_event_bus";
import { EDGEPOINT_COLORS, EVENT_COLORS } from "../utils/color_cycle";
import ContentsDisplayFeatures from "../../../observers/current_contents/current_display_contents_features";
import { MOCK_CONTENT_CARDS } from "../../../../utils/mock_contents";
import { ContentCard } from "../../../../../types/content_card.types";
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

  useEffect(() => {
    let GEOJSON = {
      type: "FeatureCollection",
      features: [],
    };
    let previousCard = null;
    let eventLines = [];
    let edgeLines = [];

    // loop
    for (let i = 0; i < content_cards?.length; i++) {
      const currentCard = content_cards[i];
      // define color of the event
      let color =
        EVENT_COLORS[currentCard?.render_event_id % EVENT_COLORS.length];

      try {
        // different event case
        if (currentCard?.city !== previousCard?.city) {
          // define the color of the edge
          let edgecolor =
            EDGEPOINT_COLORS[
              (currentCard?.render_event_id + previousCard?.render_event_id) %
                EDGEPOINT_COLORS.length
            ];
          // get the last event
          let temp = eventLines[eventLines.length - 1];
          console.log("temp", temp);
          ``;
          // if there are last event, get the last point of the last event and a first point of the next event to make an edge line
          if (temp) {
            edgeLines.push({
              type: "Feature",
              properties: {
                //default color
                stroke: edgecolor,
              },
              geometry: {
                type: "LineString",
                coordinates: [
                  [previousCard.longitude, previousCard.latitude],
                  [currentCard.longitude, currentCard.latitude],
                ],
              },
            });
          }
          // create new event line
          eventLines.push({
            type: "Feature",
            properties: {
              //default color
              stroke: color,
            },
            geometry: {
              type: "LineString",
              coordinates: [],
            },
          });
        }
        // put point into event line
        let currentStringLine = eventLines[eventLines.length - 1];
        currentStringLine.geometry.coordinates.push([
          currentCard.longitude,
          currentCard.latitude,
        ]);
        previousCard = currentCard;
      } catch (err) {
        console.error(err);
      }
    }
    const finalFeatures = [];
    // loop through and check for single point in event and duplicate it
    for (const line of eventLines) {
      if (line.geometry.coordinates.length === 1) {
        finalFeatures.push({
          type: "Feature",
          properties: line.properties,
          geometry: {
            type: "Point",
            coordinates: line.geometry.coordinates[0],
          },
        });
      } else if (line.geometry.coordinates.length > 1) {
        finalFeatures.push(line);
      }
      // length === 0 shouldn't happen, but skip if it does
    }
    GEOJSON.features.push(...edgeLines);

    GEOJSON.features.push(...finalFeatures);

    console.log(GEOJSON);
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
