import { TouchableOpacity, View,Image,Text,StyleSheet,AppState } from "react-native"
import { use, useEffect, useMemo, useState } from "react";
// import TripDataService from "../../../backend/storage/trip";
import CurrentTripDataService from '../../../backend/storage/current_trip'
// import TripData from "../../../app-core/local_data/local_trip_data";
import TripHandler from "../../../app-core/flow/trip_handler";
import LocationDataService from "../../../backend/storage/current_location_data_service";
import { DATA_KEYS } from "../../../backend/storage/keys/storage_keys";
import TripDisplayObserver from "../functions/trip_display_observer";
import OfflineSyncManager from "../../../app-core/flow/sync/offline_sync_manager";
import { UseOverlay } from "../../overlay/overlay_main";
export const CurrentTripBar=()=>{

  const[onFullMode, setOnFullMode]=useState(true)

  const[duration,setDuration] = useState({hours:0,minutes:0})
  const [temp,setTemp] = useState(null)
  const[aqi,setAqi] = useState(null)
  const[city,setCity] = useState(null)
  const[currentState,setCurrentState] =useState(AppState.currentState);
  const[createdTime,setCreatedTime] = useState(null)
  const {showLoading,hideLoading} =UseOverlay()
  const end_trip =async()=>{
    showLoading()
    const status =await TripHandler.endTripHandler();
    hideLoading ()
  }

  useEffect(()=>{
    const fetch = async()=>{
      setCreatedTime(CurrentTripDataService.getCurrentCreatedTime())
    }
    fetch()

    const update_location_condition ={
      update(condition){
        setAqi(condition.aqi)
        setTemp(condition.tempature)
      }
    }
    const update_city={
      update(city){
        setCity(city)
      }
    }
    LocationDataService.attach(update_location_condition,DATA_KEYS.LOCATION.CONDITIONS)
    LocationDataService.attach(update_city,DATA_KEYS.LOCATION.CITY)
    return ()=>{
      LocationDataService.detach(update_location_condition,DATA_KEYS.LOCATION.CONDITIONS)
      LocationDataService.detach(update_city,DATA_KEYS.LOCATION.CITY)
    }
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

        {/* <Pill>
          <Text style={styles.text}>{temp} C</Text>
        </Pill> */}

        <Pill>
          <Text style={styles.text}>{city}</Text>
        </Pill>

        {/* <Pill>
          <Text style={styles.text}>AQI: {aqi}</Text>
        </Pill> */}
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
    position: 'absolute',
    right: 0,
    top: '25%',
  },

  container: {
    backgroundColor: '#1a1917',
    borderRadius: 16,
    top: 50,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 6,
  },

  red_pill: {
    backgroundColor: '#c03030',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginVertical: 4,
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 3,
  },

  pill: {
    backgroundColor: '#242220',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginVertical: 4,
    minWidth: 70,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  time_hr: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f0f0ec',
    fontFamily: 'DMMono',
  },

  time_min: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f0f0ec',
    fontFamily: 'DMMono',
  },

  sub_hr: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5a5550',
    fontFamily: 'DMMono',
    marginTop: -2,
    letterSpacing: 0.08,
  },

  sub_min: {
    fontSize: 9,
    fontWeight: '600',
    color: '#5a5550',
    fontFamily: 'DMMono',
    marginTop: -2,
    letterSpacing: 0.08,
  },

  end_trip: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f0f0ec',
    fontFamily: 'DMMono',
    letterSpacing: 0.08,
  },

  text: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f0f0ec',
    fontFamily: 'DMMono',
    letterSpacing: 0.6,
  },

  arrow: {
    marginTop: 6,
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#242220',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 3,
  },
})