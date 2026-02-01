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
export const HelpBarMap =({isFollowingUser,setIsFollowingUser})=>{
    const navigation_icon = require('../../../assets/image/navigation_notoutline_icon.png')
    const navigation_outline_icon = require('../../../assets/image/navigation_outline_icon.png')
    const [isOnATrip,setIsOnATrip] = useState(null)
    const [isTripSelected,setIsTripSelected] =useState(false)
    const [isTripBoxDisplay,setIsTripBoxDisplay]=useState(false)
    let current_trip_id = CurrentTripDataService.getCurrentTripId()
    useEffect(()=>{
        const updateNewDisplayTrip ={
            update(newTripdata){
                // when there are no trip need to render
                if(!newTripdata){
                    setIsOnATrip(false)
                    setIsTripBoxDisplay(false)
                    setIsTripBoxDisplay(false)
                }
                //when the current trip need to render
                if(newTripdata.trip_id === current_trip_id){
                    setIsOnATrip(true)
                    setIsTripBoxDisplay(false)
                    setIsTripSelected(false)
                    return
                }
                setIsTripSelected(true)
                setIsTripBoxDisplay(true)
            }
        }
        const updateCurrentTripId={
            update(newTripid){
                current_trip_id = newTripid
            }
        }
        CurrentTripDataService.attach(updateCurrentTripId,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID)
        TripDisplayObserver.attach(updateNewDisplayTrip,TripDisplayObserver.EVENTS)

        return ()=>{
            TripDisplayObserver.detach(updateNewDisplayTrip,TripDisplayObserver.EVENTS)
            CurrentTripDataService.detach(updateCurrentTripId,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID)

        }

    },[])
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
            <TouchableOpacity style ={helpBarMapStyle.recenterButton} onPress={()=>{
                setIsFollowingUser(true)
                }}
            >
                <Image style ={helpBarMapStyle.icon} source={isFollowingUser? navigation_icon :navigation_outline_icon}/>
            </TouchableOpacity>
        </View>
    )
}