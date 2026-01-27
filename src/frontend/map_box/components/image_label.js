import  MapboxGL from '@rnmapbox/maps'
import { useEffect, useState,useMemo,useCallback } from 'react';
import {View,Image, TouchableOpacity,Text} from'react-native'
import TripAlbumSubject from '../../../backend/trip_album/trip_album_subject';
import Albumdb from '../../../backend/album/albumdb';
import MediaViewCard from '../../albums/viewer_card';
import { computeCluster } from '../../../backend/addition_functions/compute_cluster';
import {imageLabelStyle} from '../../../styles/function/image_label'
// figure how to re render the shit!!!!!!!!!
const videoPauseIcon = require('../../../../assets/image/video_pause_icon.png')

const RenderImageLable =({clusters,mapKey, onClick})=>{
  if(! clusters) return null

  return (
      clusters.map((cluster) => (
        <View key={cluster.cluster_id}>

        <MapboxGL.MarkerView
          key={`marker-${cluster.cluster_id}`}
          id={`marker-${cluster.cluster_id}`}
          coordinate={[cluster.center.lng, cluster.center.lat]}
        >
          <TouchableOpacity onPress={()=>onClick(cluster.members[0],cluster.cluster_id)}>
            <View style={{ width: 50, height: 50 }}>
              <Image
                source={{ uri: cluster.members[0].library_media_path }}
                style={{ width: 50, height: 50, borderRadius: 15 }}
                resizeMode="cover"
              />
              { cluster.members[0].media_type ==='video'&&
                <View style={imageLabelStyle.videoOverlayCard}>
                  <Image
                    source={videoPauseIcon} 
                    resizeMode="contain"
                    style={imageLabelStyle.overlayImage}
                  />
                </View>
                } 
              <View style={imageLabelStyle.badge}>
                <Text style={imageLabelStyle.badgeText}>{cluster.members.length}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </MapboxGL.MarkerView>
        </View>
      ))
    )
}


const ImageLabel = ({ trip_id,zoomLevel }) => {
  const [currentAssetsArray, setCurrentAssetsArray] = useState([])
  const [mapKey, setMapKey] = useState(0)
  const [visible, setVisible] = useState(false)
  const [currentAsset, setCurrentAsset] = useState(null)
  const [currentDisplayCluster,setCurrentDisplayCluster] = useState([])
  // const clusters = new Map()

  useEffect(() => {
    const initArray = async () => {
      const albumArray = await Albumdb.getAssestsFromTripId(trip_id)
      TripAlbumSubject.initAlbumArray(albumArray)
      setCurrentAssetsArray([...albumArray])
    }
    
    const updateAssetsArray = {
      update(newArray) {
        setCurrentAssetsArray([...newArray])
        setMapKey(prev => prev + 1) 
      }
    }
    
    TripAlbumSubject.attach(updateAssetsArray)
    initArray()
    return () => TripAlbumSubject.detach(updateAssetsArray)
  }, [trip_id])

  const clusters = useMemo(()=>{
    return new Map([
      [13, computeCluster(currentAssetsArray,950)],
      [15, computeCluster(currentAssetsArray,250)],
      [20, computeCluster(currentAssetsArray,3)],
      [21, computeCluster(currentAssetsArray,2)],
      [22, computeCluster(currentAssetsArray,0.5)]
    ])
  },[currentAssetsArray])


  const currentCluster =useMemo(()=>{
    return(clusters.get(zoomLevel)??[])
  },[zoomLevel,clusters])

  if (!currentAssetsArray || currentAssetsArray.length < 1) return null

  const labelDisplayHandler = (media, cluster_id)=>{
    setCurrentAsset(media)
    setVisible(true)
    setCurrentDisplayCluster(currentCluster[cluster_id].members)
  }

  return (
    <View key={mapKey}> 
      <RenderImageLable clusters={currentCluster} mapKey={mapKey} onClick={labelDisplayHandler}></RenderImageLable>
    {visible && <MediaViewCard title={'test'} uri={currentAsset.library_media_path} type={currentAsset.media_type} visible={visible} onClose={()=>setVisible(false)} AssetArray={currentDisplayCluster} isBottomList={true}/>}
    </View>
  )
}
export default ImageLabel