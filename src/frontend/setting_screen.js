import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions,Image,PanResponder } from 'react-native';
import AuthService from '../backend/services/auth.js'
import {navigate} from './custom_function/navigationService.js'
import {settingStyle} from '../styles/setting_style.js'
import CurrentTripDataService from '../../src/backend/storage/current_trip.js'
import UserDataService from '../backend/storage/user.js'
import TripService from '../backend/gps_logic/gps_logic.js';
import TokenService from '../backend/services/token_service.js';
import LocalStorage from '../backend/storage/base/localStorage.js';
import safeRun from '../app-core/helpers/safe_run.js';
const Localstorage =new LocalStorage()
export const SettingScreen =()=>{
    const callLogout = async ()=>{
        // await AuthService.requestLogout();
        console.log('signout')
        await safeRun(() => TokenService.deleteToken("access_token"), 'failed_at_delete_access_token')
        await safeRun(() => TokenService.deleteToken("refresh_token"), 'failed_at_delete_refresh_token')
        await safeRun(() => UserDataService.deleteAllUserData(), 'failed_at_delete_user_data')
        await safeRun(() => CurrentTripDataService.endCurrentTrip(), 'failed_at_reset_trip_data')
        await safeRun(() => TripService.endGPSLogic(), 'failed_at_end_gps_logic')
        await safeRun(() => Localstorage.clearAllStorage(), 'failed_at_clear_storage')
        console.log('signout1')

        navigate("auth")
    }  
    const returnToMainScreen =()=>{
        navigate("Main")
    }
    return(
        <View style={{flex:1}}>
            {/* font bar */}
            <View style={settingStyle.topBar}>
                <View style={settingStyle.buttonContainer}>
                    <TouchableOpacity onPress={returnToMainScreen}>
                    <Text style={settingStyle.closeText}>X</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* main screen */}
            <View>  
            <TouchableOpacity onPress={callLogout}>
                <Text>Log Out</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}