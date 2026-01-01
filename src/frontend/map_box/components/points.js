import  MapboxGL from '@rnmapbox/maps'
import { useEffect, useState } from 'react';
import { DATA_KEYS } from '../../../backend/storage/storage_keys';
import TripContentsDataService from '../../../backend/storage/trip_contents'
const CoordinatesPointsLayout =(coordinates)=> {
  // const [coordinates,setCoordinates] = useState([])
    // useEffect(()=>{
      
    //   const fetch_coorList= ()=>{
    //     const coors = TripContentsDataService.item[DATA_KEYS.TRIP_CONTENTS.CURRENT_TRIP_COORDINATES]||[]
    //     setCoordinates(coors)
    //   }

    //   const update_coorsList={
    //     update(coorsList){
    //       setCoordinates(coorsList)
    //     }
    //   }

    //   const add_to_coorsList={
    //     update(coor){
    //       coordinates.push(coor)
    //     }
    //   }
    //   fetch_coorList()
    //   if(coordinates.length ===0) {
    //     return null}
    // },[])

    

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