import { TouchableOpacity, View, Image } from "react-native";
import React, { useRef } from "react";
import { useState, useEffect, useCallback } from "react";

import TripDisplayObserver from "../../observers/trip_display_observer";
import { UseOverlay } from "../../../overlay/overlay_main";
import TripContentsHandler from "../../../../app-core/flow/trip_contents_handler";
import CurrentDisplayContentsObserver from "../../observers/current_display_contents_observer";
import MediaMarkers from "./image_markers/media_markers";
import CoordinateMarkers from "./coordinate_markers/coordinate_markers";
const image_icon = require("../../../../../assets/image/gallery_icon.png");

export const Marker = ({
  zoomLevel,
  isDisplayImageMaker,
  isCoordsMarkerDisplay,
}) => {
  const [currentDisplayTripData, setCurrentDisplayTripData] = useState(
    TripDisplayObserver.getTripNeedRender(),
  );
  const [contentCards, setContentCards] = useState(null);
  const lastDisplayTripId = useRef(currentDisplayTripData?.trip_id ?? null);
  const { showLoading, hideLoading } = UseOverlay();
  const [coordReady, setCoordReady] = useState(true);
  const [imagesReady, setImageReady] = useState(true);

  const filterCards = (content_cards) => {
    return content_cards.filter((card) => card.event !== "remove");
  };

  // initial
  useEffect(() => {
    const initContentCards = async () => {
      const content_cards = await TripContentsHandler.getTripContents(
        currentDisplayTripData?.trip_id,
      );
      setContentCards(filterCards(content_cards));
      CurrentDisplayContentsObserver.setDefaultArray(
        currentDisplayTripData?.trip_id,
        filterCards(content_cards),
      );
    };
    initContentCards();
  }, [currentDisplayTripData]);

  // call back for display trip change
  useEffect(() => {
    const updateDisplayTripData = {
      update(new_data) {
        // if (new_data?.trip_id === currentDisplayTripData?.trip_id) return;
        setCurrentDisplayTripData(new_data ?? null);
      },
    };
    TripDisplayObserver.attach(
      updateDisplayTripData,
      TripDisplayObserver.EVENTS,
    );
    return () =>
      TripDisplayObserver.detach(
        updateDisplayTripData,
        TripDisplayObserver.EVENTS,
      );
  }, []);

  // call back for contents update
  useEffect(() => {
    const updateContentCards = {
      update(newAsset) {
        setContentCards(filterCards(newAsset));
      },
    };
    CurrentDisplayContentsObserver.attach(
      updateContentCards,
      CurrentDisplayContentsObserver.GENERATE_KEY(
        currentDisplayTripData?.trip_id,
      ),
    );
    return () =>
      CurrentDisplayContentsObserver.detach(
        updateContentCards,
        CurrentDisplayContentsObserver.GENERATE_KEY(
          currentDisplayTripData?.trip_id,
        ),
      );
  }, [currentDisplayTripData]);
  useEffect(() => {
    console.log(imagesReady, coordReady);
    if (!imagesReady || !coordReady) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [coordReady, imagesReady]);
  if (!contentCards) return;
  return (
    <View>
      {currentDisplayTripData && isCoordsMarkerDisplay && (
        <CoordinateMarkers
          content_cards={contentCards}
          ready={() => setCoordReady(true)}
        ></CoordinateMarkers>
      )}
      {currentDisplayTripData && isDisplayImageMaker && (
        <MediaMarkers
          content_cards={contentCards}
          zoomLevel={zoomLevel}
          ready={() => setImageReady(true)}
        ></MediaMarkers>
      )}
      {/* <Image source ={{uri:image_icon}}>
            </Image> */}
    </View>
  );
};
