import  MapboxGL from '@rnmapbox/maps'
import { useEffect, useState,useMemo } from 'react';
import {View,Image, TouchableOpacity,Text} from'react-native'
import TripAlbumSubject from '../../../backend/trip_album/trip_album_subject';
import Albumdb from '../../../backend/album/albumdb';
import MediaViewCard from '../../albums/viewer_card';
import { computeCluster } from '../../../backend/addition_functions/compute_cluster';
import {imageLabelStyle} from '../../../styles/function/image_label'
// figure how to re render the shit!!!!!!!!!
const RenderImageLable =({clusters,mapKey, onClick})=>{
  // console.log('new',currentAssetsArray)
  return (
      clusters.map((cluster) => (
        <View key={cluster.cluster_id}>
          {cluster.members.map((media) => (
        <MapboxGL.MarkerView
          key={`marker-${media.id}-${mapKey}-${media.library_media_path}`}
          id={`marker-${media.id}`}
          coordinate={[media.longitude, media.latitude]}
        >
          <TouchableOpacity onPress={()=>onClick(media,cluster.cluster_id)}>
            <View style={{ width: 50, height: 50 }}>
              <Image
                source={{ uri: media.media_path }}
                style={{ width: 50, height: 50, borderRadius: 15 }}
                resizeMode="cover"
              />
              <View style={imageLabelStyle.badge}>
                <Text style={imageLabelStyle.badgeText}>3</Text>
              </View>
            </View>
          </TouchableOpacity>
        </MapboxGL.MarkerView>
        ))}
        </View>
      ))
    )
}


const ImageLabel = ({ trip_id,zoomLevel }) => {
  const [currentAssetsArray, setCurrentAssetsArray] = useState([])
  const [mapKey, setMapKey] = useState(0)
  const [visible, setVisible] = useState(false)
  const [currentAsset, setCurrentAsset] = useState(null)
  const [currentCluster,setCurrentCluster] = useState([])
  const [currentDisplayCluster,setCurrentDisplayCluster] = useState([])
  const clusters = new Map()
  // const [cluster950,setCluster950] = useState([])
  // const [cluster250,setCluster250] = useState([])

  useEffect(() => {
    const initArray = async () => {
      const albumArray = await Albumdb.getAssestsFromTripId(trip_id)
      TripAlbumSubject.initAlbumArray(albumArray)
      setCurrentAssetsArray([...albumArray])
    }
    
    const updateAssetsArray = {
      update(newArray) {
        // console.log('Update received:', newArray.length)
        setCurrentAssetsArray([...newArray])
        setMapKey(prev => prev + 1) 
      }
    }
    
    TripAlbumSubject.attach(updateAssetsArray)
    initArray()
    return () => TripAlbumSubject.detach(updateAssetsArray)
  }, [trip_id])

  useMemo(()=>{
    const Cluster950 =computeCluster(currentAssetsArray,950)
    const Cluster250 =computeCluster(currentAssetsArray,250)

    clusters.set(950,[...Cluster950])
    clusters.set(250,[...Cluster250])
    setCurrentCluster(Cluster250)
    console.log(Cluster250)
  },[currentAssetsArray])

  if (!currentAssetsArray || currentAssetsArray.length < 1) return null

  const labelDisplayHandler = (media, cluster_id)=>{
    setCurrentAsset(media)
    setVisible(true)
    setCurrentDisplayCluster(currentCluster[cluster_id].members)
    console.log(cluster_id)
  }

  return (
    <View key={mapKey}> 
      <RenderImageLable clusters={currentCluster} mapKey={mapKey} onClick={labelDisplayHandler}></RenderImageLable>
    {visible && <MediaViewCard title={'test'} uri={currentAsset.library_media_path} type={currentAsset.media_type} visible={visible} onClose={()=>setVisible(false)} AssetArray={currentDisplayCluster} isCluster={true}/>}
    </View>
  )
}
export default ImageLabel