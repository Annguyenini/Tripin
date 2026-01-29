import { View } from "react-native"
import {useState,useEffect} from'react'
import { DATA_KEYS } from '../../../backend/storage/keys/storage_keys';
import CoordinatesPointsLayout from '../components/points';
import ImageLabel from '../components/image_label';
import CurrentTripDataService from '../../../backend/storage/current_trip'
import MarkerSubject from "../functions/marker_subject"
export const Marker =({})=>{
    const[isDisplay,setIsDisplay]= useState(null)
    const [currentDisplayTripId,setcurrentDisplayTripId]= useState(null)
    
    useEffect(()=>{
            const fetchIsOnATrip =async()=>{
                const trip_status = CurrentTripDataService.getCurrentTripStatus()
                setIsDisplay(trip_status)
            }
            const fetchTripId = ()=>{
                const trip_id = CurrentTripDataService.getCurrentTripId()
                setcurrentDisplayTripId(trip_id)
                MarkerSubject.setTripId(trip_id)
            }
            const updateTripStatus={
                update(newState){
                    setIsDisplay(newState)
                }
            }
            const updateTripId={
                update(newTripId){
                    console.log('update',newTripId)
                    setcurrentDisplayTripId(newTripId)
                }
            }
            fetchTripId()
            fetchIsOnATrip()
            
            CurrentTripDataService.attach(updateTripStatus,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
            MarkerSubject.attach(updateTripId,MarkerSubject.EVENTS.TRIP_ID)
            return()=>{
                CurrentTripDataService.detach(updateTripStatus,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
                MarkerSubject.dettach(updateTripId,MarkerSubject.EVENTS.TRIP_ID)

            }
            
        },[])
    return (
        <View>
            {isDisplay && <CoordinatesPointsLayout trip_id={currentDisplayTripId}></CoordinatesPointsLayout>}
            {isDisplay && <ImageLabel trip_id={currentDisplayTripId} zoomLevel={zoomLevel}></ImageLabel>}
        </View>
    )
}
