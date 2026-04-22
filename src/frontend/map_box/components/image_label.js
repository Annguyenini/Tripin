import MapboxGL from '@rnmapbox/maps'
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Modal } from 'react-native';
import { View, TouchableOpacity, Text } from 'react-native'
import { Image } from 'expo-image'
// import TripAlbumSubject from '../../../backend/trip_album/trip_album_subject';
import CurrentDisplayTripMediaObserver from '../functions/current_display_media_observer';
import Albumdb from '../../../backend/album/albumdb';
import MediaViewCard from '../../albums/viewer_card';
import { computeCluster } from '../../../backend/addition_functions/compute_cluster';
import { imageLabelStyle } from '../../../styles/function/image_label'
import TripContentHandler from '../../../app-core/flow/trip_contents_handler';
import { generateOrGetThumbnailFromMediaId } from '../../../backend/media/generate_thumbnail';
const videoPauseIcon = require('../../../../assets/image/video_pause_icon.png')
const image_icon = require('../../../../assets/image/gallery_icon.png')
const RenderImageLable = ({ clusters, mapKey, onClick }) => {
  console.log('render image', clusters)
  if (!clusters) return null
  return (
    clusters.map((cluster) => (
      <View key={cluster.cluster_id}>

        <MapboxGL.MarkerView
          key={`marker-${mapKey}`}
          id={`marker-${cluster.cluster_id}`}
          coordinate={[cluster.center.lng, cluster.center.lat]}
        >
          <TouchableOpacity onPress={() => onClick(cluster.members[0], cluster.cluster_id)}>
            <View style={{ width: 50, height: 50 }}>
              <Image
                cachePolicy="memory-disk"
                source={{ uri: cluster.members[0]?.media_type === 'video' ? cluster.members[0]?.thumb_nail : cluster.members[0]?.media_path }}
                style={{ width: 50, height: 50, borderRadius: 15 }}
                resizeMode="cover"
              />
              {cluster.members[0].media_type === 'video' &&
                <View style={imageLabelStyle.videoOverlayCard}>
                  <Text style={imageLabelStyle.playButton}>▶</Text>

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


const ImageLabel = ({ trip_id, zoomLevel, ready }) => {
  const [currentAssetsArray, setCurrentAssetsArray] = useState([])
  const [mapKey, setMapKey] = useState(0)
  const [visible, setVisible] = useState(false)
  const [currentAsset, setCurrentAsset] = useState(null)
  const [currentDisplayCluster, setCurrentDisplayCluster] = useState([])
  const [displayImage, setDisplayImage] = useState(null)
  const [isDisplayAllMedia, setIsDisplayAllMedia] = useState(false)
  // const clusters = new Map()

  useEffect(() => {
    const initArray = async () => {
      try {
        const respond = await TripContentHandler.requestTripMediasHandler(trip_id)
        let albumArray = [...respond.map((item) => {
          return { uri: item.media_path, ...item }
        })]
        albumArray = albumArray.filter((asset) => {
          return asset.event != 'remove'
        })
        CurrentDisplayTripMediaObserver.setDefaultArray(trip_id, albumArray)      // TripAlbumSubject.initAlbumArray(albumArray)
        // get thumbnail

        const finailizeArray = await Promise.all(
          albumArray.map(async (asset) => {
            console.log(asset)
            if (asset.media_type !== 'video') return { ...asset }
            const thumbnail = await generateOrGetThumbnailFromMediaId(asset.media_id, asset.media_path)
            return { ...asset, thumb_nail: thumbnail }
          })
        )
        console.log(finailizeArray)
        setCurrentAssetsArray([...finailizeArray])

      }
      catch (err) {
        console.error(err)
      }
      finally {
        ready()
      }
    }

    const updateAssetsArray = {
      async update(newArray) {
        // get thumbnail
        let finailizeArray = await Promise.all(
          newArray.map(async (asset) => {
            if (asset.media_type !== 'video') return { ...asset }
            const thumbnail = await generateOrGetThumbnailFromMediaId(asset.media_id, asset.media_path)
            return { ...asset, thumb_nail: thumbnail }
          })
        )
        finailizeArray = finailizeArray.filter((asset) => {
          return asset.event !== 'remove'
        })
        console.log(finailizeArray)
        setCurrentAssetsArray([...finailizeArray])
        setMapKey(prev => prev + 1)
        console.log(mapKey)
      }
    }
    CurrentDisplayTripMediaObserver.attach(updateAssetsArray, CurrentDisplayTripMediaObserver.GENERATE_KEY(trip_id))
    initArray()
    return () => CurrentDisplayTripMediaObserver.detach(updateAssetsArray, CurrentDisplayTripMediaObserver.GENERATE_KEY(trip_id))
  }, [trip_id])

  const clusters = useMemo(() => {
    return new Map([
      [1, computeCluster(currentAssetsArray, 80000)],
      [2, computeCluster(currentAssetsArray, 70000)],
      [3, computeCluster(currentAssetsArray, 60000)],
      [4, computeCluster(currentAssetsArray, 50000)],
      [5, computeCluster(currentAssetsArray, 40000)],
      [6, computeCluster(currentAssetsArray, 30000)],
      [7, computeCluster(currentAssetsArray, 8000)],
      [8, computeCluster(currentAssetsArray, 3000)],
      [9, computeCluster(currentAssetsArray, 1500)],
      [10, computeCluster(currentAssetsArray, 700)],
      [11, computeCluster(currentAssetsArray, 400)],
      [12, computeCluster(currentAssetsArray, 200)],
      [13, computeCluster(currentAssetsArray, 150)],
      [14, computeCluster(currentAssetsArray, 50)],
      [15, computeCluster(currentAssetsArray, 10)],
      [20, computeCluster(currentAssetsArray, 3)],
      [21, computeCluster(currentAssetsArray, 2)],
      [22, computeCluster(currentAssetsArray, 0.5)]
    ])
  }, [currentAssetsArray])

  const currentCluster = useMemo(() => {
    return (clusters.get(zoomLevel) ?? [])
  }, [zoomLevel, clusters])
  if (!currentAssetsArray || currentAssetsArray.length < 1) return null

  const labelDisplayHandler = (media, cluster_id) => {
    setCurrentAsset(media)
    console.log('assest', currentAsset)
    setVisible(true)
    setCurrentDisplayCluster(currentCluster[cluster_id].members)
  }

  return (
    <View key={mapKey}>
      <RenderImageLable clusters={currentCluster} mapKey={mapKey} onClick={labelDisplayHandler}></RenderImageLable>
      {visible && <MediaViewCard
        title={'test'}
        uri={currentAsset.library_media_path ? currentAsset.library_media_path : currentAsset.media_path}
        type={currentAsset.media_type}
        visible={visible}
        onClose={() => setVisible(false)}
        AssetArray={currentAssetsArray}
        isBottomList={true}
      // propButton={
      //   < TouchableOpacity style={imageLabelStyle.clusterMode} onPress={() => setIsDisplayAllMedia((prev) => !prev)}>
      //     <Text style={{ color: 'white' }} > {isDisplayAllMedia ? 'All Medias' : 'Save point'} </Text>
      //   </TouchableOpacity>}
      />}

    </View>
  )
}
export default ImageLabel