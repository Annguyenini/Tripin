import { TouchableOpacity, View, Image } from "react-native";
import React, { use, useRef } from "react";
import { useState, useEffect, useCallback } from "react";

import TripDisplayObserver from "../../observers/trip_display_observer";
import { UseOverlay } from "../../../overlay/overlay_main";
import TripContentsHandler from "../../../../app-core/flow/handlers/trip_contents/trip_contents_handler";
import CurrentDisplayContentsObserver from "../../observers/current_display_contents_observer";
import MediaMarkers from "./image_markers/media_markers";
import CoordinateMarkers from "./coordinate_markers/coordinate_markers";
import MapSharedConfig from "../../main_map/map_shared_config";
import LoadingTracker from "../../observers/loading_tracker";
const image_icon = require("../../../../../assets/image/gallery_icon.png");

export const Marker = ({}) => {
  const [currentDisplayTripData, setCurrentDisplayTripData] = useState(
    TripDisplayObserver.getTripNeedRender(),
  );
  const [contentCards, setContentCards] = useState(null);
  const lastDisplayTripId = useRef(currentDisplayTripData?.trip_id ?? null);
  const { showLoading, hideLoading } = UseOverlay();
  const [coordReady, setCoordReady] = useState(true);
  const [imagesReady, setImageReady] = useState(true);
  const loadingRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(null);
  const allowedZooms = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22,
  ];
  const loadingSteps = [
    "Getting Trip Contents",
    "Generate markers",
    "Ploting Marker",
  ];
  const Loading = () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    showLoading(() => HideLoading, loadingSteps);
  };
  const HideLoading = () => {
    console.log("end", loadingRef.current);
    if (!loadingRef.current) return;
    console.log("end");

    hideLoading();
    loadingRef.current = false;
  };
  const filterCards = (content_cards) => {
    return content_cards.filter((card) => card.event !== "remove");
  };

  // initial
  useEffect(() => {
    console.log("render marker");
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
    const initZoomLevel = () => {
      const zoomlevel = MapSharedConfig.getZoomValue();
      setZoomLevel(zoomlevel ?? 13);
    };
    initContentCards();
    initZoomLevel();
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
    const zoomLevelUpdate = {
      update(zoom) {
        if (zoom && zoom !== zoomLevel && allowedZooms.includes(zoom)) {
          setZoomLevel(zoom);
        }
      },
    };
    MapSharedConfig.attach(zoomLevelUpdate, "zoom");
    return () => MapSharedConfig.detach(zoomLevelUpdate, "zoom");
  }, []);

  useEffect(() => {
    // console.log(imagesReady, coordReady);
    if (!imagesReady || !coordReady) {
      Loading();
    } else {
      HideLoading();
      LoadingTracker.notifyReady("marker");
    }
  }, [coordReady, imagesReady]);
  if (!contentCards) return;
  return (
    <View>
      {currentDisplayTripData && (
        <CoordinateMarkers
          content_cards={contentCards}
          ready={() => setCoordReady(true)}
        ></CoordinateMarkers>
      )}
      {currentDisplayTripData && (
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
