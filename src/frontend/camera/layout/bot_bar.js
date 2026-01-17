
import { View, Text, TouchableOpacity,Image } from 'react-native';
import { cameraStyle,camera_zoom } from '../../../styles/camera_style.js';
import MediaViewCard from '../../albums/viewer_card.js';
import { useState } from 'react';
const cameraSetting_icon = require('../../../../assets/image/camera_setting.png');

const BotBarControl = ({currentMode,recording,image_icon,type,shutterButtonAction})=>{
  const [visible,setVisible]=useState(false)

    return(<View style={cameraStyle.botControls}>
            <TouchableOpacity style={cameraStyle.flipButton}>
              <Image source={cameraSetting_icon} style={[cameraStyle.icon, { width: 50, height: 50 }]} />
            </TouchableOpacity>
    
    
           
    
    
            <TouchableOpacity style={cameraStyle.outerCircle} onPress={shutterButtonAction} >
              <Text style={[cameraStyle.innerCircle, {backgroundColor: currentMode === "picture"? "white": "red"},
                {width: recording && currentMode==='video'? 30:60},
                {height: recording && currentMode==='video'? 30:60}]} > </Text>
            </TouchableOpacity>
            <TouchableOpacity >
            </TouchableOpacity>
            <TouchableOpacity style={cameraStyle.flipButton} onPress={()=>setVisible(true)}>
              <Image source={{ uri: image_icon }} style={[cameraStyle.icon, { width: 70, height: 70 }]} />
            </TouchableOpacity>
            {visible && <MediaViewCard title={'test'} uri={image_icon} type ={type} visible={visible} onClose={()=>setVisible(false)}></MediaViewCard>}
          </View>)
}

export default BotBarControl