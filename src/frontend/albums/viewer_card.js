import { mediaCardStyle, deleteCardStyle } from "../../styles/function/media_card"
import { View, TouchableOpacity, Text, Modal, FlatList, Animated } from "react-native"
import { Image } from 'expo-image'

import Video from 'react-native-video'
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { useEffect, useState, useRef } from "react"
import AlbumService from "../../backend/album/albumdb"
import { scheduleOnRN } from "react-native-worklets"
import MediaViewDataCard from "./viewer_data_card"
import GenerateThumbnail from "../../backend/album/generate_thumbnail"
const videoPauseIcon = require('../../../assets/image/video_pause_icon.png')

import { MaterialIcons } from '@expo/vector-icons';
import TripContentHandler from "../../app-core/flow/trip_contents_handler"
import { OverlayCard } from "../custom_function/overlay_card"
import safeRun from "../../app-core/helpers/safe_run"

export default function MediaViewCard({ title, uri, type, visible, onClose, AssetArray, isBottomList, propButton }) {
  if (!AssetArray || AssetArray.length <= 0) return null
  // const modifiedAssetArray =[... AssetArray.map(async(item)=>{
  //   if(item.media_type ==='video' || item.mediaType==='video'){
  //     item.thumbnail =await GenerateThumbnail(item.uri ? item.uri : item.library_media_path)
  //   }
  // })]


  const currentAssetsArray = AssetArray;
  const [currentIndex, setCurrentIndex] = useState(Math.max(currentAssetsArray.findIndex(asset => asset.media_path === uri), 0))
  const [dataVisible, setDataVisible] = useState(false)
  const observerRef = useRef(null)
  const [isFullScreen, setFullScreen] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  console.log('media', currentAssetsArray[currentIndex].media_path, currentIndex)
  // ── ANIMATION ──
  const slideAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(1)).current
  const prevIndex = useRef(currentIndex)

  useEffect(() => {
    if (prevIndex.current === currentIndex) return
    const dir = currentIndex > prevIndex.current ? 1 : -1
    prevIndex.current = currentIndex

    // reset to off-screen in the incoming direction
    slideAnim.setValue(dir * 60)
    fadeAnim.setValue(0)

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start()
  }, [currentIndex])

  const changeMedia = Gesture.Pan()
    .onEnd((e) => {
      if (e.velocityX >= 250) {
        const new_index = Math.min((currentIndex + 1), currentAssetsArray.length - 1)
        scheduleOnRN(setCurrentIndex, new_index)
      }
      else if (e.velocityX <= -250) {
        const new_index = Math.max((currentIndex - 1), 0)
        scheduleOnRN(setCurrentIndex, new_index)
      }
    })

  const ImageDataDisplayHandler = () => setDataVisible(true)
  const fullScreenHanlder = () => {
    setFullScreen(prev => prev === false ? true : false)
  }
  const deletePopup = () => {
    return (
      <OverlayCard onClose={() => setDeleteVisible(false)}>

        <View style={deleteCardStyle.iconCircle}>
          <MaterialIcons name="delete" size={24} color="white" />
        </View>
        <Text style={deleteCardStyle.title}>Are you sure?</Text>
        <View style={deleteCardStyle.buttons}>
          <TouchableOpacity style={deleteCardStyle.cancelBtn} onPress={() => setDeleteVisible(false)}>
            <Text style={deleteCardStyle.cancelText}>Nooo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={deleteCardStyle.confirmBtn} onPress={() => { deleteImageHandler(); setDeleteVisible(false); }}>
            <Text style={deleteCardStyle.confirmText}>Bye!</Text>
          </TouchableOpacity>
        </View>


      </OverlayCard>
    )
  }
  const deleteImageHandler = async () => {
    const current_media = currentAssetsArray[currentIndex]

    onClose()
    await TripContentHandler.deleteMediaHandler(
      current_media.trip_id,
      current_media.media_id,
      current_media.media_path,)
    if (current_media.coordinate_id) {
      console.log(current_media)
      await safeRun(() => TripContentHandler.deleteCoordinateHandler(current_media.trip_id, current_media.coordinate_id))
    }
  }
  // const source = ()=>{

  //   if(!currentAssetsArray[currentIndex].uri)
  // }
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <GestureDetector gesture={changeMedia}>
        <View style={mediaCardStyle.overlayContainer}>

          <View style={isFullScreen ? mediaCardStyle.fullCard : mediaCardStyle.card}>
            {propButton}
            <TouchableOpacity style={mediaCardStyle.exitButton} onPress={onClose}>
              <Text style={mediaCardStyle.exitText}>X</Text>
            </TouchableOpacity>
            <TouchableOpacity style={mediaCardStyle.dataButton} onPress={ImageDataDisplayHandler}>
              <Text style={mediaCardStyle.exitText}>...</Text>
            </TouchableOpacity>
            <TouchableOpacity style={mediaCardStyle.deleteButton} onPress={() => setDeleteVisible(true)}>
              <Text style={mediaCardStyle.exitText}><MaterialIcons name="delete" size={24} color="red" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={mediaCardStyle.fullscreenButton} onPress={fullScreenHanlder}>
              <Text style={mediaCardStyle.exitText}>⛶</Text>
            </TouchableOpacity>

            {/* ── Animated media wrapper ── */}
            <Animated.View style={{
              flex: 1,
              transform: [{ translateX: slideAnim }],
              opacity: fadeAnim,
            }}>
              {/* Media Display */}
              {currentAssetsArray[currentIndex].media_type === 'video' ||
                currentAssetsArray[currentIndex].media_type === 'video' ? (
                <Video
                  style={isFullScreen ? mediaCardStyle.fullVideo : mediaCardStyle.video}
                  source={{ uri: currentAssetsArray[currentIndex].media_path }}
                  controls
                  resizeMode="cover"
                  paused={false}
                />
              ) : (

                <Image
                  style={isFullScreen ? mediaCardStyle.fullImage : mediaCardStyle.image}
                  source={{ uri: currentAssetsArray[currentIndex].media_path }}
                />
              )}
            </Animated.View>

          </View>
          {
            deleteVisible && deletePopup()
          }
          {/* Data Card */}
          {dataVisible && (
            <MediaViewDataCard
              tripName={currentAssetsArray[currentIndex].trip_name}
              lat={currentAssetsArray[currentIndex].latitude}
              lng={currentAssetsArray[currentIndex].longitude}
              date={currentAssetsArray[currentIndex].time_stamp ? currentAssetsArray[currentIndex].time_stamp : currentAssetsArray[currentIndex].creationTime}
              visible={dataVisible}
              onClose={() => setDataVisible(false)}
            />
          )}

          {/* Bottom Horizontal List for clusters */}
          {isBottomList && !isFullScreen && (
            <View style={mediaCardStyle.bottomListContainer}>
              <FlatList
                data={AssetArray}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.media_id.toString()}
                contentContainerStyle={{ paddingHorizontal: 12 }}
                renderItem={({ item, index }) => (
                  <View style={mediaCardStyle.clusterCard}>
                    <TouchableOpacity onPress={() => setCurrentIndex(index)}>
                      <Image source={{ uri: item.media_type === 'video' ? item.thumb_nail : item.media_path }} style={mediaCardStyle.imageList} />
                      {
                        item.media_type === 'video' &&
                        <View style={mediaCardStyle.ImageListOverlay}>
                          <Text style={mediaCardStyle.playButton}>▶</Text>
                        </View>
                      }
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </GestureDetector>
    </Modal>
  )
}