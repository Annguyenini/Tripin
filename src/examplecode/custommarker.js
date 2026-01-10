import React, { Component } from 'react';
import { View } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import sampleIcon from './assets/custom_marker.png';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const shape = {
      type: 'Feature',
      properties: {
        title: 'Lincoln Park',
        description: 'A northside park that is home to the Lincoln Park Zoo'
      },
      geometry: {
        coordinates: [
          -87.637596,
          41.940403
        ],
        type: 'Point'
      }
    };
const mapStyles = Mapbox.StyleSheet.create({
      icon: {
        iconImage: sampleIcon,
      },
    });


export default class App extends Component<{}> {

  render() {
    return (
      <View style={styles.container}>
        <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Streets}
            zoomLevel={13}
            centerCoordinate={[-87.6298, 41.8781]}
            style={styles.container}
        />
        <Mapbox.ShapeSource
            id='exampleShapeSource'
            shape={{
               type: 'FeatureCollection',
               features: { shape }
            }}
        >
        <Mapbox.SymbolLayer style={mapStyles.icon} />
        </Mapbox.ShapeSource>
        </View>
    );
  }
}