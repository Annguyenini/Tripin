
import { View, Text, TouchableOpacity,Image } from 'react-native';
import { cameraStyle,camera_zoom } from '../../../styles/camera_style.js';
import MediaViewCard from '../../albums/viewer_card.js';
import { useRef, useState } from 'react';
import AlbumService from '../../../backend/album/albumdb.js'
const cameraSetting_icon = require('../../../../assets/image/camera_setting.png');

const BotBarControl = ({toggleCameraMode,recording,image_icon,type,shutterButtonAction})=>{
  const [visible,setVisible]=useState(false)
  const [currentMode,setCurrentMode]=useState('photo')
  const isRecording = useRef(false)
  const LongClick =()=>{
    isRecording.current = true
    setCurrentMode('video')
    shutterButtonAction('video')
  }
  const stopLongClick =()=>{
    if(! isRecording.current) return
    shutterButtonAction('video')
    isRecording.current = false
    setCurrentMode('photo')


  }
  const click=()=>{
    
    shutterButtonAction('photo')
  }
  // const 
    return(<View style={cameraStyle.botControls}>
            <TouchableOpacity style={cameraStyle.flipButton}>
              <Image source={cameraSetting_icon} style={[cameraStyle.icon, { width: 50, height: 50 }]} />
            </TouchableOpacity>
    
    
           
    
    
            <TouchableOpacity style={cameraStyle.outerCircle} onPress={click} onLongPress={LongClick} onPressOut={stopLongClick}     activeOpacity={0.7} delayLongPress={300}
>
              <Text style={[cameraStyle.innerCircle, {backgroundColor: currentMode === "photo"? "white": "red"}]} > </Text>
            </TouchableOpacity>
            <TouchableOpacity >
            </TouchableOpacity>
            <TouchableOpacity style={cameraStyle.flipButton} onPress={()=>setVisible(true)}>
              <Image source={{ uri: image_icon }} style={[cameraStyle.icon, { width: 70, height: 70 }]} />
            </TouchableOpacity>
            {visible && <MediaViewCard title={'test'} uri={image_icon} type ={type} visible={visible} onClose={()=>setVisible(false)} AssetArray={AlbumService.AlbumsArray}></MediaViewCard>}
          </View>)
}

export default BotBarControl