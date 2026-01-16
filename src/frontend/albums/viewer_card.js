import { mediaCardStyle } from "../../styles/function/media_card"
import { View,TouchableOpacity,Text,Modal,Image } from "react-native"
import Video from 'react-native-video'
export default function MediaViewCard({title,uri,type,visible,onClose}) {
    return (
        <Modal
              animationType="fade"
              transparent={true}
              visible={visible}
              onRequestClose={onClose}
            >
        <View style={mediaCardStyle.overlayContainer}>
            <View style={mediaCardStyle.card}>
              <TouchableOpacity style={mediaCardStyle.exitButton} onPress={onClose}>
                <Text style={mediaCardStyle.exitText}>X</Text>
              </TouchableOpacity>
              {type ==="photo" ? <Image style ={mediaCardStyle.image} source ={{uri:uri}}></Image> 
              : <Video
                style ={mediaCardStyle.video}
                source={{uri:uri}}
                controls={true}       // shows play/pause
                resizeMode="cover"
                paused={true}>

                </Video>
              
              }
            </View>
          </View>
          </Modal>
    )
}