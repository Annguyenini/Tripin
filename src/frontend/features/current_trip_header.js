import { TouchableOpacity, View,Image } from "react-native"
const current_trip_header_image =require("../../../assets/image/current_trip_header_bar.png")
export const CurrentTripHeader=()=>{
    return(
        <View>
            {/* icon */}
            <TouchableOpacity>
                <Image source={current_trip_header_image}></Image>
            </TouchableOpacity>
            {/* tempature */}
            <TouchableOpacity>
                <Text>

                </Text>
            </TouchableOpacity>
            {/* time */}
            <TouchableOpacity>
                <Text>

                </Text>
            </TouchableOpacity>
            {/* LOCATION */}
            <TouchableOpacity>
                <Text>
                    
                </Text>
            </TouchableOpacity>
        
        
        </View>
    )
}