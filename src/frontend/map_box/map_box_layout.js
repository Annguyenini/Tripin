import React, { use, useEffect, useMemo, useState,useRef } from 'react'
import MapboxGL from '@rnmapbox/maps'
import {View} from 'react-native'
import { HelpBarMap } from './help_bar_map';
import TripDataService from '../../backend/storage/trip';
import TripContentsDataService from '../../backend/storage/trip_contents'
import CoordinatesPointsLayout from './components/points';
import { DATA_KEYS } from '../../backend/storage/storage_keys';
import AppFlow from '../../app-core/flow/app_flow';
import ImageLabel from './components/image_label';

MapboxGL.setAccessToken(process.env.EXPO_MAPBOX_PUBLIC_TOKEN)
export const MapBoxLayout =({})=>{
    const mapRef = useRef(null);
    const [userLock,setUserLock]=useState(false)
    const [isFollowingUser, setIsFollowingUser] = useState(true)
    const[isOnATrip,setIsOnATrip]= useState(null)

    const[coorsList, setCoorList] = useState(null)
    const[mediaList,setMediaList] =useState(null)

    const sendMapRenderSignal= async()=>{
        await AppFlow.onRenderMapSuccess()
    }
    useEffect(()=>{
        const fetchIsOnATrip =async()=>{
            const trip_status = await TripDataService.getTripStatus()
            setIsOnATrip(trip_status ==='true'? true:false)
    }

        const fetch = async()=>{
            const coors = TripContentsDataService.item.get(DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_COORDINATES)
            const media = TripContentsDataService.item.get(DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_MEDIA)
            setCoorList(coors)
            setMediaList(media)
        }
        const updateTripStatus={
            update(newState){
                setIsOnATrip(newState)
            }
        }
        const updateCoorList={
            update(list){
                console.log('update',list)
                setCoorList(list)
            }
        }
        fetchIsOnATrip()
        fetch()
        
        TripContentsDataService.attach(updateCoorList,DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_COORDINATES)
        TripContentsDataService.attach(updateTripStatus,DATA_KEYS.TRIP.TRIP_STATUS)
        return()=>{
            TripContentsDataService.detach(updateTripStatus,DATA_KEYS.TRIP.TRIP_STATUS)
            TripContentsDataService.detach(updateCoorList,DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_COORDINATES)
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
            // followZoomLevel={userLock?zoomLevel:undefined}
            // centerCoordinate={[20, 20]} // lat 20 just looks nice
            // followZoomLevel={zoomLevel}
            // animationMode="easeTo"
            // animationDuration={1}
            />
            <MapboxGL.UserLocation minDisplacement={2}/>
            
            {isOnATrip&& coorsList && CoordinatesPointsLayout(coorsList)}
            {isOnATrip&& mediaList && ImageLabel(mediaList)}
            
            </MapboxGL.MapView>
            
            <HelpBarMap isFollowingUser={isFollowingUser} setIsFollowingUser={setIsFollowingUser}></HelpBarMap>
            
        </View>
    )
}