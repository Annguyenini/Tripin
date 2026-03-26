import React, { useEffect, useState ,useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,Linking
} from 'react-native';
import { Image } from 'expo-image';
import { Albumstyles } from '../../styles/album';
import { FlatList } from 'react-native-gesture-handler';
const FILTERS = ['All', 'Trips', 'Photos', 'Videos'];
import AlbumService from '../../backend/album/albumdb';
import { navigate } from '../custom_function/navigationService';
import MediaViewCard from './viewer_card';
import Permission from '../../backend/storage/settings/permissions';
import { getAlbumPermission } from '../../backend/album/album_permission';
import * as VideoThumbnails from 'expo-video-thumbnails';

const videoPauseIcon = require('../../../assets/image/video_pause_icon.png')
export default function AlbumScreen() {
    const [Images ,setImages]=useState([])
    const [imageVisible,setImageVisible]= useState(false)
    const [currentMedia,setCurrentMedia] = useState(null)
    const [currentMediaType,setCurrentMediaType] = useState(null)
    const [fullAlbumPermission,setFullAlbumPermission]=useState(false)
    useEffect(()=>{
        const fetchImages=async()=>{
          const assets = await AlbumService.getMergedMediasArray()
            
            setImages(assets)
        }
        const getalbumPermission =async()=>{
          const permission=await getAlbumPermission()
          setFullAlbumPermission(permission.accessPrivileges!=='all'? false:true)
        }
        getalbumPermission()
        const updateImages ={
          update(newImages){
            console.log('new image',newImages)
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
        setCurrentMedia(item.media_path)
        setCurrentMediaType(item.mediaType)
        setImageVisible(true)        
        console.log('item',item,imageVisible)
    }
    
    console.log(Images)
  return (
    
    <View style={Albumstyles.container}>
        <TouchableOpacity onPress={onCallMainScreen}>
            <Text style={{color:'white',fontSize:40}}>←</Text>
        </TouchableOpacity>
        {!fullAlbumPermission&&
        <View style={Albumstyles.accessBanner}>
            <Text style={Albumstyles.accessText}>
                📷 You've given us limited photo access — some images might not found in your gallery. Full access keeps everything in sync.
            </Text>
            <TouchableOpacity onPress={() => Linking.openSettings()}>
                <Text style={Albumstyles.accessLink}>Fix it in Settings →</Text>
            </TouchableOpacity>
        </View>
}
      <FlatList
        data={Images}
        extraData={Images}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Albumstyles.list}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>handleImageClick(item)}>
              
          <Image source={{ uri: item.media_path }} style={Albumstyles.image} cachePolicy="memory-disk"  />
          {
                item.mediaType ==='video' &&
                 <View style={Albumstyles.overlay}>
                  <Image
                    cachePolicy="memory-disk" 
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
      <MediaViewCard title ={'test'} uri ={currentMedia} type={currentMediaType} visible ={imageVisible} onClose={() => {
  setImageVisible(false)
  setCurrentMedia(null)
}} AssetArray={Images}></MediaViewCard>

      }
    </View>
  );
}
