import { useEffect, useState } from "react"
import {View,Image,Text,TouchableOpacity} from 'react-native'
import TripSelectedSubject from "../functions/trip_selected_subject"
import MarkerSubject from "../functions/marker_subject"
import {currentTripDisplayBoxStyle} from '../../../styles/function/trip_display_box_style'
import TripDataService from '../../../backend/storage/trips'
import TripHandler from "../../../app-core/flow/trip_handler"
import TripCoordinateDatabase from "../../../backend/database/trip_coordinate_database"
const default_image = require('../../../../assets/icon.png')
export const DisplayTripBox =({onHide})=>{
    const[tripid,setTripid] = useState(TripSelectedSubject.get(TripSelectedSubject.EVENTS.TRIP_ID))
    const[tripData,setTripData] = useState(TripSelectedSubject.get(TripSelectedSubject.EVENTS.TRIP_DATA))
    const[tripDuration,setTripDuration] = useState({hours:0,minutes:0,seconds:0})
    const[coordinates,setCoordinates] =useState(null)
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
        TripSelectedSubject.attach(update_tripid,TripSelectedSubject.EVENTS.TRIP_ID)
        TripSelectedSubject.attach(update_tripdata,TripSelectedSubject.EVENTS.TRIP_DATA)


        return () => {
            TripSelectedSubject.detach(update_tripid,TripSelectedSubject.EVENTS.TRIP_ID)
            TripSelectedSubject.detach(update_tripdata,TripSelectedSubject.EVENTS.TRIP_DATA)
            
        }
    },[])
    useEffect(()=>{
        const calDuration =()=>{
            console.log('called')
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

    useEffect(()=>{
    })
    const onClose=()=>{
        TripSelectedSubject.set(TripSelectedSubject.EVENTS.IS_SELECTED, false)
        TripSelectedSubject.set(TripSelectedSubject.EVENTS.TRIP_ID, null)
        MarkerSubject.setTripIdDefault()

    }
    if(!tripid) return null
        console.log(tripDuration)

    return (
        <View style={currentTripDisplayBoxStyle.wrapper}>
            <View style={currentTripDisplayBoxStyle.card}>
              {/* Background layer */}
              <View style={currentTripDisplayBoxStyle.background} />

              {/* Arrow button */}
              <TouchableOpacity style={currentTripDisplayBoxStyle.arrowButton} onPress={onHide}>
                <Text style={currentTripDisplayBoxStyle.arrowText}>→</Text>
              </TouchableOpacity>
                <TouchableOpacity onPress={onClose}>
                    <Text>X</Text>
                </TouchableOpacity>
                {/* Trip Name  */}
                <Text>{tripData.trip_name}</Text>
                {/* trip image */}
                <Image style ={currentTripDisplayBoxStyle.image}source={tripData.image ? {uri:tripData.image} :default_image}/>
                {/* trip duration */}
                <Text>Duration: {tripDuration.hours !== 0 ? tripDuration.hours +'h':''} 
                    {tripDuration.minutes !== 0 ? tripDuration.minutes +'m':''} {tripDuration.seconds !== 0? tripDuration.seconds +'s':''}</Text>
                
                {/* distance */}

            </View>
            </View>
    )
}
