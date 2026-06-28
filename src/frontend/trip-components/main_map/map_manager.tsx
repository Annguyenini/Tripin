import React, { useEffect, useState } from "react";
import { MapBoxLayout } from "../map_box_layout";
import { View } from "react-native";
import { Marker } from "../components/marker/markers";
import MapTransform from "./map_transform";
import LoadingTracker from "../observers/loading_tracker";
// purpose is to handle rendering map, marker, map helper layout
const Map = React.memo(({}) => {
  return <MapBoxLayout></MapBoxLayout>;
});
const MapManager = () => {
  useEffect(() => {
    let initialFollowing = false;

    const mapReady = {
      update(steps) {
        if (steps.length === 3 && !initialFollowing) {
          initialFollowing = true;
          setTimeout(() => {
            MapTransform.followingUser();
          }, 1500);
        }
      },
    };
    LoadingTracker.attach(mapReady);
    return () => LoadingTracker.detach(mapReady);
  }, []);

  return <Map></Map>;
};
export default MapManager;
