import React, { use, useEffect, useMemo, useState,useRef } from 'react'
import MapboxGL from '@rnmapbox/maps'
import {View} from 'react-native'
import { HelpBarMap } from './help_bar_map';
import CoordinatesPointsLayout from './components/points';
import AppFlow from '../../app-core/flow/app_flow';
import ImageLabel from './components/image_label';
import mapData from './map_data';
import {Marker} from './components/makers'
MapboxGL.setAccessToken(process.env.EXPO_MAPBOX_PUBLIC_TOKEN)
export const MapBoxLayout =({})=>{
    console.log( 'render')
    const zoomRef = useRef(0)
    const renderRef = useRef(false)
    const mapRef = useRef(null);
    const [userLock,setUserLock]=useState(false)
    const [isFollowingUser, setIsFollowingUser] = useState(true)
    // const isFollowingUser = useRef(true)
    const [zoomLevel,setZoomLevel] = useState(13)
    const {centerCoords} = mapData()
    const sendMapRenderSignal= async()=>{
        if(renderRef.current)return
        renderRef.current = true
        await AppFlow.onRenderMapSuccess()
       
    }

    const allowedZooms = [13, 15, 20, 21, 22];

    const zoomHandler = (e) => {
        const zoom = Math.floor(e.properties.zoom);
        if(zoom === zoomRef.current) {
            return
        }
        if (allowedZooms.includes(zoom)) {
            setZoomLevel(zoom);
        }
        zoomRef.current=zoom
    };
    // const setIsFollowingUser=(state)=>{
    //     isFollowingUser.current = state
    //     console.log(isFollowingUser.current)

    // }
    const moveTo =()=>{
        mapRef.current?.flyTo(centerCoords, 1000); // 1000ms duration
    }
    // console.log(isDisplay,currentDisplayTripId,centerCoords)
    return(
        <View style={{flex:1}}> 
            
            <MapboxGL.MapView style ={{flex:1}}
                ref={mapRef}
                projection="globe"
                scrollEnabled = {true}
                compassEnabled ={true}
                scaleBarEnabled ={true}
                scaleBarPosition ={{top:1, right:8}}
                    heading={45}
                    pitch={45}
                onDidFinishLoadingMap={async ()=>{
                    // if(!userLock){
                    //     setUserLock(true)
                    // }
                    await sendMapRenderSignal()

                    
                }}

                onMapIdle={()=>{
                    setIsFollowingUser(false)
                }}
                onCameraChanged={zoomHandler}
            
            >   
            
            <MapboxGL.Camera 
            followUserLocation={isFollowingUser}  
            followUserMode="normal"
            followZoomLevel={13}
            centerCoordinate={centerCoords? centerCoords :undefined} // lat 20 just looks nice
            zoomLevel={centerCoords? 16:13}
            // followZoomLevel={zoomLevel}
            // animationMode="easeTo"
            // animationDuration={1}
            />
            <MapboxGL.UserLocation minDisplacement={2}/>
            
            {/* { (isDisplay||tripSelected)&&<CoordinatesPointsLayout trip_id={currentDisplayTripId}></CoordinatesPointsLayout>}
            { (isDisplay||tripSelected)&&<ImageLabel trip_id={currentDisplayTripId} zoomLevel={zoomLevel}></ImageLabel>} */}
            <Marker zoomLevel={zoomLevel}></Marker>
            
            </MapboxGL.MapView>
            
            <HelpBarMap isFollowingUser={isFollowingUser} setIsFollowingUser={()=>setIsFollowingUser(true)}></HelpBarMap>
            
        </View>
    )
}