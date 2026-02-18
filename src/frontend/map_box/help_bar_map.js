import {View,TouchableOpacity,Text,Image} from 'react-native'
import { useState,useEffect } from 'react'
import { helpBarMapStyle } from '../../styles/function/help_bar_map'
import { CurrentTripBar } from './components/current_trip_bar.js'
import { CurrentTripBox } from './components/current_trip_box.js'
import CurrentTripDataService from '../../backend/storage/current_trip.js'
// import TripDataService from '../../backend/storage/trip.js'
// import {subject} from '../logics/observer.js';
// import TripData from '../../app-core/local_data/local_trip_data.js'
import {DisplayTripBox} from './components/current_display_trip_box'
import TripDisplayObserver from './functions/trip_display_observer'
import { DATA_KEYS } from '../../backend/storage/keys/storage_keys'
import MarkerManager from './components/marker_manager'
export const HelpBarMap =({isFollowingUser,setIsFollowingUser})=>{
    const navigation_icon = require('../../../assets/image/navigation_notoutline_icon.png')
    const navigation_outline_icon = require('../../../assets/image/navigation_outline_icon.png')
    const [isOnATrip,setIsOnATrip] = useState(CurrentTripDataService.getCurrentTripStatus())
    const [isTripSelected,setIsTripSelected] =useState(false)
    const [isTripBoxDisplay,setIsTripBoxDisplay]=useState(false)
    const [current_trip_id,setCurrentTripId]=useState(CurrentTripDataService.getCurrentTripId())
    const [currentDisplayTripData,setCurrentDisplayTripData]=useState(TripDisplayObserver.getTripNeedRender())
    useEffect(()=>{
        
        const updateNewDisplayTrip ={
            update(newTripdata){
                console.log('new 1')
                setCurrentDisplayTripData(newTripdata)

            }
        }
        const updateCurrentTripId={
            update(newTripid){
                                console.log('new 2')
                setCurrentTripId (newTripid)
            }
        }
        const updateCurrentTripStatus={
            update (newState){
                console.log('new state',newState)
                setIsOnATrip(newState)
            }
        }
        CurrentTripDataService.attach(updateCurrentTripId,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID)
        TripDisplayObserver.attach(updateNewDisplayTrip,TripDisplayObserver.EVENTS)
        CurrentTripDataService.attach(updateCurrentTripStatus,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
        return ()=>{
            TripDisplayObserver.detach(updateNewDisplayTrip,TripDisplayObserver.EVENTS)
            CurrentTripDataService.detach(updateCurrentTripId,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID)
            CurrentTripDataService.detach(updateCurrentTripStatus,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)

        }

    },[])
    useEffect(()=>{
                // when there are no trip need to render
        if(!currentDisplayTripData){
            setIsOnATrip(false)
            setIsTripBoxDisplay(false)
            setIsTripSelected(false)
            console.log('set 1')
        }
        //when the current trip need to render
        else if(currentDisplayTripData && currentDisplayTripData.trip_id === current_trip_id){
            setIsOnATrip(true)
            setIsTripBoxDisplay(false)
            setIsTripSelected(false)
            console.log('set 2')

        }
        else if(currentDisplayTripData && currentDisplayTripData.trip_id !== current_trip_id){
            setIsTripSelected(true)
            setIsTripBoxDisplay(true)
            console.log('set 3')

        }
    },[currentDisplayTripData,current_trip_id])
    console.log('current', isOnATrip)
    return(
        <View style ={helpBarMapStyle.container}>
            {isOnATrip&&
            <>
            <CurrentTripBar ></CurrentTripBar> 
            <CurrentTripBox isMinimize={isTripBoxDisplay}></CurrentTripBox>

            </>
            }
            {
                isTripSelected&&
                <DisplayTripBox onHide={()=>setIsTripBoxDisplay(prev => prev === true ? false:true)} isFullDisplay={isTripBoxDisplay}/>
            }
            <TouchableOpacity style ={helpBarMapStyle.recenterButton} onPress={()=>{
                setIsFollowingUser(true)
                }}
            >
                <Image style ={helpBarMapStyle.icon} source={isFollowingUser? navigation_icon :navigation_outline_icon}/>
            </TouchableOpacity>
        </View>
    )
}