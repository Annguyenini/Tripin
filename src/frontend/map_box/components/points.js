import  MapboxGL from '@rnmapbox/maps'
import { useEffect, useState } from 'react';
import TripDataStorage from '../../../backend/trip_coordinates/current_trip_coordinate_service'
import CoordinatesSubject from '../../../backend/trip_coordinates/trip_coordiantes_subject'
const CoordinatesPointsLayout =({trip_id})=> {
  const [coordinates,setCoordinates] = useState([])
  const modifyIntoGeoJson =(object)=>{
    const modified = [...object.map((obj)=>{
      return [obj.longitude,obj.latitude]
    })]
    // console.log(modified)
    setCoordinates(modified)
  }
  useEffect (()=>{
    const setUpWatchList =async()=>{
      const newCoords = await TripDataStorage.getAllCoordinatesFromTripId(trip_id)
      CoordinatesSubject.initCoordinatesArray(newCoords)
      modifyIntoGeoJson(newCoords)
    }
    const updateWatchList ={
      update(newCoords){
        modifyIntoGeoJson(newCoords)
      }
    }
    setUpWatchList()
    CoordinatesSubject.attach(updateWatchList)
    return()=>CoordinatesSubject.detach(updateWatchList)
  },[trip_id])
    if(!coordinates) return
    const geoJson ={
         type: 'FeatureCollection',
    features: [
      // POINTS
      ...coordinates.map((coors) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coors,
        },
      })),

      // LINE
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      },


    ],
  };

    return(
        <MapboxGL.ShapeSource id ='route' shape={geoJson}>
          <MapboxGL.LineLayer
                id="line-layer"
                style={{
                  lineWidth: 3,
                  lineColor: 'blue',
                }}
              />

            <MapboxGL.CircleLayer
            id="points-layer"
            style={{
          circleRadius: 6,
          circleColor: 'red',
        }}
      />
        </MapboxGL.ShapeSource>
    )
}
export default CoordinatesPointsLayout