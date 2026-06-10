import { useEffect, useState } from "react";
import TripDisplayObserver from "./observers/trip_display_observer";
import CurrentDisplayContentsObserver from "./observers/current_display_contents_observer";
import { addObserver } from "../utils/map_flyto";
import { flyToMarker } from "../utils/map_ref";

const mapData = () => {
  const [currentTripDisplayData, setCurrentTripDisplayData] = useState(
    TripDisplayObserver.getTripNeedRender(),
  );
  const [centerCoords, setCenterCoords] = useState(null);

  const coordsFromArray = (arr) => {
    const first = arr?.[0];
    if (!first?.latitude || !first?.longitude) return null;
    return [first.longitude, first.latitude];
  };

  useEffect(() => {
    const observer = {
      update(newTripData) {
        setCurrentTripDisplayData(newTripData ? { ...newTripData } : null);
      },
    };
    TripDisplayObserver.attach(observer, TripDisplayObserver.EVENTS);
    return () =>
      TripDisplayObserver.detach(observer, TripDisplayObserver.EVENTS);
  }, []);

  useEffect(() => {
    if (!currentTripDisplayData) {
      setCenterCoords(null);
      return;
    }

    const key = CurrentDisplayContentsObserver.GENERATE_KEY(
      currentTripDisplayData.trip_id,
    );

    const existing = CurrentDisplayContentsObserver.getAssetArray(
      currentTripDisplayData.trip_id,
    );
    flyToMarker(coordsFromArray(existing), 15);
    setCenterCoords(coordsFromArray(existing));

    const observer = {
      update(arr) {
        flyToMarker(coordsFromArray(arr), 15);

        setCenterCoords(coordsFromArray(arr));
      },
    };

    CurrentDisplayContentsObserver.attach(observer, key);
    return () => CurrentDisplayContentsObserver.detach(observer, key);
  }, [currentTripDisplayData]);

  useEffect(() => {
    const observer = {
      update(arr) {
        flyToMarker(coordsFromArray(arr), 15);

        setCenterCoords(coordsFromArray(arr));
      },
    };
    // addObserver(observer);
  }, []);
  return { centerCoords };
};

export default mapData;
