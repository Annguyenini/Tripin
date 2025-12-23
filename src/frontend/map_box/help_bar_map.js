import {View,TouchableOpacity,Text,Image} from 'react-native'
import { useState,useEffect } from 'react'
import { helpBarMapStyle } from '../../styles/function/help_bar_map'
import { CurrentTripBar } from '../functions/current_trip_bar'
import { CurrentTripBox } from '../functions/current_trip_box'
import { TripDataService } from '../../backend/storage/trip.js'
// import {subject} from '../logics/observer.js';
import TripData from '../../app-core/local_data/local_trip_data.js'
const tripDataService = new TripDataService()
export const HelpBarMap =({isFollowingUser,setIsFollowingUser})=>{
    const navigation_icon = require('../../../assets/image/navigation_notoutline_icon.png')
    const navigation_outline_icon = require('../../../assets/image/navigation_outline_icon.png')
    const [currentTripName, setCurrentTripName] = useState(null)
    const [currentTripId, setCurrentTripId] =useState(null)
    const [isOnATrip,setIsOnATrip] = useState(null)
    useEffect(()=>{
        const update_state ={
            update(newState){
            setIsOnATrip(newState)
           }
    }
        tripDataService.attach(update_state,'status')

        const fetch_trip_data =()=>{
            setCurrentTripId(TripData.trip_id);
            setCurrentTripName(TripData.trip_name);
        }
        fetch_trip_data()
        return ()=>tripDataService.detach(update_state,'status')

    },[])
    return(
        <View style ={helpBarMapStyle.container}>
            {isOnATrip&&
            <>
            <CurrentTripBar ></CurrentTripBar> 
            <CurrentTripBox trip_name={currentTripName}></CurrentTripBox>

            </>
            }
            <TouchableOpacity style ={helpBarMapStyle.recenterButton} onPress={()=>{
                setIsFollowingUser(true)
            }}>
                
                <Image style ={helpBarMapStyle.icon} source={isFollowingUser? navigation_icon :navigation_outline_icon}/>
            </TouchableOpacity>

        </View>
    )
}