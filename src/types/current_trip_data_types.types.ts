export interface CurrentTripDataObject {
  user_id: any;
  trip_id: string;
  trip_name: string;
  image: string | null;
  created_time: number;
  active: boolean;
  modified_time?: number | null;
  contents_modified_time?: number | null;
}
