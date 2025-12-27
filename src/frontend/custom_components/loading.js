import { ActivityIndicator, View,StyleSheet,Text} from 'react-native';


export const Loading = ()=>{
    return(
        
 <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={{color:'white'}}>
        It Kinda Slow.... 
      </Text>
    </View>    )
}
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // cover whole screen
    backgroundColor: 'rgba(0,0,0,0.3)', // transparent dark layer
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});