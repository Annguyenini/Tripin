import { useEffect, useMemo, useState } from "react"
import {View,Image,Text,TouchableOpacity} from 'react-native'
import {currentTripDisplayBoxStyle} from '../../../styles/function/trip_display_box_style'
import CurrentTripDataService from '../../../backend/storage/current_trip'
import CurrentDisplayCoordinateObserver from "../functions/current_display_coordinates_observer"
import TripDisplayObserver from '../functions/trip_display_observer'
import * as CoordinatesCal from '../../../backend/coordinates/coordinates_cal'
const default_image = require('../../../../assets/icon.png')
export const DisplayTripBox =({isFullDisplay,onHide})=>{
    const[tripData,setTripData] = useState(TripDisplayObserver.getTripNeedRender())
    const[tripDuration,setTripDuration] = useState({hours:0,minutes:0,seconds:0})
    const[coordinates,setCoordinates] =useState([])
    const[distance,setDistance] =useState({km:0,m:0})
    const currentTripStatus = CurrentTripDataService.getCurrentTripStatus()
    useEffect(()=>{
        let trip_coordinates = []
        if (tripData){
            trip_coordinates =CurrentDisplayCoordinateObserver.CoordsArray[tripData.trip_id] ?CurrentDisplayCoordinateObserver.CoordsArray[tripData.trip_id] :[]
        }    
        setCoordinates(trip_coordinates)
    },[])
    useEffect(()=>{
        const update_tripdata={
            update(newTripData){
                setTripData(newTripData)
            }
        }
        const update_trip_coords_array ={
            update(newArray){
                setCoordinates(newArray ? newArray : [])
            }
        }
        CurrentDisplayCoordinateObserver.attach(update_trip_coords_array,CurrentDisplayCoordinateObserver.GENERATE_KEY(tripData.trip_id))
        TripDisplayObserver.attach(update_tripdata,TripDisplayObserver.EVENTS)


        return () => {
            CurrentDisplayCoordinateObserver.detach(update_trip_coords_array,CurrentDisplayCoordinateObserver.GENERATE_KEY(tripData.trip_id))
            TripDisplayObserver.detach(update_tripdata,TripDisplayObserver.EVENTS)
            
        }
    },[])
    useEffect(()=>{
        if(!tripData) return 
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

    },[tripData])

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
    },[coordinates,tripData])
    if(!coordinates) return null
    if(!tripData) return null

    const onClose=()=>{
        TripDisplayObserver.deleteTripSelected()
    }

    return (
        <View style={currentTripDisplayBoxStyle.wrapper}>
  {isFullDisplay && (
    <View style={currentTripDisplayBoxStyle.card}>
      {/* Top section: Arrow (left), Trip Name (center), Close (right) */}
      <View style={currentTripDisplayBoxStyle.topSection}>
        <TouchableOpacity style={currentTripDisplayBoxStyle.arrowButton} onPress={onHide}>
          <Text style={currentTripDisplayBoxStyle.arrowText}>→</Text>
        </TouchableOpacity>
        
        <Text style={currentTripDisplayBoxStyle.tripName}>{tripData.trip_name}</Text>
        
        <TouchableOpacity onPress={onClose} style={currentTripDisplayBoxStyle.closeButton}>
          <Text style={currentTripDisplayBoxStyle.closeText}>×</Text>
        </TouchableOpacity>
      </View>
      
      {/* Bottom section: Image (left), Info (right) */}
      <View style={currentTripDisplayBoxStyle.bottomSection}>
        {/* Image on left center */}
        <View style={currentTripDisplayBoxStyle.imageContainer}>
          <Image 
            style={currentTripDisplayBoxStyle.image}
            source={tripData.image ? {uri: tripData.image} : default_image}
          />
        </View>
        
        {/* Distance and Duration on right */}
        <View style={currentTripDisplayBoxStyle.infoContainer}>
          {/* Distance on top */}
          <View style={currentTripDisplayBoxStyle.infoRow}>
            <Text style={currentTripDisplayBoxStyle.infoLabel}>Total Distance</Text>
            <Text style={currentTripDisplayBoxStyle.infoValue}>
              {distance.km !== 0 ? distance.km + ' km ' : ''}{distance.m !== 0 ? distance.m + ' m' : ''}
            </Text>
          </View>
          
          {/* Duration on bottom */}
          <View style={currentTripDisplayBoxStyle.infoRow}>
            <Text style={currentTripDisplayBoxStyle.infoLabel}>Total Duration</Text>
            <Text style={currentTripDisplayBoxStyle.infoValue}>
              {tripDuration.hours !== 0 ? tripDuration.hours + 'h ' : ''}
              {tripDuration.minutes !== 0 ? tripDuration.minutes + 'm ' : ''}
              {tripDuration.seconds !== 0 ? tripDuration.seconds + 's' : ''}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )}
  
  {!isFullDisplay && (
    <View style={currentTripDisplayBoxStyle.minimizecard}>
      <TouchableOpacity style={currentTripDisplayBoxStyle.minimizearrowButton} onPress={onHide}>
        <Text style={currentTripDisplayBoxStyle.arrowText}>←</Text>
      </TouchableOpacity>
    </View>
  )}
</View>
    )
}
