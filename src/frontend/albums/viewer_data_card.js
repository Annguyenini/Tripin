import { mediaDataCardStyle } from "../../styles/function/media_data_card"
import { View,TouchableOpacity,Text,Modal,Image } from "react-native"
import Video from 'react-native-video'
import { Gesture,GestureDetector } from "react-native-gesture-handler"
import { useEffect, useState,useRef } from "react"
import AlbumService from "../../backend/album/albumdb"
import { scheduleOnRN } from "react-native-worklets"



export default function MediaViewDataCard({tripName,lat,lng,date,visible,onClose}) {

 const formatted = new Date(Math.floor(date)).toLocaleString()

  return (
        
        <Modal
              animationType="fade"
              transparent={true}
              visible={visible}
              onRequestClose={onClose}
            >
              
           <View style={mediaDataCardStyle.overlayContainer}>
                                
              <View style={mediaDataCardStyle.card}>
              <TouchableOpacity style={mediaDataCardStyle.exitButton} onPress={onClose}>
                <Text style={mediaDataCardStyle.exitText}>X</Text>
              </TouchableOpacity> 
              <Text style={mediaDataCardStyle.tripName}>{tripName}</Text>

              <View style={mediaDataCardStyle.row}>
                <Text style={mediaDataCardStyle.label}>Lat:</Text>
                <Text style={mediaDataCardStyle.value}>{lat}</Text>
              </View>

              <View style={mediaDataCardStyle.row}>
                <Text style={mediaDataCardStyle.label}>Lng:</Text>
                <Text style={mediaDataCardStyle.value}>{lng}</Text>
              </View>

              <View style={mediaDataCardStyle.footer}>
                <Text style={mediaDataCardStyle.date}>{formatted}</Text>
              </View>
            </View>
          </View>

        </Modal>
  
    )
  }