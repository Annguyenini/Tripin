type TripEvent = "add" | "remove";
export interface Trip_Data {
  active: boolean;
  content_modified_time: number;
  created_time: number;
  ended_time: number;
  event: TripEvent;
  trip_id: number;
  image: string;
  modified_time: number;
  trip_name: string;
  user_id: string;
}
