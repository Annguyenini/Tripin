import { mediaCardStyle } from "../../styles/function/media_card"
import { View,TouchableOpacity,Text,Modal,Image } from "react-native"
import Video from 'react-native-video'
import { Gesture,GestureDetector } from "react-native-gesture-handler"
import { useEffect, useState,useRef } from "react"
import AlbumService from "../../backend/album/albumdb"
import { scheduleOnRN } from "react-native-worklets"
import MediaViewDataCard from "./viewer_data_card"


export default function MediaViewCard({title,uri,type,visible,onClose,AssetArray}) {
  console.log(AssetArray)
  if(!AssetArray || AssetArray.length <=0) return null
  const [currentAssetsArray, setCurrentAssetsArray] = useState([...AssetArray])
  const [currentIndex, setCurrentIndex] = useState(Math.max(currentAssetsArray.findIndex(assest => assest.uri? assest.uri : assest.library_media_path === uri),0))
  const [dataVisible, setDataVisible] = useState(false)
  const observerRef = useRef(null)
  console.log('index',currentIndex)
  const changeMedia = Gesture.Pan()
//  velX -250  250
  .onEnd((e)=>{
    'worket'
    if(e.velocityX >=250){
      const new_index = Math.min((currentIndex +1),currentAssetsArray.length-1)
      scheduleOnRN (setCurrentIndex,new_index)
    }
    else if(e.velocityX <=-250){
      const new_index = Math.max((currentIndex -1),0)
      scheduleOnRN (setCurrentIndex,new_index)
    }
  })  

  const ImageDataDisplayHandler =()=>{
    setDataVisible(true)
  }
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
                  {type ==="photo" ? <Image style ={mediaCardStyle.image} source ={{uri:currentAssetsArray[currentIndex].uri ?currentAssetsArray[currentIndex].uri :currentAssetsArray[currentIndex].media_path }}></Image> 
                  : <Video
                    style ={mediaCardStyle.video}
                    source={{uri:currentAssetsArray[currentIndex].uri ?currentAssetsArray[currentIndex].uri :currentAssetsArray[currentIndex].media_path}}
                    controls={true}       // shows play/pause
                    resizeMode="cover"
                    paused={false}>

                    </Video>
                  
                  }
                </View>
                 {dataVisible && <MediaViewDataCard tripName={currentAssetsArray[currentIndex].trip_name}
                                                  lat={currentAssetsArray[currentIndex].latitude}
                                                  lng={currentAssetsArray[currentIndex].longitude}
                                                  date={currentAssetsArray[currentIndex].time_stamp ? currentAssetsArray[currentIndex].time_stamp : currentAssetsArray[currentIndex].creationTime}
                                                  visible={dataVisible}
                                                  onClose={()=>setDataVisible(false)}/>}
              </View>
             
            </GestureDetector>

          </Modal>

    )
}