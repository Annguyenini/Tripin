type ContentCardEvent = "add" | "remove";
export interface ContentCard {
  uuid: string;
  trip_id?: string;
  media_type: string;
  media_path: string;
  time_stamp: number;
  media_id: string;
  event: ContentCardEvent;
  altitude: number;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  city: string;
  region: string;
  country: string;
  iso_country_code: string;
  filename: string;
  minetype?: string;
  trip_name?: string;
  presign_url?: string;
}
