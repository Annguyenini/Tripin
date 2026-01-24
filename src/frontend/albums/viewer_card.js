import { mediaCardStyle } from "../../styles/function/media_card"
import { View,TouchableOpacity,Text,Modal,Image,FlatList } from "react-native"
import Video from 'react-native-video'
import { Gesture,GestureDetector } from "react-native-gesture-handler"
import { useEffect, useState,useRef } from "react"
import AlbumService from "../../backend/album/albumdb"
import { scheduleOnRN } from "react-native-worklets"
import MediaViewDataCard from "./viewer_data_card"


export default function MediaViewCard({title,uri,type,visible,onClose,AssetArray,isCluster}) {
  if(!AssetArray || AssetArray.length <=0) return null

  const [currentAssetsArray, setCurrentAssetsArray] = useState([...AssetArray])
  const [currentIndex, setCurrentIndex] = useState(Math.max(currentAssetsArray.findIndex(asset => asset.uri ? asset.uri : asset.library_media_path === uri),0))
  const [dataVisible, setDataVisible] = useState(false)
  const observerRef = useRef(null)

  const changeMedia = Gesture.Pan()
    .onEnd((e)=>{
      if(e.velocityX >=250){
        const new_index = Math.min((currentIndex +1),currentAssetsArray.length-1)
        scheduleOnRN (setCurrentIndex,new_index)
      }
      else if(e.velocityX <=-250){
        const new_index = Math.max((currentIndex -1),0)
        scheduleOnRN (setCurrentIndex,new_index)
      }
    })  

  const ImageDataDisplayHandler =()=> setDataVisible(true)

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <GestureDetector gesture={changeMedia}>
        <View style={mediaCardStyle.overlayContainer}>
          <View style={mediaCardStyle.card}>
            <TouchableOpacity style={mediaCardStyle.exitButton} onPress={onClose}>
              <Text style={mediaCardStyle.exitText}>X</Text>
            </TouchableOpacity>
            <TouchableOpacity style={mediaCardStyle.dataButton} onPress={ImageDataDisplayHandler}>
              <Text style={mediaCardStyle.exitText}>...</Text>
            </TouchableOpacity>

            {/* Media Display */}
            {type === "photo" ? (
              <Image 
                style={isCluster ? mediaCardStyle.clusterImage : mediaCardStyle.image} 
                source={{uri: currentAssetsArray[currentIndex].uri ? currentAssetsArray[currentIndex].uri : currentAssetsArray[currentIndex].media_path }}
              />
            ) : (
              <Video
                style={isCluster ? mediaCardStyle.clusterVideo : mediaCardStyle.video}
                source={{uri: currentAssetsArray[currentIndex].uri ? currentAssetsArray[currentIndex].uri : currentAssetsArray[currentIndex].media_path}}
                controls
                resizeMode="cover"
                paused={false}
              />
            )}
          </View>

          {/* Data Card */}
          {dataVisible && (
            <MediaViewDataCard 
              tripName={currentAssetsArray[currentIndex].trip_name}
              lat={currentAssetsArray[currentIndex].latitude}
              lng={currentAssetsArray[currentIndex].longitude}
              date={currentAssetsArray[currentIndex].time_stamp ? currentAssetsArray[currentIndex].time_stamp : currentAssetsArray[currentIndex].creationTime}
              visible={dataVisible}
              onClose={()=>setDataVisible(false)}
            />
          )}

          {/* Bottom Horizontal List for clusters */}
          {isCluster && (
            <View style={mediaCardStyle.bottomListContainer}>
              <FlatList
                data={AssetArray}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: 12 }}
                renderItem={({ item,index }) => (
                  <View style={mediaCardStyle.clusterCard}>
                    <TouchableOpacity onPress={()=>setCurrentIndex(index)}>
                    <Image source={{ uri: item.library_media_path }} style={mediaCardStyle.imageList} />
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
