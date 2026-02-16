import  MapboxGL from '@rnmapbox/maps'
import { useEffect, useMemo, useState } from 'react';
import TripDataStorage from '../../../backend/trip_coordinates/current_trip_coordinate_service'
import CurrentDisplayCoordinateObserver from '../functions/current_display_coordinates_observer';
import { computeCluster } from '../../../backend/addition_functions/compute_cluster';
import eventBus from '../../../backend/services/UI_event_bus';
import TripContentHandler from '../../../app-core/flow/trip_contents_handler';
const CoordinatesPointsLayout =({trip_id})=> {
  const [assestsObjectsArray,setAssestsObjectsArray]= useState([])
  const [radiusForGrouping,setRadiusForGrouping]=useState(0)
  // const [coordinatesObject,setCoordinatesObject]=useState({})
 
  useEffect (()=>{
    const setUpWatchList =async()=>{
      const newCoords = await TripContentHandler.getTripCoordinatesHandler(trip_id)
      console.log('new',newCoords)
      CurrentDisplayCoordinateObserver.setDefaultCoordsArray(trip_id,newCoords)
      setAssestsObjectsArray(newCoords? newCoords:[])

  }
    const updateWatchList ={
      update(newCoords){
        console.log('new coords ',newCoords)
        setAssestsObjectsArray(newCoords? newCoords :[])
      }
    }
    const radiusListener=(val)=>{
      setRadiusForGrouping(val)
    }
    setUpWatchList()
    eventBus.on('RadiusChange',radiusListener)
    CurrentDisplayCoordinateObserver.attach(updateWatchList,CurrentDisplayCoordinateObserver.GENERATE_KEY(trip_id))
    return()=>{
      CurrentDisplayCoordinateObserver.detach(updateWatchList,CurrentDisplayCoordinateObserver.GENERATE_KEY(trip_id))
      eventBus.off('RadiusChange',radiusListener)

    }
  },[trip_id])
  

  const coordinatesMap = useMemo(()=>{
    return new Map([
      [0,[...assestsObjectsArray.map((obj)=>{
      return[obj.longitude,obj.latitude]})] ],
      [20, [...computeCluster(assestsObjectsArray,20,true).map((obj)=>{
      return [obj.center.lng,obj.center.lat]
      })]],
      [40, [...computeCluster(assestsObjectsArray,40,true).map((obj)=>{
      return [obj.center.lng,obj.center.lat]
      })]],
      [60, [...computeCluster(assestsObjectsArray,60,true).map((obj)=>{
      return [obj.center.lng,obj.center.lat]
      })]],
      [80, [...computeCluster(assestsObjectsArray,80,true).map((obj)=>{
      return [obj.center.lng,obj.center.lat]
      })]],
      [100, [...computeCluster(assestsObjectsArray,100,true).map((obj)=>{
      return [obj.center.lng,obj.center.lat]
      })]]
    ])
  },[assestsObjectsArray])    

  const currentCluster = useMemo(()=>{
    return (coordinatesMap.get(radiusForGrouping ))
  },[assestsObjectsArray,radiusForGrouping])
  console.log(currentCluster)

    const geoJson ={
         type: 'FeatureCollection',
    features: [
      // POINTS
      ...currentCluster.map((coors) => ({
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
          coordinates: currentCluster,
        },
      },


    ],
  };
  if (currentCluster.length === 0) return null;
    return(
        <MapboxGL.ShapeSource id ='route' shape={geoJson}>
          <MapboxGL.LineLayer
                id="line-layer"
                style={{
                  lineWidth: 1,
                  lineColor: 'blue',
                }}
              />

            <MapboxGL.CircleLayer
            id="points-layer"
            style={{
          circleRadius: 4,
          circleColor: 'red',
        }}
      />
        </MapboxGL.ShapeSource>
    )
}
export default CoordinatesPointsLayout