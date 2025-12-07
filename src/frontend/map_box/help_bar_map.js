import {View,TouchableOpacity,Text,Image} from 'react-native'
import { helpBarMapStyle } from '../../styles/function/help_bar_map'
export  const HelpBarMap =({isFollowingUser,setIsFollowingUser})=>{
    const navigation_icon = require('../../../assets/image/navigation_notoutline_icon.png')
    const navigation_outline_icon = require('../../../assets/image/navigation_outline_icon.png')
    
    return(
        <View style ={helpBarMapStyle.container}>
            {/* zoom up button */}
            {/* <TouchableOpacity style ={helpBarMapStyle.zoomContainer} >
                <Text style ={helpBarMapStyle.text}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style ={helpBarMapStyle.zoomContainer} >
                <Text style ={helpBarMapStyle.text}>-</Text>
            </TouchableOpacity> */}
            {/* navigation */}
            <TouchableOpacity style ={helpBarMapStyle.recenterButton} onPress={()=>{
                setIsFollowingUser(true)
            }}>
                <Image style ={helpBarMapStyle.icon} source={isFollowingUser? navigation_icon :navigation_outline_icon}/>
            </TouchableOpacity>
        </View>
    )
}