import React, { useState } from "react";
import { MapBoxLayout } from "../map_box_layout";
import { View } from "react-native";
import { Marker } from "../components/marker/markers";
// purpose is to handle rendering map, marker, map helper layout
const MapManager = () => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [isMapHelperReady, setIsMapHelperReady] = useState(false);
  const onMapReady = () => {
    setIsMapReady(true);
  };
  const Map = React.memo(({}) => {
    return <MapBoxLayout></MapBoxLayout>;
  });
  return (
    <View>
      <Map></Map>
      {isMapReady}
      {isMapHelperReady && <Marker></Marker>}
    </View>
  );
};
