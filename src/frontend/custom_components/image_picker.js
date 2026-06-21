import * as ImagePicker from "expo-image-picker";

export const imagePicker = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    return result;
  } else {
    alert("You did not select any image.");
    return null;
  }
};
export const imageVideoPicker = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    allowsEditing: false,
    quality: 1,
    exif: true,
  });

  if (!result.canceled) {
    return result;
  } else {
    alert("You did not select any image.");
    return null;
  }
};

export const takePicture = async () => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return;

  const result = await ImagePicker.launchCameraAsync({
    quality: 1,
  });

  if (!result.canceled) {
    return result;
  }
};

export const photoVideoCamera = async () => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
  });
  if (!result.canceled) {
    return result;
  }
};
