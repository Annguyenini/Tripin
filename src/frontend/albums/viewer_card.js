import { mediaCardStyle } from "../../styles/function/media_card"
import { View,TouchableOpacity,Text,Modal,Image } from "react-native"
import Video from 'react-native-video'
import { Gesture,GestureDetector } from "react-native-gesture-handler"
import { useEffect, useState } from "react"
import AlbumService from "../../backend/album/albumdb"
import { scheduleOnRN } from "react-native-worklets"



export default function MediaViewCard({title,uri,type,visible,onClose}) {
  const [currentAssetsArray, setCurrentAssetsArray] = useState(AlbumService.AlbumsArray)
  const [currentIndex, setCurrentIndex] = useState(currentAssetsArray.findIndex(assest => assest.uri ===uri))
  useEffect(()=>{
    const updateArray ={
      update(newArray){
        setCurrentAssetsArray(newArray)
      }
    }
    // const getCurrentIndex=()=>{
    //   const new_index =currentAssetsArray.findIndex(assest => assest.uri ===uri)
    //   setCurrentIndex(new_index)
    // }
    // getCurrentIndex()
    AlbumService.attach(updateArray)
    
    return()=>AlbumService.detach(updateArray)
  
  },[])
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
                  {type ==="photo" ? <Image style ={mediaCardStyle.image} source ={{uri:currentAssetsArray[currentIndex].uri}}></Image> 
                  : <Video
                    style ={mediaCardStyle.video}
                    source={{uri:currentAssetsArray[currentIndex].uri}}
                    controls={true}       // shows play/pause
                    resizeMode="cover"
                    paused={false}>

                    </Video>
                  
                  }
                </View>
              </View>
            </GestureDetector>

          </Modal>

    )
}