import  MapboxGL from '@rnmapbox/maps'
import { useEffect, useState } from 'react';
import {View,Image} from'react-native'
import TripAlbumSubject from '../../../backend/trip_album/trip_album_subject';
import Albumdb from '../../../backend/album/albumdb';
const ImageLabel =({trip_id})=>{
  const[currentAssetsArray,setCurrentAssetsArray] = useState([])
  useEffect(()=>{
    const initArray =async()=>{
      const albumArray = await Albumdb.getAssestsFromTripId(trip_id)
      TripAlbumSubject.initAlbumArray(albumArray)
      setCurrentAssetsArray(albumArray)
    }
    const updateAssetsArray={
      update(newArray){
        setCurrentAssetsArray(newArray)
      }
    }
    TripAlbumSubject.attach(updateAssetsArray)
    initArray()
    return ()=>TripAlbumSubject.detach(updateAssetsArray)
  },[])  
  if(!currentAssetsArray || currentAssetsArray.length <1) return 
   return (
    <>
      {currentAssetsArray.map((media, index) => (
        <MapboxGL.MarkerView
          key={`marker-${index}`}
          id={`marker-${index}`}
          coordinate={[media.longitude,media.latitude]}
        >
          <View style={{ width: 50, height: 50 }}>
            <Image
              source={{ uri: media.media_path }}
              style={{ width: 50, height: 50, borderRadius: 15 }}
              resizeMode="cover"
            />
          </View>
        </MapboxGL.MarkerView>
      ))}
    </>
  );  
}
export default ImageLabel