import { useEffect, useMemo, useState } from "react"
import {View,Image,Text,TouchableOpacity} from 'react-native'
import TripSelectedSubject from "../functions/trip_selected_subject"
import {currentTripDisplayBoxStyle} from '../../../styles/function/trip_display_box_style'
import TripDataService from '../../../backend/storage/trips'
import TripHandler from "../../../app-core/flow/trip_handler"
import TripCoordinateDatabase from "../../../backend/database/trip_coordinate_database"
import CurrentTripDataService from '../../../backend/storage/current_trip'
import TripCoordinateSubject from '../../../backend/trip_coordinates/trip_coordiantes_subject'
import TripDisplayObserver from '../functions/trip_display_observer'
import * as CoordinatesCal from '../../../backend/coordinates/coordinates_cal'
const default_image = require('../../../../assets/icon.png')
export const DisplayTripBox =({isFullDisplay,onHide})=>{
    const[tripid,setTripid] = useState(TripSelectedSubject.get(TripSelectedSubject.EVENTS.TRIP_ID))
    const[tripData,setTripData] = useState(TripSelectedSubject.get(TripSelectedSubject.EVENTS.TRIP_DATA))
    const[tripDuration,setTripDuration] = useState({hours:0,minutes:0,seconds:0})
    const[coordinates,setCoordinates] =useState(TripCoordinateSubject.watchArray)
    const[distance,setDistance] =useState({km:0,m:0})
    const currentTripStatus = CurrentTripDataService.getCurrentTripStatus()
    useEffect(()=>{
        const update_tripid={
            update(newTripId){
                setTripid(newTripId)
            }
        }
        const update_tripdata={
            update(newTripData){
                setTripData(newTripData)
            }
        }
        const update_trip_coords_array ={
            update(newArray){
                setCoordinates(newArray)
            }
        }
        TripCoordinateSubject.attach(update_trip_coords_array)
        TripSelectedSubject.attach(update_tripid,TripSelectedSubject.EVENTS.TRIP_ID)
        TripSelectedSubject.attach(update_tripdata,TripSelectedSubject.EVENTS.TRIP_DATA)


        return () => {
            TripCoordinateSubject.detach(update_trip_coords_array)
            TripSelectedSubject.detach(update_tripid,TripSelectedSubject.EVENTS.TRIP_ID)
            TripSelectedSubject.detach(update_tripdata,TripSelectedSubject.EVENTS.TRIP_DATA)
            
        }
    },[])
    useEffect(()=>{
        const calDuration =()=>{
            let dur 
            if(tripData.ended_time){
                dur = tripData.ended_time - tripData.created_time
            }
            else{
                dur = Date.now() - tripData.created_time
            }
            const hour = dur/3600000
            const hours_floor = Math.floor(hour)
            const minutes =(hour - hours_floor) * 60
            const minutes_floor = Math.floor((hour - hours_floor) * 60);
            const second = Math.ceil(minutes-minutes_floor)
            setTripDuration({hours:hours_floor,minutes:minutes_floor,seconds:second})
        }
        calDuration()

    },[tripid])
    const totalDistanceTravel = useMemo(()=>{
        // const filtedArray = [...coordinates.map((coord)=>{
        //     return[coord.latitude,coord.longitude]
        // })]
        const distance_m = CoordinatesCal.TotalDistanceTravel([...coordinates.map((coord)=>{
            return[coord.latitude,coord.longitude]
        })])
        const km = distance_m / 1000
        const km_floor = Math.floor(km)
        const m = Math.floor((km - km_floor)*1000)
        setDistance({km:km_floor,m:m})
    },[coordinates,tripid])
    console.log(distance)
    const onClose=()=>{
        TripSelectedSubject.set(TripSelectedSubject.EVENTS.IS_SELECTED, false)
        TripSelectedSubject.set(TripSelectedSubject.EVENTS.TRIP_ID, CurrentTripDataService.getCurrentTripId())
        // set the display trip back to the current if it is
        TripDisplayObserver.setTripState(false,CurrentTripDataService.getCurrentTripStatus(),
    CurrentTripDataService.getCurrentTripData(),CurrentTripDataService.getCurrentTripId())

    }
    if(!tripid) return null
        // console.log(tripDuration)

    return (
        <View style={currentTripDisplayBoxStyle.wrapper}>
            {isFullDisplay&&<View style={currentTripDisplayBoxStyle.card}>
              {/* Background layer */}
              <View style={currentTripDisplayBoxStyle.background} />

              {/* Arrow button */}
              <TouchableOpacity style={currentTripDisplayBoxStyle.arrowButton} onPress={onHide}>
                <Text style={currentTripDisplayBoxStyle.arrowText}>→</Text>
              </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={currentTripDisplayBoxStyle.closeButton}>
                    <Text>X</Text>
                </TouchableOpacity>
                {/* Trip Name  */}
                <Text style ={currentTripDisplayBoxStyle.tripName}>{tripData.trip_name}</Text>
                {/* trip image */}
                <Image style ={currentTripDisplayBoxStyle.image}source={tripData.image ? {uri:tripData.image} :default_image}/>
                {/* trip duration */}
                <Text style={currentTripDisplayBoxStyle.infoText}>Duration: {tripDuration.hours !== 0 ? tripDuration.hours +'h':''} 
                    {tripDuration.minutes !== 0 ? tripDuration.minutes +'m':''} {tripDuration.seconds !== 0? tripDuration.seconds +'s':''}</Text>
                {/* trip Distance */}
                {/* distance */}
                <Text style={currentTripDisplayBoxStyle.infoText}>Total Distance: {distance.km !== 0 ? distance.km +'km':''} {distance.m !==0 ? distance.m +'m': ''}</Text>
            </View>}
            {
                !isFullDisplay && 
                <View style={currentTripDisplayBoxStyle.minimizecard}>
                    <TouchableOpacity style={currentTripDisplayBoxStyle.minimizearrowButton} onPress={onHide}>
                    <Text style={currentTripDisplayBoxStyle.arrowText}>←</Text>
                </TouchableOpacity>
                </View>
            }
            </View>
    )
}
