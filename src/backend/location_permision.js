import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { View, Text, Button, ActivityIndicator, Platform,AppState } from "react-native";
import * as Location from "expo-location";
import {LocationLogic} from "./location_logic"
export const LocationHandler=() =>{
  const location_logic = new LocationLogic();
  const [foregroundStatus, setForegroundPermission] = useState(false);
  const [backgroundStatus, setBackgroundPermission] = useState(false);
  const [location, setLocation] = useState(null);
  const [currentState, setCurrentState] = useState(AppState.currentState);

  useEffect( ()=>{
    
  //   (async()=>{
  //     if(!foregroundStatus?.granted){
  //     try{
  //       await requestForegroundPermission();
        
  //     }
  //     catch(error){
  //       console.error("Error at request location permission: ",error);
  //     }
  //   }
  //   console.assert(foregroundStatus?.granted, "forground is not granted!");
  //   if(!backgroundStatus?.granted && foregroundStatus?.granted){
  //     try{
  //       console.log("assking")
  //       await requestBackgroundPermission();
  //     }
  //     catch(error){
  //       console.error("Error at request background location permission!");
  //     }
  //   }
  //   const loc = await Location.getCurrentPositionAsync;
  //   setLocation(loc);

  // })
  
  async function getLocationPermission() {
      
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
      setForegroundPermission(false)
      return;
    }
    setForegroundPermission(status === "granted" ? true : false)
    
    if(status){ 
      let backgroundLocStatus = await Location.requestBackgroundPermissionsAsync();
      setBackgroundPermission(backgroundLocStatus.granted? true:false)

    } 
    
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);


   
  }
   if(foregroundStatus&&backgroundStatus){
     {
      // if the uses are not in any tcurrent trip,  we can skipp tracking in background
      
      (async()=>{
      const state = AppState.addEventListener('change' ,nextState=>{
        setCurrentState(nextState)
      });
      // await location_logic();
      location_logic.location_handler(currentState);
      return () => state.remove();
      })();

      // location_handler(currentState)
      
    }

  }
  getLocationPermission();
  }, [backgroundStatus,foregroundStatus,currentState]);


  // console.warn(backgroundStatus)
  // console.warn(foregroundStatus)
  // console.log(backgroundStatus)
  // if (!foregroundStatus) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <ActivityIndicator size="large" />
  //       <Text>Checking permissions...</Text>
  //     </View>
  //   );
  // }
  
  if (!foregroundStatus) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Foreground permission denied 🚫</Text>
        {/* <Button title="Try Again" onPress={requestForegroundPermission} /> */}
      </View>
    );
  }



  return (
    <View className="justify-center items-center">
      <Text>Foreground Permission: {foregroundStatus? "yes" :"no"}</Text>
      <Text>Background Permission: {backgroundStatus? "Yes" : "No"}</Text>

      {location && (
        <Text>
          📍 Lat: {location.coords.latitude.toFixed(4)}, Lon:{" "}
          {location.coords.longitude.toFixed(4)}
        </Text>
      )}

      {/* {!backgroundStatus?.granted && Platform.OS !== "web" && (
        <Button title="Enable Background Location" onPress={requestBackgroundPermission} />
      )} */}
    </View>
  );
}
