import { TouchableOpacity, View,Image,Text,StyleSheet,AppState } from "react-native"

import {curent_trip_styles} from '../../styles/function/current_trip_header'
import { useEffect, useState } from "react";
import { TripService } from "../../backend/trip/trip_service";
import { TripDataService } from "../../backend/userdatas/trip";
export const CurrentTripBar=()=>{

  const[onFullMode, setOnFullMode]=useState(false)

  const[duration,setDuration] = useState(null)
  const[degree,setDegree] = useState(null)
  const[aqi,setAqi] = useState(null)
  const[currentState,setCurrentState] =useState(AppState.currentState);
  const tripService = new TripService
  const tripDataService = new TripDataService
  useEffect(()=>{
    (async()=>{
      const tripStatus = await tripDataService.getTripStatus()
      if (tripStatus ==='true'){
        tripService.init_trip_properties()
      }
      const state = AppState.addEventListener('change' ,nextState=>{
        setCurrentState(nextState)
      });
      // await location_logic();
      tripService.startGPSWatch(currentState);
      return () => state.remove();
      })();
    async function fetchdata() {
    const tripData = await tripDataService.getTripData()
    const duration = Date.now()-tripData.created_time
    }
    fetchdata()
  })
  const callSetFullMode = () =>{
    setOnFullMode(last=> last === false? true:false)
  }
  const Minimize =()=>{
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={callSetFullMode} style={styles.arrow} activeOpacity={0.7}>
          <Text>↓</Text>
        </TouchableOpacity>
      </View>
    )
  }
  const Full =()=>{
      return(<View style={styles.container}>
        <Pill>
          <Text style={styles.time}>55</Text>
          <Text style={styles.sub}>MIN</Text>
        </Pill>

        <Pill>
          <Text style={styles.text}>0 C</Text>
        </Pill>

        <Pill>
          <Text style={styles.text}>PARIS</Text>
        </Pill>

        <Pill>
          <Text style={styles.text}>AQI: 42</Text>
        </Pill>

        <TouchableOpacity onPress ={callSetFullMode} style={styles.arrow} activeOpacity={0.7}>
          <Text>↑</Text>
        </TouchableOpacity>
      </View>)
  }
   return (
    <View style={styles.wrapper}>
      {!onFullMode && <Minimize/>}
      {onFullMode &&<Full/>}
      </View>
  );
}

function Pill({ children }) {
  return <View style={styles.pill}>{children}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    right: 0,
    top: "25%"
    },

  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    top:100,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
  },

  pill: {
    backgroundColor: "#E5E5E5",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
    marginVertical: 5,
    minWidth: 70,
  },

  time: {
    fontSize: 22,
    fontWeight: "700",
  },

  sub: {
    fontSize: 10,
    fontWeight: "600",
    opacity: 0.7,
    marginTop: -2,
  },

  text: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.6,
  },

  arrow: {
    marginTop: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
  },
});