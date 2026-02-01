import { useEffect,useMemo,useState } from 'react';
import { DATA_KEYS } from '../../backend/storage/keys/storage_keys';
import CurrentDisplayCoordinateObserver from './functions/current_display_coordinates_observer';
import * as CoordinateCal from '../../backend/coordinates/coordinates_cal'
import TripDisplayObserver from './functions/trip_display_observer';
import CurrentTripDataService from '../../backend/storage/current_trip'
const mapData = ()=>{
    const [currentTripDisplayData,setCurrentTripDisplayData]= useState(TripDisplayObserver.getTripNeedRender())
    const [tripSelectedCoordsArray,setTripSelectedCoordsArray] = useState([])
    if (!currentTripDisplayData) return {centerCoords:undefined}
    // useEffect(()=>{
    //     const updateTripData={
    //         update(newTripData){
    //             setCurrentTripDisplayData(newTripData)
    //         }
    //     }

    //     TripDisplayObserver.attach(updateTripData,TripDisplayObserver.EVENTS)
    //     return()=>{
    //         TripDisplayObserver.detach(updateTripData,TripDisplayObserver.EVENTS)
    //     }
        
    // },[])
    // useEffect(()=>{
    //     // setTripSelectedCoordsArray(CurrentDisplayCoordinateObserver.CoordsArray[currentTripDisplayData.trip_id])
    //     const updateTripSelectedCoordsArray={
    //         update(newArray){
    //             console.log('update',1121)
    //             setTripSelectedCoordsArray(newArray)
    //         }
    //     }
    //     CurrentDisplayCoordinateObserver.attach(updateTripSelectedCoordsArray,CurrentDisplayCoordinateObserver.GENERATE_KEY(currentTripDisplayData.trip_id))
    //     return()=>{
    //         CurrentDisplayCoordinateObserver.detach(updateTripSelectedCoordsArray,CurrentDisplayCoordinateObserver.GENERATE_KEY(currentTripDisplayData.trip_id))
    //     }
    // },[currentTripDisplayData])
    // // if(currentTripDisplayData && currentTripDisplayData.trip_id === CurrentTripDataService.getCurrentTripId()){
    // //     return{centerCoords:undefined}
    // // }
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