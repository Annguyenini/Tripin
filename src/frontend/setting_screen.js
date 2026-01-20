import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions,Image,PanResponder } from 'react-native';
import AuthService from '../backend/services/auth.js'
import {navigate} from './custom_function/navigationService.js'
import {settingStyle} from '../styles/setting_style.js'
import CurrentTripDataService from '../../src/backend/storage/current_trip.js'
import UserDataService from '../backend/storage/user.js'
import TripService from '../backend/gps_logic/gps_logic.js';
import TokenService from '../backend/services/token_service.js';
export const SettingScreen =()=>{
    const callLogout = async ()=>{
        await AuthService.requestLogout();
        await TokenService.deleteToken("access_token")
        await TokenService.deleteToken("refresh_token")
        await UserDataService.deleteAllUserData();
        await CurrentTripDataService.resetCurrentTripData()
        await TripService.stopGPSWatch()
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