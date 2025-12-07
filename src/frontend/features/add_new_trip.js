
import{View,TouchableOpacity,Text,TextInput} from "react-native"
import{tripStyle} from "../../styles/function/trip_style.js"
import { OverlayCard } from "../custom_function/overlay_card.js"

export const NewTripFiller = ({show_create_trip_filler,set_show_create_trip_filler,set_trip_name,request_new_trip})=>{
  
  return(
      <OverlayCard title="Create New Trip" onClose={() => set_show_create_trip_filler(false)}>
        
        <TextInput
          placeholder="Enter your trip name!"
          onChangeText={set_trip_name}
          style={tripStyle.input}
        />
        <TouchableOpacity style={tripStyle.submitButton}>
          <Text style={tripStyle.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </OverlayCard>
  )
}