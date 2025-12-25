import React, { use, useEffect, useMemo, useState,useRef } from 'react'
import MapboxGL from '@rnmapbox/maps'
import {View} from 'react-native'
import * as Location from "expo-location";
import { HelpBarMap } from './help_bar_map';
import { useFormState } from 'react-dom';
import TripDataService from '../../backend/storage/trip';
MapboxGL.setAccessToken(process.env.EXPO_MAPBOX_PUBLIC_TOKEN)
export const MapBoxLayout =({})=>{
    const mapRef = useRef(null);
    const [userLock,setUserLock]=useState(false)
    // const [zoomLevel, setZoomLevel]= useState(14);
    const [isFollowingUser, setIsFollowingUser] = useState(true)
    const fetchIsOnATrip =async()=>{
        const trip_status = await TripDataService.getTripStatus()
        if (trip_status ==='true'){
        TripDataService.setTripStatus('true')
        }
        else{
            
        TripDataService.setTripStatus('false')
        }
    }
    
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
                await fetchIsOnATrip()
                
            }}
            onMapIdle={()=>{
                setIsFollowingUser(false)
            }}

            >   
            
            <MapboxGL.Camera 
            followUserLocation={isFollowingUser}   // <-- key part
            followUserMode="normal"
            // followZoomLevel={userLock?zoomLevel:undefined}
            // centerCoordinate={[20, 20]} // lat 20 just looks nice
            // followZoomLevel={zoomLevel}
            // animationMode="easeTo"
            // animationDuration={1}
            />
            <MapboxGL.UserLocation minDisplacement={2}/>
            </MapboxGL.MapView>
            
            <HelpBarMap isFollowingUser={isFollowingUser} setIsFollowingUser={setIsFollowingUser}></HelpBarMap>
            
        </View>
    )
}