import { View ,TouchableOpacity,Text,Image, Modal } from "react-native";
import { markerManagerStyle } from "../../../styles/function/marker_manager_style";
import { useEffect, useState } from "react";
import { OverlayCard } from "../../custom_function/overlay_card";
// import trip_album_subject from "../../../backend/trip_album/trip_album_subject";
import TripSelectedObserver from "../functions/trip_display_observer";
import RadiusSelector from "./coordinates_radius_slider";
import event_bus from "../../../backend/services/UI_event_bus";
const image =require('../../../../assets/image/gallery_icon.png')

export default function MarkerManager({imageMarkerDisplay,setIsImageMarkerDisplay,isCoordsMarkerDisplay,setIsCoordsMarkerDisplay}){
    const [isMarkerManagerDisplay,setIsMarkerManagerDisplay] = useState(false)
    const [radiusVal,setRadiusVal]=useState(event_bus.getValueFromKey('RadiusChange'))
    useEffect(()=>{
        const updateRadius =(val)=>{
            setRadiusVal(val)
        }
        event_bus.on('RadiusChange',updateRadius)
        return()=>{
            event_bus.off('RadiusChange',updateRadius)
        }
    },[])  
    return(
        <View style={markerManagerStyle.container}>
            <TouchableOpacity style ={markerManagerStyle.button} onPress={()=>setIsMarkerManagerDisplay(true)}>
                <Text style ={markerManagerStyle.icon}>📍</Text>
                {/* <Text style ={markerManagerStyle.icon}>≡</Text> */}

            </TouchableOpacity>
            <View style ={markerManagerStyle.notifyCover}>
            { !isCoordsMarkerDisplay &&
                <Text style ={markerManagerStyle.text}>Location Marker: off</Text>
            }
            { !imageMarkerDisplay &&
                <Text style ={markerManagerStyle.text}>Image Labels Marker: off</Text>
            }
            {radiusVal >0 &&
                <Text style ={markerManagerStyle.text}>Current Coords Grouping Radius: {radiusVal}m</Text>
            }
            </View>
            {
                isMarkerManagerDisplay &&
                <Modal
                animationType="fade"
                transparent={true}
                visible={isMarkerManagerDisplay}
                onRequestClose={()=>setIsMarkerManagerDisplay(false)}
                >
                    

                    <OverlayCard title={'Marker Manager'} onClose={()=>setIsMarkerManagerDisplay(false)}>
                        <View style={markerManagerStyle.row}>
                            <Text style={markerManagerStyle.text}>Display Image Marker</Text>
                            <Text style={markerManagerStyle.text}>Display Coordinates Marker</Text>
                        </View>
                        <View style={markerManagerStyle.row}>
                        <TouchableOpacity style={markerManagerStyle.controlbutton} onPress={
                            ()=>{setIsImageMarkerDisplay(prev => prev === true ? false :true)

                        }}>
                            <Text style={markerManagerStyle.buttonText}>Turn: {imageMarkerDisplay ? 'off':'on'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={markerManagerStyle.controlbutton} onPress={
                            ()=>{setIsCoordsMarkerDisplay(prev => prev === true ? false :true)

                        }}>
                            <Text style={markerManagerStyle.buttonText}>Turn: {isCoordsMarkerDisplay ? 'Off':'On'}</Text>
                        </TouchableOpacity>
                        
                        </View>
                        <RadiusSelector></RadiusSelector>
                        
                    </OverlayCard>
                </Modal>
            }
        </View>
    )
}