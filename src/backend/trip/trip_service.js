import * as SQLite from 'expo-sqlite';
import * as TRIPCONFIG from '../../config/config_db'
import { Permission } from '../userdatas/settings/permissions';
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import { useState } from 'react';
import { TripDataStorage } from './trip_data_storage';
import { TripDataService } from '../userdatas/trip';
const TASK_NAME = "background-location-task";
export class TripService{
    static instance

    constructor(){
      if (TripService.instance){
        // this.init_trip_properties()
        return TripService.instance
      }
      TripService.instance =this

      // this.db = SQLite.openDatabaseAsync(TRIPCONFIG.SQLITE3_TRIPS_DB_DIRECTORY)
      this.permissionService = new Permission()
      this.tripDataStorage = new TripDataStorage()
      this.tripDataService = new TripDataService()
      
      this.defineTask();

    }
    async init_trip_properties(){
      const trip_data = await this.tripDataService.getTripData()
      this.trip_id = trip_data.trip_id
      console.log(this.trip_id)
    }
    /**
     * call back for GPS
     */
    async defineTask(){
     TaskManager.defineTask(TASK_NAME, ({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }
    if (data) {

      const { locations } = data;
        const coor_data ={
          time_stamp : Date.now(),
          trip_id:this.trip_id,
          coordinates:{
            altitude:locations[0].coords.altitude,
            heading : locations[0].coords.heading,
            latitude :locations[0].coords.latitude,
            longitude :locations[0].coords.longitude,
            speed:locations[0].coords.speed
          }
          }
        this.tripDataStorage.push(coor_data)
      console.log(coor_data)
      console.log("📍 New location:", locations[0].coords);

    }
    });
  }
    /**
     * fillter the and start task 
     * @param {*} currentState - active or background
     */
    async startGPSWatch (currentState){
        //if user currently on the app
        console.log(currentState)
        if(currentState=== 'active'){
        await this.startGPSTask(10000,Location.Accuracy.High);
        console.log("calling active")
        }
        //if the app run on background
        else if(currentState ==='background'){
        await this.startGPSTask(10000, Location.Accuracy.Low);
        console.log("calling BACKGROUND")
        }
    }

/**
 * Start a location task
 * @param {*} trackingTime - nm tracking per nm (not guaranteer) 
 * @param {*} performance  - type of performance will be perform
 */
    async startGPSTask (trackingTime, performance){
        // if there are an exists location service end it
        
        //check for exists task
        const hasStarted = Location.hasStartedLocationUpdatesAsync(TASK_NAME);
        
        //end task
        if(hasStarted){
        Location.stopLocationUpdatesAsync(TASK_NAME);
        console.log("Stop curent task!")
        }
        
        // run a new task
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








