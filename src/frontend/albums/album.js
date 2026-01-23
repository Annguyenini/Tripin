import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal
} from 'react-native';
import { Albumstyles } from '../../styles/album';
import { FlatList } from 'react-native-gesture-handler';
const FILTERS = ['All', 'Trips', 'Photos', 'Videos'];
import AlbumService from '../../backend/album/albumdb';
import { navigate } from '../custom_function/navigationService';
import MediaViewCard from './viewer_card';
// const IMAGE_SIZE = (Dimensions.get('window').width - 32) / 3;


// mock data (replace with MediaLibrary assets)
// const IMAGES = [
//   { id: '1', uri: 'https://picsum.photos/400/400?1' },
//   { id: '2', uri: 'https://picsum.photos/400/400?2' },
//   { id: '3', uri: 'https://picsum.photos/400/400?3' },
//   { id: '4', uri: 'https://picsum.photos/400/400?4' },
//   { id: '5', uri: 'https://picsum.photos/400/400?5' },
//   { id: '6', uri: 'https://picsum.photos/400/400?6' },
// ];
// let IMAGES =[]
// for (let i = 30; i <=40; i++){
//     IMAGES.push({id:'i',uri :'https://picsum.photos/400/400?random=${i + 1}'})
// }
const videoPauseIcon = require('../../../assets/image/video_pause_icon.png')
export default function AlbumScreen() {
    const [Images ,setImages]=useState([])
    const [imageVisible,setImageVisible]= useState(false)
    const [currentMedia,setCurrentMedia] = useState(null)
    const [currentMediaType,setCurrentMediaType] = useState(null)
    useEffect(()=>{
        const fetchImages=async()=>{
            const assets = await AlbumService.getMergedMediasArray()
            
            setImages(assets)
        }
        const updateImages ={
          update(newImages){
            setImages(newImages)
          }
        }
        AlbumService.attach(updateImages)
        fetchImages()
        return ()=>AlbumService.detach(updateImages)
    },[])

    const onCallMainScreen =()=>{
        navigate('Main')
    }



    const handleImageClick=(item)=>{
        setCurrentMedia(item.uri)
        setCurrentMediaType(item.mediaType)
        setImageVisible( prev =>prev === true?  false :true)
    }
  return (
    
    <View style={Albumstyles.container}>
        <TouchableOpacity onPress={onCallMainScreen}>
            <Text style={{color:'white',fontSize:40}}>←</Text>
        </TouchableOpacity>
      <FlatList
        data={Images}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Albumstyles.list}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>handleImageClick(item)}>
              
          <Image source={{ uri: item.uri }} style={Albumstyles.image} />
          {
                item.mediaType ==='video' &&
                 <View style={Albumstyles.overlay}>
                  <Image
                    source={videoPauseIcon} 
                    resizeMode="contain"
                    style={Albumstyles.overlayImage}
                  />
                </View>
              }
          </TouchableOpacity>
        )}
      />
      {imageVisible && 
      <MediaViewCard title ={'test'} uri ={currentMedia} type={currentMediaType} visible ={imageVisible} onClose={()=>setImageVisible(false)} AssetArray={AlbumService.AlbumsArray}></MediaViewCard>

      }
    </View>
  );
}
