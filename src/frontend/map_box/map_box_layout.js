import React, { use, useEffect, useMemo, useState,useRef } from 'react'
import MapboxGL from '@rnmapbox/maps'
import {View} from 'react-native'
import { HelpBarMap } from './help_bar_map';
import CurrentTripDataService from '../../backend/storage/current_trip'
import CoordinatesPointsLayout from './components/points';
import { DATA_KEYS } from '../../backend/storage/keys/storage_keys';
import AppFlow from '../../app-core/flow/app_flow';
import ImageLabel from './components/image_label';

MapboxGL.setAccessToken(process.env.EXPO_MAPBOX_PUBLIC_TOKEN)
export const MapBoxLayout =({})=>{
    const mapRef = useRef(null);
    const [userLock,setUserLock]=useState(false)
    const [isFollowingUser, setIsFollowingUser] = useState(true)
    const[isOnATrip,setIsOnATrip]= useState(null)
    const sendMapRenderSignal= async()=>{
        await AppFlow.onRenderMapSuccess()
    }
    useEffect(()=>{
        const fetchIsOnATrip =async()=>{
            const trip_status = CurrentTripDataService.getCurrentTripStatus()
            setIsOnATrip(trip_status)
    }

        const updateTripStatus={
            update(newState){
                setIsOnATrip(newState)
            }
        }
        fetchIsOnATrip()
        fetch()
        
        CurrentTripDataService.attach(updateTripStatus,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
        return()=>{
            CurrentTripDataService.detach(updateTripStatus,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
        }
        
    })

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
            
            {isOnATrip && <CoordinatesPointsLayout trip_id={CurrentTripDataService.getCurrentTripId()}></CoordinatesPointsLayout>}
            {isOnATrip && <ImageLabel trip_id={CurrentTripDataService.getCurrentTripId()}></ImageLabel>}
            
            </MapboxGL.MapView>
            
            <HelpBarMap isFollowingUser={isFollowingUser} setIsFollowingUser={setIsFollowingUser}></HelpBarMap>
            
        </View>
    )
}