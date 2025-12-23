import { TouchableOpacity, View,Image,Text,StyleSheet,AppState } from "react-native"

import {curent_trip_styles} from '../../styles/function/current_trip_header'
import { use, useEffect, useMemo, useState } from "react";
import { TripService } from "../../backend/trip/trip_service";
import { TripDataService } from "../../backend/storage/trip";
import TripData from "../../app-core/local_data/local_trip_data";
import { Trip } from "../../backend/trip/trip";
import { navigate } from "../custom_function/navigationService";
export const CurrentTripBar=()=>{

  const[onFullMode, setOnFullMode]=useState(false)

  const[duration,setDuration] = useState({hours:0,minutes:0})
  const[degree,setDegree] = useState(null)
  const[aqi,setAqi] = useState(null)
  const[currentState,setCurrentState] =useState(AppState.currentState);
  const[createdTime,setCreatedTime] = useState(null)
  const tripService = new TripService
  const trip = new Trip()

  const tripDataService = new TripDataService
  const end_trip =async()=>{
    const status =await trip.end_trip();
    if (status){
      tripDataService.setTripStatus('false')
    }
  }

  useEffect(()=>{
    const fetch = async()=>{
      setCreatedTime(TripData.created_time)

    }
    fetch()
  },[createdTime])

  useEffect(()=>{

    if (!createdTime) {
       return;
    }
    const interval = setInterval(()=>{
      const dur = Date.now() - createdTime
      const hour = dur/3600000
      const hours_floor = Math.floor(hour)
      const minutes = Math.floor((hour - hours_floor) * 60);
      setDuration({hours:hours_floor,minutes: minutes})
    },1000)
    return ()=> clearInterval(interval)
  },[createdTime])


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
          {duration.hours !== 0 && (
          <>
            <Text style={styles.time_hr}>{duration.hours}</Text>
            <Text style={styles.sub_hr}>Hour</Text>
          </>
        )}

        {duration.minutes !== 0 && (
          <>
          <Text style={styles.time_min}>{duration.minutes}</Text>
          <Text style={styles.sub_min}>Min</Text>
        </>
        )}

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
        <RedPill>
          <TouchableOpacity onPress={end_trip}>
          <Text style={styles.end_trip}>End trip</Text>
          </TouchableOpacity>
        </RedPill>
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

function RedPill({ children }) {
  return <View style={styles.red_pill}>{children}</View>;
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
  red_pill:{
    backgroundColor: "#ff0000ff",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
    marginVertical: 5,
    minWidth: 70,
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

  time_hr: {
    fontSize: 22,
    fontWeight: "700",
  },
  time_min: {
    fontSize: 15,
    fontWeight: "700",
  },

  sub_hr: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
    marginTop: -2,
  },
  sub_min: {
    fontSize: 10,
    fontWeight: "600",
    opacity: 0.7,
    marginTop: -2,
  },
  end_trip:{
    fontSize:10,
    fontWeight: "700",
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