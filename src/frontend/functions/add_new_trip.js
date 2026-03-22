
import{View,TouchableOpacity,Text,TextInput,Image} from "react-native"
import{tripStyle} from "../../styles/function/trip_style.js"
import { OverlayCard } from "../custom_function/overlay_card.js"
import { imagePicker,takePicture } from "./image_picker.js"
import { useState } from "react"
import { TrackingModePicker } from "./tracking_mode_picker.js"
import { TRACKING_MODE } from "../../backend/tracking/tracking_mode.js"
import Setting from "../../app-core/setting.js"
export const NewTripFiller = ({set_show_create_trip_filler,request_new_trip})=>{
  const[tripName,setTripName]= useState(null)
  const[imageUri,setImageUri]=useState(null)
  const[alert,setAlert]=useState(null)
  const callImagePicker = async()=>{
    const pic = await imagePicker()
    setImageUri(pic.assets[0].uri)
  }
  const callCamera = async() =>{
    const pic = await takePicture()
    setImageUri(pic.assets[0].uri)
  }
  const requestHandler=()=>{
    if(!tripName){
      setAlert("Trip name couldn't be empty!")
      return
    }
    request_new_trip(tripName,imageUri)
  }
  const trackingModeHandler =async(mode)=>{
    if (mode === 'normal'){
      await Setting.setTrackingMode(TRACKING_MODE.NORMAL)
    }
    else{
      await Setting.setTrackingMode(TRACKING_MODE.MEDIAS_ONLY)
    }
  }
  return (
  <OverlayCard
    title="Create New Trip"
    onClose={() => set_show_create_trip_filler(false)}
  >
    {alert &&<Text style ={{fontSize:12 , color :'red'}}>{alert}</Text>}
    <View style={tripStyle.imageFrame}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={tripStyle.image} />
      ) : (
        <Text style={tripStyle.placeholder}>No image (recomment rotate your phone) </Text>
      )}
    </View>

    <View style={tripStyle.imageButtons}>
      <TouchableOpacity style={tripStyle.secondaryButton} onPress={callImagePicker}>
        <Text style={tripStyle.secondaryButtonText}>Choose Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={tripStyle.secondaryButton} onPress={callCamera}>
        <Text style={tripStyle.secondaryButtonText}>Take Picture</Text>
      </TouchableOpacity>
    </View>

    <TextInput
      placeholder="Enter your trip name!"
      onChangeText={text => setTripName(text)}
      style={tripStyle.input}
    />
    <TrackingModePicker value={'media_only'} onChange={trackingModeHandler}></TrackingModePicker>
    <TouchableOpacity style={tripStyle.submitButton} onPress={requestHandler}>
      <Text style={tripStyle.submitButtonText}>Submit</Text>
    </TouchableOpacity>

  </OverlayCard>
)
}