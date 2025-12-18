import React, { use, useEffect, useMemo, useState,useRef } from 'react'
import MapboxGL from '@rnmapbox/maps'
import {View} from 'react-native'
import * as Location from "expo-location";
import { HelpBarMap } from './help_bar_map';
import { useFormState } from 'react-dom';
MapboxGL.setAccessToken(process.env.MAPBOX_ACCESS_TOKEN)
export const MapBoxLayout =({isOnAtrip})=>{
    const mapRef = useRef(null);
    const [userLock,setUserLock]=useState(false)
    // const [zoomLevel, setZoomLevel]= useState(14);
    const [isFollowingUser, setIsFollowingUser] = useState(true)
    
    // const zoom = async(mode)=>{
    //     if (mode ==="in"){
    //         setZoomLevel(prev =>{
    //             return Math.min(20,prev+=1)
    //         })   
    //     }
    //     else if(mode ==="out"){
    //         setZoomLevel(prev =>{
    //             return Math.max(0,prev -=1)
    //         })
    //     }
    // }
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
            }}
            onMapIdle={()=>{
                setIsFollowingUser(false)
                // console.log(isFollowingUser)
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
            
            <HelpBarMap isFollowingUser={isFollowingUser} setIsFollowingUser={setIsFollowingUser} isOnAtrip={isOnAtrip} ></HelpBarMap>
            
        </View>
    )
}