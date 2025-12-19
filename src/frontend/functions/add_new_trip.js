
import{View,TouchableOpacity,Text,TextInput} from "react-native"
import{tripStyle} from "../../styles/function/trip_style.js"
import { OverlayCard } from "../custom_function/overlay_card.js"
import { LocationPermission } from "./location_permision.js"

export const NewTripFiller = ({show_create_trip_filler,set_show_create_trip_filler,set_trip_name,request_new_trip,alert})=>{
  
  return(
      <OverlayCard title="Create New Trip" onClose={() => set_show_create_trip_filler(false)}>
        <Text>{alert}</Text>        
        <TextInput
          placeholder="Enter your trip name!"
          onChangeText={text =>set_trip_name(text)}
          style={tripStyle.input}
        />
        <TouchableOpacity style={tripStyle.submitButton} onPress={request_new_trip}>
          <Text style={tripStyle.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </OverlayCard>
  )
}