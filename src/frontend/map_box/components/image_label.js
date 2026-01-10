import  MapboxGL from '@rnmapbox/maps'
import {View,Image} from'react-native'
const ImageLabel =(medias_objects)=>{
    if (!medias_objects || medias_objects.length === 0) return null;
        console.log('dsds',medias_objects)


    
   return (
    <>
      {medias_objects.map((media, index) => (
        <MapboxGL.MarkerView
          key={`marker-${index}`}
          id={`marker-${index}`}
          coordinate={media.coordinate}
        >
          <View style={{ width: 50, height: 50 }}>
            <Image
              source={{ uri: media.filename }}
              style={{ width: 50, height: 50, borderRadius: 15 }}
              resizeMode="cover"
            />
          </View>
        </MapboxGL.MarkerView>
      ))}
    </>
  );  
}
export default ImageLabel