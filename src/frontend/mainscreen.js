import React, { useState } from 'react';
import {Image} from 'react-native'
import { View, TouchableOpacity, Text, TextInput,Alert, StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {mainScreenStyle,footer} from './style.js'
import { Button } from 'react-native-web';
const homeIcon = require('../../assets/image/home_icon.png')
const cameraIcon = require('../../assets/image/camera_icon.png')
const galleryIcon = require('../../assets/image/gallery_icon.png')
export const MainScreen = () =>{
    return(
        <SafeAreaProvider>
  <SafeAreaView style={{ flex: 1 }}>
    <View style={mainScreenStyle.container}>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={mainScreenStyle.scrollContent}>
        <View style={mainScreenStyle.curentTripZone}>
          <View style={mainScreenStyle.row}>
            <Text style={mainScreenStyle.title}>Current Trip</Text>
            <TouchableOpacity style={mainScreenStyle.button}>
              <Text style={mainScreenStyle.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
       {/* {showCurrentTrip&&()} */}
        <View style={mainScreenStyle.alltrip}>
          <Text style={mainScreenStyle.allTripTitle}>Browse All Trip</Text>
        </View>
         {/* {showAllTrips&&()} */}
        {/* Extra bottom padding so last content isn’t hidden behind toolbar */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Sticky bottom toolbar — outside ScrollView */}
      <View style={footer.footerContainer}>
        <View style={footer.fotterrow}>
        <TouchableOpacity style={footer.fotterbutton}>
            <Image source = {homeIcon} style ={footer.fottericon}/>
        </TouchableOpacity>
        <TouchableOpacity style={footer.fotterbutton}>
            <Image source = {cameraIcon} style ={footer.fottericon}/>
        </TouchableOpacity>
        <TouchableOpacity style={footer.fotterbutton}>
            <Image source = {galleryIcon} style ={footer.fottericon}/>
        </TouchableOpacity>
      </View>
        </View>
    </View>
  </SafeAreaView>
</SafeAreaProvider>

    )
};

