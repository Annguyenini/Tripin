import { ContentCard } from "../../types/content_card.types";

const CITY_COORDS: Record<
  string,
  { lat: number; lng: number; region: string; country: string; iso: string }
> = {
  Tokyo: {
    lat: 35.6762,
    lng: 139.6503,
    region: "Tokyo",
    country: "Japan",
    iso: "JP",
  },
  Osaka: {
    lat: 34.6937,
    lng: 135.5023,
    region: "Osaka",
    country: "Japan",
    iso: "JP",
  },
  Kyoto: {
    lat: 35.0116,
    lng: 135.7681,
    region: "Kyoto",
    country: "Japan",
    iso: "JP",
  },
  Hanoi: {
    lat: 21.0285,
    lng: 105.8542,
    region: "Hanoi",
    country: "Vietnam",
    iso: "VN",
  },
  "Ho Chi Minh City": {
    lat: 10.7626,
    lng: 106.6602,
    region: "Ho Chi Minh",
    country: "Vietnam",
    iso: "VN",
  },
  "Da Nang": {
    lat: 16.0544,
    lng: 108.2022,
    region: "Da Nang",
    country: "Vietnam",
    iso: "VN",
  },
  Paris: {
    lat: 48.8566,
    lng: 2.3522,
    region: "Île-de-France",
    country: "France",
    iso: "FR",
  },
};

const EVENT_PLAN: Array<[string, number]> = [
  ["Tokyo", 3],
  ["Osaka", 1],
  ["Kyoto", 2],
  ["Osaka", 1],
  ["Kyoto", 1],
  ["Hanoi", 4],
  ["Ho Chi Minh City", 1],
  ["Hanoi", 1],
  ["Da Nang", 2],
  ["Ho Chi Minh City", 2],
  ["Da Nang", 1],
  ["Paris", 2],
];

// Real, loadable placeholder video for any card that rolls "video" media_type.
// (Publicly hosted Google sample file — stable, CORS-friendly, actually plays.)
const SAMPLE_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

let cardIndex = 1;
// realistic starting timestamp (late night JST-ish vibe)
let timeStamp = 1718000000000;
const cards: ContentCard[] = [];

for (const [city, count] of EVENT_PLAN) {
  const coords = CITY_COORDS[city];
  const citySlug = city.toLowerCase().replace(/ /g, "-");

  for (let i = 0; i < count; i++) {
    const idStr = String(cardIndex).padStart(4, "0");
    const latJitter = (Math.random() - 0.5) * 0.003;
    const lngJitter = (Math.random() - 0.5) * 0.003;
    const isFirstInEvent = i === 0;
    const isVideo = Math.random() > 0.85;

    // picsum.photos seeded URLs always resolve to a real, loadable image —
    // seeding by city+index keeps them stable/reproducible across runs,
    // and different per card so the gallery doesn't look repetitive.
    const imageUrl = `https://picsum.photos/seed/${citySlug}-${idStr}/800/1000`;

    cards.push({
      uuid: `evt-${idStr}`,
      trip_id: 1,
      media_type: isVideo ? "video" : "image",
      media_path: isVideo ? SAMPLE_VIDEO_URL : imageUrl,
      time_stamp: timeStamp,
      media_id: `media-e${idStr}`,
      event: "add",
      altitude: 8 + (cardIndex % 7) * 2,
      latitude: coords.lat + latJitter,
      longitude: coords.lng + lngJitter,
      speed: isFirstInEvent ? 0 : Math.round(3 + Math.random() * 8),
      heading: Math.round(Math.random() * 360),
      city,
      region: coords.region,
      country: coords.country,
      iso_country_code: coords.iso,
    });

    cardIndex++;
    // slightly more realistic spacing (not perfectly linear)
    timeStamp += 600000 + Math.floor(Math.random() * 120000);
  }
}

export const MOCK_CONTENT_CARDS: ContentCard[] = cards;
