import  MapboxGL from '@rnmapbox/maps'
import { useEffect, useState } from 'react';
import {View,Image, TouchableOpacity} from'react-native'
import TripAlbumSubject from '../../../backend/trip_album/trip_album_subject';
import Albumdb from '../../../backend/album/albumdb';
import MediaViewCard from '../../albums/viewer_card';

// figure how to re render the shit!!!!!!!!!
const RenderImageLable =({currentAssetsArray,mapKey, onClick})=>{
  console.log('new',currentAssetsArray)
  return (
      currentAssetsArray.map((media, index) => (
        <MapboxGL.MarkerView
          key={`marker-${media.id}-${mapKey}-${media.library_media_path}`}
          id={`marker-${media.id}`}
          coordinate={[media.longitude, media.latitude]}
        >
          <TouchableOpacity onPress={()=>onClick(media)}>
            <View style={{ width: 50, height: 50 }}>
              <Image
                source={{ uri: media.media_path }}
                style={{ width: 50, height: 50, borderRadius: 15 }}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        </MapboxGL.MarkerView>
      ))
    )
}
const ImageLabel = ({ trip_id }) => {
  const [currentAssetsArray, setCurrentAssetsArray] = useState([])
  const [mapKey, setMapKey] = useState(0)
  const [visible, setVisible] = useState(false)
  const [currentAsset, setCurrentAsset] = useState(null)

  useEffect(() => {
    const initArray = async () => {
      const albumArray = await Albumdb.getAssestsFromTripId(trip_id)
      TripAlbumSubject.initAlbumArray(albumArray)
      setCurrentAssetsArray([...albumArray])
    }
    
    const updateAssetsArray = {
      update(newArray) {
        console.log('Update received:', newArray.length)
        setCurrentAssetsArray([...newArray])
        setMapKey(prev => prev + 1) // Change this key
      }
    }
    
    TripAlbumSubject.attach(updateAssetsArray)
    initArray()
    return () => TripAlbumSubject.detach(updateAssetsArray)
  }, [trip_id])

  if (!currentAssetsArray || currentAssetsArray.length < 1) return null

  const labelDisplayHandler = (item)=>{
    setCurrentAsset(item)
    setVisible(true)
  }
  console.log(mapKey)

  return (
    <View key={mapKey}> 
      <RenderImageLable currentAssetsArray={currentAssetsArray} mapKey={mapKey} onClick={labelDisplayHandler}></RenderImageLable>
    {visible && <MediaViewCard title={'test'} uri={currentAsset.library_media_path} type={currentAsset.media_type} visible={visible} onClose={()=>setVisible(false)} AssetArray={currentAssetsArray}/>}
    </View>
  )
}
export default ImageLabel