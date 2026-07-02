import { useEffect, useState } from "react";
import TripTimeline from "../timeline/timeline";
import { View, Text } from "react-native";
// import PolaroidGallery from "../memories/PolaroidGallery";
import PolaroidGallery from "./memories";
import { ContentCard } from "../../../../../types/content_card.types";
import CurrentDisplayContentsObserver from "../../../observers/current_contents/current_display_contents_observer";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native";
import InsertNewCard from "../../compoments/gallery/insert_new_card";
import { Modal } from "react-native";

const MemoryManager = ({ trip_id }) => {
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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 8, gap: 10 }}
    >
      <PolaroidGallery displayMedias={contents}></PolaroidGallery>
    </ScrollView>
  );
};

export default MemoryManager;
