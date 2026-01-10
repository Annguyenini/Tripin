import * as SQLite from 'expo-sqlite';
import * as TRIPCONFIG from '../../config/config_db'
import Permission from '../storage/settings/permissions';
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import TripDataStorage from './trip_data_storage';
import CurrentTripDataService from '../../backend/storage/current_trip';

const TASK_NAME = "background-location-task";

// Define task at module level - BEFORE any class instantiation
TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }

  if (!data) {
    console.warn('No data in background task');
    return;
  }

  const { locations } = data;
  if (!locations?.length) {
    console.warn('No locations in data');
    return;
  }

  const location = locations[0];
  const trip_id = CurrentTripDataService.getCurrentTripId();

  if (!trip_id) {
    console.warn('No trip_id available');
    return;
  }

  const payload = {
    time_stamp: Date.now(),
    trip_id,
    coordinates: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      altitude: location.coords.altitude,
      speed: location.coords.speed,
      heading: location.coords.heading,
    },
  };
  
  console.log('Background location payload:', payload);
  
  try {
    await TripDataStorage.push(payload);
    // console.log('Successfully saved location');
  } catch (error) {
    console.error('Error saving location:', error);
    // never throw in background tasks
  }
});

export class TripService {

  constructor() {
 

  }

  async init_trip_properties() {
    this.trip_id = CurrentTripDataService.getCurrentTripId();
  }

  /**
   * Check if background location permission is granted
   */
  async checkBackgroundPermission() {
    const status = await Permission.getBackGroundPer();
    if (status !== 'true') {
      console.warn('Background location permission not granted');
      return false;
    }
    return true;
  }

  /**
   * Filter and start task 
   * @param {*} currentState - active or background
   */
  async startGPSWatch(currentState) {
    // Ensure we have background permission
    const hasPermission = await this.checkBackgroundPermission();
    if (!hasPermission) {
      console.error('Cannot start GPS watch without background permission');
      return false;
    }

    if (currentState === 'active') {
      await this.startGPSTask(10000, Location.Accuracy.High);
    } else if (currentState === 'background') {
      await this.startGPSTask(10000, Location.Accuracy.Low);
    }
    
    return true;
  }

  /**
   * Start a location task
   * @param {*} trackingTime - tracking interval in ms
   * @param {*} performance - accuracy level
   */
  async startGPSTask(trackingTime, performance) {
    try {
      // Check if task is already running
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
      
      if (hasStarted) {
        // console.log('Stopping existing task...');
        await Location.stopLocationUpdatesAsync(TASK_NAME);
        // Wait a bit after stopping
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Check if task is registered
      const isTaskDefined = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
      // console.log('Task registered:', isTaskDefined);

      // Start the task
      // console.log('Starting location updates...');
      await Location.startLocationUpdatesAsync(TASK_NAME, {
        accuracy: performance,
        timeInterval: trackingTime,
        pausesUpdatesAutomatically: false,
        distanceInterval: 5,
        showsBackgroundLocationIndicator: true, // iOS - shows blue bar
        foregroundService: { // Android
          notificationTitle: 'Trip Tracking',
          notificationBody: 'Your trip is being tracked',
        },
      });
      
      // console.log('Location updates started successfully');
      return true;
    } catch (e) {
      console.error('Error starting GPS task:', e);
      return false;
    }
  }

  /**
   * Stop GPS tracking
   */
  async stopGPSWatch() {
    try {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
      if (hasStarted) {
        await Location.stopLocationUpdatesAsync(TASK_NAME);
        // console.log('GPS tracking stopped');
        return true;
      }
    } catch (e) {
      console.error('Error stopping GPS watch:', e);
      return false;
    }
  }
}

const trip = new TripService()
export default trip