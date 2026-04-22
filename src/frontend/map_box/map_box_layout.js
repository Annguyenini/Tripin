import React, { use, useEffect, useMemo, useState, useRef, useCallback } from 'react'
import MapboxGL from '@rnmapbox/maps'
import { View } from 'react-native'
import { HelpBarMap } from './help_bar_map';
import AppFlow from '../../app-core/flow/app_flow';
import ImageLabel from './components/image_label';
import mapData from './map_data';
import { Marker } from './components/markers'
import MarkerManager from './components/marker_manager';
import TrackingModeManager from './components/tracking_mode_manager';
MapboxGL.setAccessToken(process.env.EXPO_MAPBOX_PUBLIC_TOKEN)
const mapStyles = {
    'street': "mapbox://styles/mapbox/streets-v12",
    'satellite': 'mapbox://styles/mapbox/satellite-streets-v12',
    'dark': 'mapbox://styles/mapbox/dark-v11'
}
export const MapBoxLayout = ({ }) => {
    const [isImageMarkerDisplay, setIsImageMarkerDisplay] = useState(true)
    const [isCoordsMarkerDisplay, setIsCoordsMarkerDisplay] = useState(true)
    const [mapStyle, setMapStyle] = useState('street')
    const [mapRendered, setMapRendered] = useState(false)
    const zoomRef = useRef(0)
    const renderRef = useRef(false)
    const [userLock, setUserLock] = useState(false)
    const [isFollowingUser, setIsFollowingUser] = useState(true)
    // const isFollowingUser = useRef(true)
    const [zoomLevel, setZoomLevel] = useState(13)
    const mapRef = useRef(null);
    const cameraMapRef = useRef(null)
    const sendMapRenderSignal = async () => {
        if (renderRef.current) return
        renderRef.current = true
        setMapRendered(true)
    }
    const allowedZooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22];

    const zoomHandler = (e) => {
        const zoom = Math.floor(e?.properties?.zoom);

        if (zoom === zoomRef.current) {
            return
        }
        if (allowedZooms.includes(zoom)) {
            // console.log(zoom)
            setZoomLevel(zoom);
        }
        zoomRef.current = zoom
    };
    // const setIsFollowingUser=(state)=>{
    //     isFollowingUser.current = state
    //     console.log(isFollowingUser.current)

    // }
    const { centerCoords } = mapData()
    useEffect(() => {
        const flyTo = async () => {
            if (centerCoords) {
                setIsFollowingUser(false)
                await cameraMapRef?.current.setCamera({
                    centerCoordinate: centerCoords,
                    zoomLevel: 15,
                    animationDuration: 1000,
                })
            }
            else if (!centerCoords) {
                setIsFollowingUser(true)
            }
        }
        flyTo()
    }, [centerCoords])

    return (
        <View style={{ flex: 1 }}>

            <MapboxGL.MapView style={{ flex: 1 }}
                ref={mapRef}
                projection="globe"
                scrollEnabled={true}
                compassEnabled={true}
                scaleBarEnabled={true}
                scaleBarPosition={{ top: 1, right: 8 }}
                heading={45}
                pitch={45}
                onDidFinishLoadingMap={async () => {
                    // if(!userLock){
                    //     setUserLock(true)
                    // }
                    await sendMapRenderSignal()


                }}
                onCameraChanged={(e) => {
                    zoomHandler(e)
                }}
                onTouchStart={() => {
                    setIsFollowingUser(false)
                }}
                styleURL={`${mapStyles[mapStyle]}`}
            >

                <MapboxGL.Camera
                    ref={cameraMapRef}
                    followUserLocation={isFollowingUser}
                    followUserMode="normal"
                    followZoomLevel={13}
                // centerCoordinate={centerCoords ?? undefined} // lat 20 just looks nice
                // zoomLevel={centerCoords ? 16 : 13}
                // followZoomLevel={zoomLevel}
                // animationMode="easeTo"
                // animationDuration={1}
                />
                <MapboxGL.UserLocation minDisplacement={2} />

                {/* { (isDisplay||tripSelected)&&<CoordinatesPointsLayout trip_id={currentDisplayTripId}></CoordinatesPointsLayout>}
            { (isDisplay||tripSelected)&&<ImageLabel trip_id={currentDisplayTripId} zoomLevel={zoomLevel}></ImageLabel>} */}
                {mapRendered && <Marker zoomLevel={zoomLevel} isDisplayImageMaker={isImageMarkerDisplay} isCoordsMarkerDisplay={isCoordsMarkerDisplay}></Marker>}

            </MapboxGL.MapView>

            {mapRendered
                &&
                <>
                    {/* <MarkerManager imageMarkerDisplay={isImageMarkerDisplay} setIsImageMarkerDisplay={setIsImageMarkerDisplay} isCoordsMarkerDisplay ={isCoordsMarkerDisplay} setIsCoordsMarkerDisplay={setIsCoordsMarkerDisplay}></MarkerManager> */}
                    {/* <TrackingModeManager></TrackingModeManager> */}
                    <HelpBarMap setMapStyle={setMapStyle} isFollowingUser={isFollowingUser} setIsFollowingUser={() => setIsFollowingUser(true)}></HelpBarMap>
                </>
            }

        </View>
    )
}