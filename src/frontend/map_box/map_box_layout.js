import React, { use, useEffect, useMemo, useState,useRef } from 'react'
import MapboxGL from '@rnmapbox/maps'
import {View} from 'react-native'
import { HelpBarMap } from './help_bar_map';
import CurrentTripDataService from '../../backend/storage/current_trip'
import CoordinatesPointsLayout from './components/points';
import { DATA_KEYS } from '../../backend/storage/keys/storage_keys';
import AppFlow from '../../app-core/flow/app_flow';
import ImageLabel from './components/image_label';
import MarkerSubject from "./functions/marker_subject"

MapboxGL.setAccessToken(process.env.EXPO_MAPBOX_PUBLIC_TOKEN)
export const MapBoxLayout =({})=>{
    const mapRef = useRef(null);
    const [userLock,setUserLock]=useState(false)
    const [isFollowingUser, setIsFollowingUser] = useState(true)
    const[isDisplay,setIsDisplay]= useState(null)
    const [zoomLevel,setZoomLevel] = useState(0)
    const [currentDisplayTripId,setcurrentDisplayTripId]= useState(null)
    const sendMapRenderSignal= async()=>{
        await AppFlow.onRenderMapSuccess()
    }
     useEffect(()=>{
        const fetchIsOnATrip =async()=>{
            const trip_status = CurrentTripDataService.getCurrentTripStatus()
            setIsDisplay(trip_status)
        }
        const fetchTripId = ()=>{
            const trip_id = CurrentTripDataService.getCurrentTripId()
            setcurrentDisplayTripId(trip_id)
            MarkerSubject.setTripId(trip_id)
        }
        const updateTripStatus={
            update(newState){
                setIsDisplay(newState)
            }
        }
        const updateTripId={
            update(newTripId){
                console.log('update')
                setcurrentDisplayTripId(newTripId)
            }
        }
        fetchTripId()
        fetchIsOnATrip()
        
        CurrentTripDataService.attach(updateTripStatus,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
        MarkerSubject.attach(updateTripId)
        return()=>{
            CurrentTripDataService.detach(updateTripStatus,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
            MarkerSubject.dettach(updateTripId)

        }
        
    },[])
    const allowedZooms = [13, 15, 20, 21, 22];

    const zoomHandler = (e) => {
    const zoom = Math.floor(e.properties.zoom);

    if (allowedZooms.includes(zoom)) {
        setZoomLevel(zoom);
    }
    };
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
                if(!userLock){
                    setUserLock(true)
                }
                await sendMapRenderSignal()

                
            }}
            onMapIdle={()=>{
                setIsFollowingUser(false)
            }}
            onCameraChanged={zoomHandler}
            >   
            
            <MapboxGL.Camera 
            followUserLocation={isFollowingUser}   // <-- key part
            followUserMode="normal"
            followZoomLevel={13}
            // centerCoordinate={[20, 20]} // lat 20 just looks nice
            // followZoomLevel={zoomLevel}
            // animationMode="easeTo"
            // animationDuration={1}
            />
            <MapboxGL.UserLocation minDisplacement={2}/>
            
            {isDisplay && <CoordinatesPointsLayout trip_id={currentDisplayTripId}></CoordinatesPointsLayout>}
            {isDisplay && <ImageLabel trip_id={currentDisplayTripId} zoomLevel={zoomLevel}></ImageLabel>}
            
            </MapboxGL.MapView>
            
            <HelpBarMap isFollowingUser={isFollowingUser} setIsFollowingUser={setIsFollowingUser}></HelpBarMap>
            
        </View>
    )
}