import { View, Image, TouchableOpacity, Text } from "react-native";
import { OverlayCard } from "../overlay/overlay_card";
import { profileImagePicker } from "../../styles/function/profile_image_picker_style";
import { imagePicker, takePicture } from "./image_picker";
import { useState } from "react";
import UserDataService from "../../backend/storage/database/user";
import UserService from "../../backend/services/user";
import UserHandler from "../../app-core/flow/user_handler";
import { UseOverlay } from "../overlay/overlay_main";
export const ProfileImagePicker = ({ onClose }) => {
  const { showLoading, hideLoading, showErrorBox } = UseOverlay();
  const previousImage = UserDataService.getProfileImageUri();
  const [imageUri, setImageUri] = useState(
    UserDataService.getProfileImageUri(),
  );
  const callImagePicker = async () => {
    const pic = await imagePicker();
    setImageUri(pic.assets[0].uri);
  };
  const callCamera = async () => {
    const pic = await takePicture();
    setImageUri(pic.assets[0].uri);
  };
  const updateUserProfileImage = async () => {
    if (imageUri === previousImage) return;
    showLoading();
    const respond = await UserHandler.ChangeUserUserAvatarHandler(imageUri);
    hideLoading();
    if (!respond.ok || respond.status !== 200) {
      showErrorBox(
        "Error",
        "Error with update avartar, please try again shortly",
        6000,
      );
    }
    onClose(false);
  };
  return (
    <OverlayCard title={"Choose you profile"} onClose={() => onClose(false)}>
      <View style={profileImagePicker.imageFrame}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={profileImagePicker.image} />
        ) : (
          <Text style={profileImagePicker.placeholder}>No image</Text>
        )}
      </View>

      <View style={profileImagePicker.imageButtons}>
        <TouchableOpacity
          style={profileImagePicker.secondaryButton}
          onPress={callImagePicker}
        >
          <Text style={profileImagePicker.secondaryButtonText}>
            Choose Image
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={profileImagePicker.secondaryButton}
          onPress={callCamera}
        >
          <Text style={profileImagePicker.secondaryButtonText}>
            Take Picture
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={profileImagePicker.submitButton}
        onPress={updateUserProfileImage}
      >
        <Text style={profileImagePicker.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </OverlayCard>
  );
};
