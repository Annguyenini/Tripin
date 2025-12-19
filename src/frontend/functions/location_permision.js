import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { View, Text, Button, ActivityIndicator, Platform,AppState } from "react-native";
import * as Location from "expo-location";
import { Permission } from "../../backend/userdatas/settings/permissions";
const permissionService = new Permission()
export const LocationPermission=() =>{
  const [foregroundStatus, setForegroundPermission] = useState(false);
  const [backgroundStatus, setBackgroundPermission] = useState(false);
  const [currentState, setCurrentState] = useState(AppState.currentState);

  useEffect( ()=>{
  
  async function getLocationPermission() {
      
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
      setForegroundPermission(false)
      return;
    }
    setForegroundPermission(status === "granted" ? true : false)
    permissionService.setForeGroundPer(status ==="granted"? 'true':'false')


    if(status){ 
      let backgroundLocStatus = await Location.requestBackgroundPermissionsAsync();
      setBackgroundPermission(backgroundLocStatus.granted? true:false)
      permissionService.setForeGroundPer(status ==="granted"? 'true':'false')

    }  

  }

  getLocationPermission();
  }, [backgroundStatus,foregroundStatus,currentState]);
  
  return (
    <View className="justify-center items-center">
      
    </View>
  );
}
