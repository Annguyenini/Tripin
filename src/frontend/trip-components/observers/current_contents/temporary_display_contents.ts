import { ContentCard } from "../../../../types/content_card.types";
import CurrentDisplayContents from "./current_display_contents_observer";

// purpose is for the tripcontent modify to add a temp contents card without save to local
class TemporaryDisplayContents {
  private originalContentCards = [];
  generateTempDisplayContents(trip_id: number, new_temp_content_card) {
    console.log(new_temp_content_card);
    this.originalContentCards = CurrentDisplayContents.getAssetArray(trip_id);
    if (this.originalContentCards?.length <= 0) return;
    let temp_contents = this.originalContentCards;
    // const temp_content: ContentCard = {
    //   uuid: "temp",
    //   trip_id: trip_id,
    //   media_type: new_temp_content_card.media_type,
    //   media_path: new_temp_content_card.media_path,
    //   time_stamp: new_temp_content_card.time_stamp,
    //   media_id: "temp",
    //   event: "add",
    //   altitude: 111,
    //   latitude: new_temp_content_card.latitude,
    //   longitude: new_temp_content_card.longitude,
    //   speed: 111,
    //   heading: 111,
    //   city: new_temp_content_card.city,
    //   region: new_temp_content_card.region,
    //   country: new_temp_content_card.country,
    //   iso_country_code: new_temp_content_card.iso_country_code,
    // };
    temp_contents.push(new_temp_content_card);
    CurrentDisplayContents.setDefaultArray(trip_id, temp_contents);
  }
  resetDisplayContents(trip_id) {
    CurrentDisplayContents.setDefaultArray(trip_id, this.originalContentCards);
  }
}
export default new TemporaryDisplayContents();
