import { View ,TouchableOpacity,Text,Image, Modal } from "react-native";
import { trackingModeManagerStyle } from "../../../styles/function/tracking_mode_manager";
import { useEffect, useState } from "react";
import { OverlayCard } from "../../custom_function/overlay_card";
// import trip_album_subject from "../../../backend/trip_album/trip_album_subject";
import TripSelectedObserver from "../functions/trip_display_observer";
import RadiusSelector from "./coordinates_radius_slider";
import event_bus from "../../../backend/services/UI_event_bus";
import Setting from "../../../app-core/setting";
const image =require('../../../../assets/image/gallery_icon.png')
import { TrackingModePicker } from "../../functions/tracking_mode_picker";
import { TRACKING_MODE } from "../../../backend/tracking/tracking_mode";
import GPSLogic from "../../../backend/gps_logic/gps_logic";
import CurrentTripDataService from "../../../backend/storage/current_trip";
export default function TrackingModeManager(){
    const [mode,setMode] =useState(Setting.getTrackingMode())
    const [visible,setVisible]=useState(false)
    const isOnTheTrip =CurrentTripDataService.getCurrentTripStatus()
    const changeTrackingMode =async()=>{
        if (mode === 'media_only'){
              await Setting.setTrackingMode(TRACKING_MODE.MEDIAS_ONLY)
              setMode(mode)
            }
        else{
              await Setting.setTrackingMode(TRACKING_MODE.NORMAL)
                setMode(mode)
        }
        await GPSLogic.syncGPSTask()
        setVisible(false)
    }
    return(
        <View style={trackingModeManagerStyle.container}>
            
            <TouchableOpacity style ={trackingModeManagerStyle.button} onPress={()=>setVisible(true)}>
                <Text style ={trackingModeManagerStyle.icon}> Mode {
                    mode === TRACKING_MODE.NORMAL ? "🗺️":'📷'}</Text>
                {/* <Text style ={markerManagerStyle.icon}>≡</Text> */}

            </TouchableOpacity>
        {
             visible && 
            <Modal>
            <OverlayCard onClose={()=>setVisible(false)}>
                {isOnTheTrip &&
                <>
                <TrackingModePicker value={mode}
                onChange={setMode}
                ></TrackingModePicker>
                <TouchableOpacity
                    onPress={changeTrackingMode}
                    style={trackingModeManagerStyle.submitButton}
                    >
                <Text style={trackingModeManagerStyle.submitText}>
                    Save
                </Text>
                </TouchableOpacity>
                </>}
                {!isOnTheTrip &&
                    <Text >no trips yet</Text>
                }
            </OverlayCard>
            </Modal>
        }
    
        </View>
    )
}