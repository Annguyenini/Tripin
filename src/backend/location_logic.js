
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import { useState } from 'react';
import {CoordinatesMap} from'./coordinates/coordinates_map'
const TASK_NAME = "background-location-task";


export class LocationLogic{
  constructor(){
    if (LocationLogic.instance) return LocationLogic.instance;
    LocationLogic.instance = this;
    this.defineTask();
    this.coorTable = new Map;
    this.isOnTrip = false;
    this.coordinatesMap = new CoordinatesMap()
  }

  defineTask(){
     TaskManager.defineTask(TASK_NAME, ({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      const { locations } = data;
      console.log("📍 New location:", locations[0].coords);
    }
    });
  }
 
 
 
  async location_handler (currentState){
    if(currentState=== 'active'){
      await this.location_tracking_logic(10000,Location.Accuracy.High);
      console.log("calling active")
    }
    else if(currentState ==='background'){
      await this.location_tracking_logic(10000, Location.Accuracy.Low);
      console.log("calling BACKGROUND")
    }
  }
  async location_tracking_logic (trackingTime, performance){
    const hasStarted = Location.hasStartedLocationUpdatesAsync(TASK_NAME);
    setTimeout(()=>{

    })
    if(hasStarted){
      Location.stopLocationUpdatesAsync(TASK_NAME);
      console.log("Stop curent task!")
    }
    setTimeout(async()=>{
      await Location.startLocationUpdatesAsync(TASK_NAME,
        {
            accuracy:performance,
            timeInterval:trackingTime,
            pausesUpdatesAutomatically:false,
            distanceInterval:5,
        })
    },200)
  }
}

