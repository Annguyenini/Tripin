import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { Albumstyles } from "../../styles/album";
import { FlatList } from "react-native-gesture-handler";
const FILTERS = ["All", "Trips", "Photos", "Videos"];
import AlbumService from "../../backend/storage/album/album";
import MediaViewCard from "./viewer_card";
import { getAlbumPermission } from "../../backend/album/album_permission";
import { generateOrGetThumbnailFromMediaId } from "../../backend/media/generate_thumbnail";
const videoPauseIcon = require("../../../assets/image/video_pause_icon.png");
export default function AlbumScreen({ onClose }) {
  const [Images, setImages] = useState([]);
  const [imageVisible, setImageVisible] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [currentMediaType, setCurrentMediaType] = useState(null);
  const [fullAlbumPermission, setFullAlbumPermission] = useState(false);
  const [finalImagesArray, setFinalImagesArray] = useState(null);
  useEffect(() => {
    const fetchImages = async () => {
      setImages([...AlbumService.AlbumsArray]);
    };
    const getalbumPermission = async () => {
      const permission = await getAlbumPermission();
      setFullAlbumPermission(
        permission.accessPrivileges !== "all" ? false : true,
      );
    };
    getalbumPermission();
    const updateImages = {
      update(newImages) {
        // console.log("new image", newImages);
        setImages(newImages);
      },
    };
    AlbumService.attach(updateImages);
    fetchImages();

    return () => AlbumService.detach(updateImages);
  }, []);

  useEffect(() => {
    // get thumbnail or get it from cache
    const result = [...Images];

    let unsolve = Images.filter((media) => media.media_type === "video");

    const generateThumbnails = async () => {
      while (unsolve.length > 0) {
        const image = unsolve.shift();
        console.log(image);

        const thumbnail = await generateOrGetThumbnailFromMediaId(
          image.media_id,
          image.media_path,
        );
        const idx = Images.findIndex((imgs) => imgs.uuid === image.uuid);
        result[idx] = { ...image, thumb_nail: thumbnail };
        setFinalImagesArray([...result]); // trickle in
      }
    };
    Promise.all(Array.from({ length: 3 }, () => generateThumbnails())).then(
      () => {
        setFinalImagesArray(result);
      },
    );
  }, [Images]);

  const handleImageClick = (item) => {
    setCurrentMedia(item.media_path);
    setCurrentMediaType(item.mediaType);
    setImageVisible(true);
    // console.log("item", item, imageVisible);
  };

  return (
    <View style={Albumstyles.container}>
      <TouchableOpacity onPress={onClose}>
        <Text style={{ color: "white", fontSize: 40 }}>←</Text>
      </TouchableOpacity>
      {/* {!fullAlbumPermission && (
        <View style={Albumstyles.accessBanner}>
          <Text style={Albumstyles.accessText}>
            📷 You've given us limited photo access — some images might not
            found in your gallery. Full access keeps everything in sync.
          </Text>
          <TouchableOpacity onPress={() => Linking.openSettings()}>
            <Text style={Albumstyles.accessLink}>Fix it in Settings →</Text>
          </TouchableOpacity>
        </View>
      )}*/}
      <FlatList
        data={finalImagesArray}
        extraData={finalImagesArray}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Albumstyles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleImageClick(item)}>
            <Image
              source={{
                uri:
                  item.media_type == "video"
                    ? item.thumb_nail
                    : item.media_path,
              }}
              style={Albumstyles.image}
              cachePolicy="memory-disk"
            />
            {item.media_type === "video" && (
              <View style={Albumstyles.overlay}>
                <Text style={Albumstyles.playButton}>▶</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
      {imageVisible && (
        <MediaViewCard
          title={"test"}
          uri={currentMedia}
          type={currentMediaType}
          visible={imageVisible}
          onClose={() => {
            setImageVisible(false);
            setCurrentMedia(null);
          }}
          AssetArray={finalImagesArray}
        ></MediaViewCard>
      )}
    </View>
  );
}
