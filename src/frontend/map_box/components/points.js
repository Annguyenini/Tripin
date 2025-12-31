import  MapboxGL from '@rnmapbox/maps'
const CoordinatesPointsLayout =(coordinates)=> {
    if(coordinates.length ===0) {
        return}

    const geoJson ={
        type: 'FeatureCollection',
        features: coordinates.map((coors) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coors,
      },
    })),
  };
    
    return(
        <MapboxGL.ShapeSource id ='points' shape={geoJson}>
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