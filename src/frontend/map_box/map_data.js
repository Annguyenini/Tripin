import CurrentTripDataService from '../../backend/storage/current_trip'
import MarkerSubject from "./functions/marker_subject"
import TripSelectedSubject from './functions/trip_selected_subject';
import { useEffect,useMemo,useState } from 'react';
import { DATA_KEYS } from '../../backend/storage/keys/storage_keys';
import CoordinatesSubject from '../../backend/trip_coordinates/trip_coordiantes_subject'
import * as CoordinateCal from '../../backend/coordinates/coordinates_cal'
const mapData = ()=>{
    const [currentDisplayTripId,setcurrentDisplayTripId]= useState(CurrentTripDataService.getCurrentTripId())
    const [tripSelectedCoordsArray,setTripSelectedCoordsArray] = useState([])
    useEffect(()=>{
        const updateTripId={
            update(newTripId){
                setcurrentDisplayTripId(newTripId)
            }
        }

        CurrentTripDataService.attach(updateTripId,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID)
        MarkerSubject.attach(updateTripId,MarkerSubject.EVENTS.TRIP_ID)
        return()=>{
            CurrentTripDataService.detach(updateTripId,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_ID)
            MarkerSubject.detach(updateTripId,MarkerSubject.EVENTS.TRIP_ID)

        }
        
    },[])
    useEffect(()=>{

        const updateTripSelectedCoordsArray={
            update(newArray){
                setTripSelectedCoordsArray(newArray)
            }
        }
        CoordinatesSubject.attach(updateTripSelectedCoordsArray)
        return()=>{
            CoordinatesSubject.detach(updateTripSelectedCoordsArray)
        }
    },[currentDisplayTripId])

    const centerCoords = useMemo(()=>{
        if(!tripSelectedCoordsArray[0]) return null
        const {latitude,longitude} = tripSelectedCoordsArray[0]
        if(!latitude||!longitude) return null
        const {latitude:new_lat,longitude:new_lon} = CoordinateCal.CoorFromDistance(latitude,longitude,130,270) 
        return  [new_lon,new_lat]
    },[currentDisplayTripId,tripSelectedCoordsArray])
    return ({centerCoords})  
}
export default mapData