import {View,TouchableOpacity,Text,Image} from 'react-native'
import { useState,useEffect } from 'react'
import { helpBarMapStyle } from '../../styles/function/help_bar_map'
import { CurrentTripBar } from './components/current_trip_bar.js'
import { CurrentTripBox } from './components/current_trip_box.js'
import CurrentTripDataService from '../../backend/storage/current_trip.js'
// import TripDataService from '../../backend/storage/trip.js'
// import {subject} from '../logics/observer.js';
// import TripData from '../../app-core/local_data/local_trip_data.js'
import { DATA_KEYS } from '../../backend/storage/keys/storage_keys.js'
import AppFlow from '../../app-core/flow/app_flow.js'
import {DisplayTripBox} from './components/current_display_trip_box'
import TripSelectedSubject from './functions/trip_selected_subject'
export const HelpBarMap =({isFollowingUser,setIsFollowingUser})=>{
    const navigation_icon = require('../../../assets/image/navigation_notoutline_icon.png')
    const navigation_outline_icon = require('../../../assets/image/navigation_outline_icon.png')
    const [currentTripName, setCurrentTripName] = useState(null)
    const [currentTripId, setCurrentTripId] =useState(null)
    const [isOnATrip,setIsOnATrip] = useState(null)
    const [tripSelectedDisplay,setTripSelectedDisplay] =useState(false)
    useEffect(()=>{
        const update_state ={
            update(newState){
            setIsOnATrip(newState)
           }
        
        }
        CurrentTripDataService.attach(update_state,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
        const fetch_trip_data =()=>{
            setCurrentTripId(CurrentTripDataService.getCurrentTripId());
            setCurrentTripName(CurrentTripDataService.getCurrentTripName());
        }
        const fetchTripStatus=async()=>{
            const status = CurrentTripDataService.getCurrentTripStatus() 
            setIsOnATrip(status)
        }
        const sendCurrentTripLayoutSignal = async()=>{
            // await AppFlow.onRenderCurrentLayoutsSuccess()
        }
        fetchTripStatus()
        fetch_trip_data()
        sendCurrentTripLayoutSignal()
        const update_trip_selected ={
            update(newState){
                console.log('update',newState)
                setTripSelectedDisplay(newState)
            }
        }
        TripSelectedSubject.attach(update_trip_selected,TripSelectedSubject.EVENTS.IS_SELECTED)

        return ()=>{
            CurrentTripDataService.detach(update_state,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
            TripSelectedSubject.detach(update_trip_selected,TripSelectedSubject.EVENTS.IS_SELECTED)
        }

    },[])
    return(
        <View style ={helpBarMapStyle.container}>
            {isOnATrip&&
            <>
            <CurrentTripBar ></CurrentTripBar> 
            <CurrentTripBox isMinimize={tripSelectedDisplay}></CurrentTripBox>

            </>
            }
            {
                tripSelectedDisplay&&
                <DisplayTripBox onHide={()=>setTripSelectedDisplay(false)}/>
            }
            <TouchableOpacity style ={helpBarMapStyle.recenterButton} onPress={()=>{
                setIsFollowingUser(true)
            }}>
                
                <Image style ={helpBarMapStyle.icon} source={isFollowingUser? navigation_icon :navigation_outline_icon}/>
            </TouchableOpacity>

        </View>
    )
}