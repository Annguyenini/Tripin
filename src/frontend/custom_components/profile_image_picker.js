import { View,Image,TouchableOpacity,Text } from "react-native"
import { OverlayCard } from "../custom_function/overlay_card"
import {profileImagePicker} from '../../styles/function/profile_image_picker_style'
import { imagePicker,takePicture } from "../functions/image_picker"
import {  useState } from "react"
import UserDataService from '../../backend/storage/user'
import UserService from '../../backend/services/user'
export const ProfileImagePicker =({set_show_profile_picker})=>{
    const[imageUri,setImageUri] =useState(UserDataService.getProfileImageUri())
    const callImagePicker = async()=>{
        const pic = await imagePicker()
        setImageUri(pic.assets[0].uri)
      }
    const callCamera = async() =>{
        const pic = await takePicture()
        setImageUri(pic.assets[0].uri)
    }
    const updateUserProfileImage =async()=>{
      const respond = await UserService.updateUserProfileImage(imageUri)
      if(respond.ok){
        await UserDataService.setProfileImageUri(imageUri);
        set_show_profile_picker(false)
      }
    }
    return (
        <OverlayCard title={'Choose you profile'} onClose={()=>set_show_profile_picker(false)}>
            <View style={profileImagePicker.imageFrame}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={profileImagePicker.image} />
                  ) : (
                    <Text style={profileImagePicker.placeholder}>No image</Text>
                  )}
                </View>
            
                <View style={profileImagePicker.imageButtons}>
                  <TouchableOpacity style={profileImagePicker.secondaryButton} onPress={callImagePicker}>
                    <Text style={profileImagePicker.secondaryButtonText}>Choose Image</Text>
                  </TouchableOpacity>
            
                  <TouchableOpacity style={profileImagePicker.secondaryButton} onPress={callCamera}>
                    <Text style={profileImagePicker.secondaryButtonText}>Take Picture</Text>
                  </TouchableOpacity>
                </View>
            
                <TouchableOpacity style={profileImagePicker.submitButton} onPress={updateUserProfileImage}>
                  <Text style={profileImagePicker.submitButtonText}>Submit</Text>
                </TouchableOpacity>
        </OverlayCard>
    ) 
}