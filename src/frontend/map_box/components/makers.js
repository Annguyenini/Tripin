import { TouchableOpacity, View,Image } from "react-native"
import React from "react"
import {useState,useEffect, useCallback} from'react'
import { DATA_KEYS } from '../../../backend/storage/keys/storage_keys';
import CoordinatesPointsLayout from '../components/points';
import ImageLabel from '../components/image_label';
import CurrentTripDataService from '../../../backend/storage/current_trip'
import MarkerSubject from "../functions/marker_subject"
import TripSelectedSubject from "../functions/trip_selected_subject";
const image_icon = require('../../../../assets/image/gallery_icon.png')

export const Marker =({zoomLevel})=>{
    const[currentTripStatus,setCurrentTripStatus]= useState(null)
    const[isSelectedTrip,setIsSelectedTrip] =useState(false)
    const[currentDisplayTripId,setcurrentDisplayTripId]= useState(null)
    useEffect(()=>{
            console.log('marker')

            const fetchTripId = ()=>{
                const trip_id = CurrentTripDataService.getCurrentTripId()
                setcurrentDisplayTripId(trip_id)
                MarkerSubject.setTripId(trip_id)
            }
            const updateTripStatus={
                update(newState){
                    setCurrentTripStatus(newState)
                }
            }
            const updateTripId={
                update(newTripId){
                    console.log('update',newTripId)
                    setcurrentDisplayTripId(newTripId)
                }
            }
            fetchTripId()
            
            CurrentTripDataService.attach(updateTripStatus,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
            CurrentTripDataService.attach(updateTripId,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID)
            MarkerSubject.attach(updateTripId,MarkerSubject.EVENTS.TRIP_ID)
            return()=>{
                CurrentTripDataService.detach(updateTripStatus,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
                CurrentTripDataService.attach(updateTripId,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID)
                MarkerSubject.detach(updateTripId,MarkerSubject.EVENTS.TRIP_ID)
            }
            
        },[])
    useEffect(()=>{

        const updateTripSelected={
            update(newState){
                setIsSelectedTrip(newState)
            }
        }
       
        TripSelectedSubject.attach(updateTripSelected,TripSelectedSubject.EVENTS.IS_SELECTED)
        return()=>{
            TripSelectedSubject.detach(updateTripSelected,TripSelectedSubject.EVENTS.IS_SELECTED)
        }
    },[])
    // const RenderCoordiantes = (()=>{
    //     return()

    // },[currentDisplayTripId])

    return (
        <View style={{flex:1}}>
           

            {(isSelectedTrip || currentTripStatus) && <CoordinatesPointsLayout trip_id={currentDisplayTripId}></CoordinatesPointsLayout>}
            {(isSelectedTrip || currentTripStatus) && <ImageLabel trip_id={currentDisplayTripId} zoomLevel={zoomLevel}></ImageLabel>}
         <Image source ={{uri:image_icon}}>

            </Image>
        </View>
    )
}
