import CurrentTripDataService from '../../backend/storage/current_trip'
import TripSelectedSubject from './functions/trip_selected_subject';
import { useEffect,useMemo,useState } from 'react';
import { DATA_KEYS } from '../../backend/storage/keys/storage_keys';
import CoordinatesSubject from '../../backend/trip_coordinates/trip_coordiantes_subject'
import * as CoordinateCal from '../../backend/coordinates/coordinates_cal'
import TripDisplayObserver from './functions/trip_display_observer';
const mapData = ()=>{
    const [currentTripDisplayData,setCurrentTripDisplayData]= useState(TripDisplayObserver.getTripNeedRender())
    const [tripSelectedCoordsArray,setTripSelectedCoordsArray] = useState([])
    useEffect(()=>{
        const updateTripData={
            update(newTripData){
                setCurrentTripDisplayData(newTripData)
            }
        }

        TripDisplayObserver.attach(updateTripData,TripDisplayObserver.EVENTS)
        return()=>{
            TripDisplayObserver.detach(updateTripData,TripDisplayObserver.EVENTS)
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
    },[currentTripDisplayData])

    const centerCoords = useMemo(()=>{
        if(!tripSelectedCoordsArray[0]) return null
        const {latitude,longitude} = tripSelectedCoordsArray[0]
        if(!latitude||!longitude) return null
        const {latitude:new_lat,longitude:new_lon} = CoordinateCal.CoorFromDistance(latitude,longitude,130,270) 
        return  [new_lon,new_lat]
    },[currentTripDisplayData,tripSelectedCoordsArray])
    return ({centerCoords})  
}
export default mapData