import { TouchableOpacity, View,Image } from "react-native"
import React, { useRef } from "react"
import {useState,useEffect, useCallback} from'react'
import CoordinatesPointsLayout from '../components/points';
import ImageLabel from '../components/image_label';
import TripDisplayObserver from "../functions/trip_display_observer";
import MarkerManager from './marker_manager'
const image_icon = require('../../../../assets/image/gallery_icon.png')

export const Marker =({zoomLevel, isDisplayImageMaker, isCoordsMarkerDisplay})=>{
    const[currentDisplayTripData,setCurrentDisplayTripData]= useState(TripDisplayObserver.getTripNeedRender())
    const currentTripId = useRef()
    useEffect(()=>{
            console.log('marker')
            const update_current_display_trip={
                update(new_data){
                    console.log('update',new_data)
                    setCurrentDisplayTripData(new_data)
                }
            }
            TripDisplayObserver.attach(update_current_display_trip,TripDisplayObserver.EVENTS)            
            return()=>{
                TripDisplayObserver.detach(update_current_display_trip,TripDisplayObserver.EVENTS)            
            }
            
        },[])
    // const RenderCoordiantes = (()=>{
    //     return()

    // },[currentDisplayTripId])

    return (
        <View>
           

            {currentDisplayTripData && isCoordsMarkerDisplay&&<CoordinatesPointsLayout trip_id={currentDisplayTripData.trip_id ? currentDisplayTripData.trip_id : currentDisplayTripData.id}></CoordinatesPointsLayout>}
            {currentDisplayTripData && isDisplayImageMaker&& <ImageLabel trip_id={currentDisplayTripData.trip_id ? currentDisplayTripData.trip_id : currentDisplayTripData.id} zoomLevel={zoomLevel}></ImageLabel>}
         {/* <Image source ={{uri:image_icon}}>
            </Image> */}
        </View>
    )
}
