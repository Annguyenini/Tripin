import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import CurrentDisplayContentsObserver from "../../../observers/current_display_contents_observer";

import GalleryOverlay from "./GalleryOverlay";
import PolaroidCard from "./PolaroidCard";
import PhotoSheet from "./PhotoSheet";
import { SLOT_W, GALLERY_H } from "./constants";

export default function PolaroidGallery({ trip_id }) {
  const [selected, setSelected] = useState(null);
  const [locations, setLocations] = useState([]);

  const [data, setData] = useState(
    CurrentDisplayContentsObserver.watchArray[
      CurrentDisplayContentsObserver.GENERATE_KEY(trip_id)
    ],
  );

  useEffect(() => {
    const key = CurrentDisplayContentsObserver.GENERATE_KEY(trip_id);

    const obs = {
      update(d) {
        setData([...d]);
      },
    };

    CurrentDisplayContentsObserver.attach(obs, key);
    return () => CurrentDisplayContentsObserver.detach(obs, key);
  }, []);

  useEffect(() => {
    const grouped = [];

    for (const m of data || []) {
      let g = grouped.find((x) => x.city === m.city);

      if (!g) {
        g = {
          city: m.city,
          region: m.region,
          country: m.country,
          iso_country_code: m.iso_country_code,
          hang: grouped.length % 2,
          rot: grouped.length % 2 ? 6 : -5,
          medias: [],
        };
        grouped.push(g);
      }

      g.medias.push(m);
    }

    setLocations(grouped);
  }, [data]);

  const width = Math.max(600, locations.length * SLOT_W + 80);

  if (!locations.length) return null;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ width, height: GALLERY_H }}>
          <GalleryOverlay width={width} locationArray={locations} />

          {locations.map((loc, i) => (
            <PolaroidCard
              key={loc.city}
              location={loc}
              index={i}
              onPress={() => setSelected(loc)}
            />
          ))}
        </View>
      </ScrollView>

      {selected && (
        <PhotoSheet location={selected} onClose={() => setSelected(null)} />
      )}
    </View>
  );
}
