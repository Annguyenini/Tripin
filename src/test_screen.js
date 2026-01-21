import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { OverlayCard } from './frontend/custom_function/overlay_card';
import UserDataService from './backend/storage/user';
import CurrentTripDataService from './backend/storage/current_trip';
import TripService  from './backend/gps_logic/gps_logic';
import TripDataStorage from './backend/trip_coordinates/current_trip_coordinate_service';
import Albumn from './backend/album/albumdb';
import TripDatabaseService from './backend/database/TripDatabaseService';
export const TestScreen = ({testScreenHandler}) => {
  const [gpsStatus, setGpsStatus] = useState('GPS task not running');
  const [sqlText, setSqlText] = useState('No SQL data fetched');

  const onGetSQLPress = async() => {
    const data =await TripDataStorage.getAllCoordinatesFromTripId(CurrentTripDataService.getCurrentTripId())
    console.log(data)
  };
  const onGetAlbumPress = async ()=>{
    console.log(await Albumn.getAllMediasFromDb())
  }
  const onGetUserDb = async()=>{
    console.log(await TripDatabaseService.getAllDataFromdb())
  }
  useEffect(()=>{
    const fetchGPSTask=async()=>{
        const status =await TripService.isAnyTask()
        if(status){
            setGpsStatus('running')
        }
    }
    fetchGPSTask()
  })
  return (
    <OverlayCard title={'Test'} onClose={testScreenHandler}>
      <View style={{ gap: 8 }}>
        {/* User data */}
        <Text>👤 User Data</Text>
        <Text>Username: {UserDataService.getUserName()}</Text>
        <Text>User ID: {UserDataService.getUserId()}</Text>
        <Text>Display Name: {UserDataService.getDisplayName()}</Text>

        {/* Trip data */}
        <Text style={{ marginTop: 10 }}>🧭 Current Trip</Text>
        <Text>: {CurrentTripDataService.getCurrentTripName()}</Text>
        <Text>Status: {CurrentTripDataService.getCurrentTripStatus()? 'true':'false'}</Text>
        <Text>ID: {CurrentTripDataService.getCurrentTripId()}</Text>

        {/* Button */}
        <TouchableOpacity
          onPress={onGetSQLPress}
          style={{
            marginTop: 12,
            padding: 10,
            backgroundColor: '#e0e0e0',
            borderRadius: 6,
            alignItems: 'center',
          }}
        >
          <Text>print data from SQL to console</Text>
        </TouchableOpacity>
        <TouchableOpacity
                onPress={onGetAlbumPress}
                style={{
                  marginTop: 12,
                  padding: 10,
                  backgroundColor: '#e0e0e0',
                  borderRadius: 6,
                  alignItems: 'center',
                }}
            >
          <Text>print data from album to console</Text>
        </TouchableOpacity>
       <TouchableOpacity
                onPress={onGetUserDb}
                style={{
                  marginTop: 12,
                  padding: 10,
                  backgroundColor: '#e0e0e0',
                  borderRadius: 6,
                  alignItems: 'center',
                }}
            >
          <Text>print data from user to console</Text>
        </TouchableOpacity>

        {/* GPS status */}
        <Text>📡 GPS Task: {gpsStatus}</Text>
      </View>
    </OverlayCard>
  );
};
