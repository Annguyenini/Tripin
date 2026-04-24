import { View, TouchableOpacity, Text, Image } from 'react-native'
import { useState, useEffect } from 'react'
import { helpBarMapStyle } from '../../styles/function/help_bar_map'
import { CurrentTripBar } from './components/current_trip_bar.js'
import { CurrentTripBox } from './components/current_trip_box.js'
import CurrentTripDataService from '../../backend/storage/current_trip.js'
// import TripDataService from '../../backend/storage/trip.js'
// import {subject} from '../logics/observer.js';
// import TripData from '../../app-core/local_data/local_trip_data.js'
import { DisplayTripBox } from './components/current_display_trip_box'
import TripDisplayObserver from './functions/trip_display_observer'
import { DATA_KEYS } from '../../backend/storage/keys/storage_keys'
import MarkerManager from './components/marker_manager'
import { Ionicons } from '@expo/vector-icons';/**
 * help decide waht trip to display 
 * @param {*} param
 * @returns 
 */
export const HelpBarMap = ({ isFollowingUser, setIsFollowingUser, setMapStyle }) => {
    const navigation_icon = require('../../../assets/image/navigation_notoutline_icon.png')
    const navigation_outline_icon = require('../../../assets/image/navigation_outline_icon.png')
    const [isOnATrip, setIsOnATrip] = useState(CurrentTripDataService.getCurrentTripStatus())
    const [isTripSelected, setIsTripSelected] = useState(false)
    const [isTripBoxDisplay, setIsTripBoxDisplay] = useState(false)
    const [current_trip_id, setCurrentTripId] = useState(CurrentTripDataService.getCurrentTripId())
    const [currentDisplayTripData, setCurrentDisplayTripData] = useState(TripDisplayObserver.getTripNeedRender())
    const [styleSelectionVisible, setStyleSelectionVisible] = useState(false)
    useEffect(() => {

        const updateNewDisplayTrip = {
            update(newDisplayTripId) {
                setCurrentDisplayTripData(newDisplayTripId)

            }
        }

        const updateCurrentTripData = {
            update(newTripData) {
                if (!newTripData) {
                    setCurrentTripId(null)
                    return
                }
                const newTripId = newTripData.trip_id
                setCurrentTripId(newTripId)
            }
        }

        CurrentTripDataService.attach(updateCurrentTripData, DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA)
        TripDisplayObserver.attach(updateNewDisplayTrip, TripDisplayObserver.EVENTS)
        // CurrentTripDataService.attach(updateCurrentTripStatus,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)
        return () => {
            TripDisplayObserver.detach(updateNewDisplayTrip, TripDisplayObserver.EVENTS)
            CurrentTripDataService.detach(updateCurrentTripData, DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_DATA)
            // CurrentTripDataService.detach(updateCurrentTripStatus,DATA_KEYS.CURRENT_TRIP.CURRENT_TRIP_STATUS)

        }

    }, [])
    useEffect(() => {
        // when there are no trip need to render
        if (!currentDisplayTripData) {
            setIsOnATrip(false)
            setIsTripBoxDisplay(false)
            setIsTripSelected(false)
            console.log('Display trip empty')
        }
        //when the current trip need to render
        else if (currentDisplayTripData && currentDisplayTripData.trip_id === current_trip_id) {
            setIsOnATrip(true)
            setIsTripBoxDisplay(false)
            setIsTripSelected(false)
            console.log('set current trip')

        }
        else if (currentDisplayTripData && currentDisplayTripData.trip_id !== current_trip_id) {
            setIsTripSelected(true)
            setIsTripBoxDisplay(true)
            console.log('set selected trip')

        }
    }, [currentDisplayTripData, current_trip_id])
    console.log(isFollowingUser)
    return (
        <View style={helpBarMapStyle.container}>
            {isOnATrip &&
                <>
                    {/* <CurrentTripBar ></CurrentTripBar> */}
                    {/* <CurrentTripBox isMinimize={isTripBoxDisplay}></CurrentTripBox> */}

                </>
            }
            {/* {
                isTripSelected &&
                <DisplayTripBox onHide={() => setIsTripBoxDisplay(false)} isFullDisplay={isTripBoxDisplay} />
            } */}
            <TouchableOpacity style={helpBarMapStyle.recenterButton} onPress={() => {
                setIsFollowingUser(true)
            }}
            >
                <Image style={helpBarMapStyle.icon} source={isFollowingUser ? navigation_outline_icon : navigation_icon} />
            </TouchableOpacity>
            <TouchableOpacity style={helpBarMapStyle.recenterButton} onPress={() => {
                setStyleSelectionVisible(prev => prev = !prev)
            }}
            >
                <Ionicons name="reorder-three-outline" size={24} color="#000000" />
            </TouchableOpacity>
            {styleSelectionVisible &&
                <>
                    <View style={helpBarMapStyle.styleSelection}>
                        <TouchableOpacity style={helpBarMapStyle.recenterButton} onPress={() => {
                            setMapStyle('satellite')
                        }}
                        >
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#3B6D11' }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={helpBarMapStyle.recenterButton} onPress={() => {
                            setMapStyle('dark')
                        }}
                        >
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#2C2C2A' }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={helpBarMapStyle.recenterButton} onPress={() => {
                            setMapStyle('street')
                        }}
                        >
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#e8c9a0' }} />
                        </TouchableOpacity>
                    </View>
                </>
            }
        </View>
    )
}