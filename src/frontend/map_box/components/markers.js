import { TouchableOpacity, View, Image } from "react-native"
import React, { useRef } from "react"
import { useState, useEffect, useCallback } from 'react'
import CoordinatesPointsLayout from './points';
import ImageLabel from './image_label';
import TripDisplayObserver from "../functions/trip_display_observer";
import MarkerManager from './marker_manager'
import { UseOverlay } from "../../overlay/overlay_main";
const image_icon = require('../../../../assets/image/gallery_icon.png')

export const Marker = ({ zoomLevel, isDisplayImageMaker, isCoordsMarkerDisplay }) => {
    const [currentDisplayTripData, setCurrentDisplayTripData] = useState(TripDisplayObserver.getTripNeedRender())
    const currentTripId = useRef()
    const { showLoading, hideLoading } = UseOverlay()
    const [coordReady, setCoordReady] = useState(true)
    const [imagesReady, setImageReady] = useState(true)

    useEffect(() => {
        const update_current_display_trip = {
            update(new_data) {
                setCoordReady(new_data ? false : true)
                setImageReady(new_data ? false : true)
                setCurrentDisplayTripData(new_data)
            }
        }
        TripDisplayObserver.attach(update_current_display_trip, TripDisplayObserver.EVENTS)

        return () => {
            TripDisplayObserver.detach(update_current_display_trip, TripDisplayObserver.EVENTS)
        }

    }, [])

    useEffect(() => {
        console.log(imagesReady, coordReady)
        if (!imagesReady || !coordReady) {
            showLoading()
        } else {
            hideLoading()
        }
    }, [coordReady, imagesReady])
    return (

        <View>
            {currentDisplayTripData && isCoordsMarkerDisplay && <CoordinatesPointsLayout trip_id={currentDisplayTripData.trip_id ? currentDisplayTripData.trip_id : currentDisplayTripData.id} ready={() => setCoordReady(true)}></CoordinatesPointsLayout>}
            {currentDisplayTripData && isDisplayImageMaker && <ImageLabel trip_id={currentDisplayTripData.trip_id ? currentDisplayTripData.trip_id : currentDisplayTripData.id} zoomLevel={zoomLevel} ready={() => setImageReady(true)}></ImageLabel>}
            {/* <Image source ={{uri:image_icon}}>
            </Image> */}
        </View>
    )
}
