import { useEffect, useState } from "react";
import TripTimeline from "./timeline";

import { ContentCard } from "../../../../../types/content_card.types";
import CurrentDisplayContentsObserver from "../../../observers/current_contents/current_display_contents_observer";

const TimeLineManager = ({ trip_id }) => {
  const initialContents = CurrentDisplayContentsObserver.getAssetArray(trip_id);
  const contentKey = CurrentDisplayContentsObserver.GENERATE_KEY(trip_id);
  const [isTimeLine, setIsTimeLine] = useState<boolean>(false);
  const [isInsert, setIsInsert] = useState(false);
  const [contents, setContents] = useState<ContentCard[]>(initialContents);

  // observer for new contents
  useEffect(() => {
    const updateContents = {
      update(newContents: Array<ContentCard>) {
        setContents(newContents);
      },
    };
    CurrentDisplayContentsObserver.attach(updateContents, contentKey);
  }, []);
  const addContentHandler = (index) => {
    setIsInsert(true);
    console.log(index);
  };
  return (
    <TripTimeline
      cards={contents}
      onAddPress={addContentHandler}
    ></TripTimeline>
  );
};

export default TimeLineManager;
