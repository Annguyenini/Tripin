import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { View, Dimensions, Text, StyleSheet } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from "react-native-vision-camera";
import Animated, {
  useSharedValue,
  clamp,
  useDerivedValue,
} from "react-native-reanimated";
import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as MediaLibrary from "expo-media-library";

const AnimatedCamera = Animated.createAnimatedComponent(Camera);

import { cameraStyle } from "../../styles/camera_style";
import { navigate } from "../navigation/navigationService";
import AlbumService from "../../backend/storage/album/album";
import { Linking } from "react-native";

import TopBarCamera from "./layout/top_bar";
import PermissionLayout from "./layout/permission";
import BotBarControl from "./layout/bot_bar";
import ZoomText from "./layout/zoom_text";
import useCameraCapture from "./camera_setting/use_camera_capture";
import useCameraZoom from "./camera_setting/use_camera_zoom";
import CameraSetting from "./layout/camera_setting_bar";
// import {microphonePermission} from 'expo-audio'
import { Audio } from "expo-av";
import HorizontalSlider from "./layout/vertical_slider";
import { generateOrGetThumbnailFromMediaId } from "../../backend/media/generate_thumbnail";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
const { width, height } = Dimensions.get("window");

const exitCamera = () => navigate("Main");

export const CameraApp = ({ onClose }) => {
  const cameraRef = useRef(null);
  const [error, setError] = useState(null);

  // permissions
  const [cameraPermission, requestcameraPermission] = useCameraPermissions();
  const [albumPermission, requestAlbumPermission] =
    MediaLibrary.usePermissions();
  const [hasMicrophonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();
  // camera device
  const RequestMicrophonePermission = async () => {
    const request = await requestAlbumPermission();
    if (!request.canAskAgain) {
      Linking.openSettings();
    }
    onClose();
  };
  const [facing, setFacing] = useState("back");
  const device = useCameraDevice(facing, {
    physicalDevices: [
      "ultra-wide-angle-camera",
      "wide-angle-camera",
      "telephoto-camera",
    ],
  });
  const [flash, setFlash] = useState("off");
  const toggleFlash = (value) => {
    if (device?.hasFlash && (value === "on" || value === "auto")) {
      setFlash(value);
    } else {
      setFlash("off");
    }
  };
  const [isCameraReady, setCameraReady] = useState(false);
  // album
  const [image_icon, setImage_icon] = useState(null);
  const [imageIconType, setImageIconType] = useState(null);
  // capture
  const { currentMode, toggleCameraMode, recording, shutterButtonAction } =
    useCameraCapture(
      cameraRef,
      isCameraReady,
      flash,
      setError,
      hasMicrophonePermission,
    );
  // zoom
  const { onZoom, onZoomEnd, zoom, zoomText } = useCameraZoom(device);

  // exposure
  const [exposure, setExposure] = useState(0);
  // format
  const format = useCameraFormat(device, [{ fps: 60 }]);
  // active filter
  const [filter, setFilter] = useState(null);

  // filter intensity
  const [filterIntensity, setFilterIntensity] = useState(1);
  // frame filter
  // const frameProcessor = useFrameFilter(filter,filterIntensity)
  useEffect(() => {});
  useEffect(() => {
    const fetchImages = async () => {
      const recentImageAsset = AlbumService.AlbumsArray[0];
      if (!recentImageAsset) return;

      if (recentImageAsset.media_type === "video") {
        const thumbnail = await generateOrGetThumbnailFromMediaId(
          recentImageAsset.media_id,
          recentImageAsset.media_path,
        );
        setImage_icon(thumbnail);
      } else {
        setImage_icon(recentImageAsset.media_path);
      }

      setImageIconType(recentImageAsset.media_type);
    };
    const updateImages = {
      async update(newArray) {
        const recentImageAsset = newArray[0];
        if (!recentImageAsset) return;

        if (recentImageAsset.media_type === "video") {
          const thumbnail = await generateOrGetThumbnailFromMediaId(
            recentImageAsset.media_id,
            recentImageAsset.media_path,
          );
          setImage_icon(thumbnail);
        } else {
          setImage_icon(recentImageAsset.media_path);
        }

        setImageIconType(recentImageAsset.media_type);
      },
    };
    AlbumService.attach(updateImages);
    fetchImages();
    return () => AlbumService.detach(updateImages);
  }, []);

  const onCameraReady = useCallback(() => {
    setCameraReady(true);
  }, []);

  // gesture pinch
  const zoomPinch = Gesture.Pinch().onUpdate(onZoom).onEnd(onZoomEnd);

  return (
    <View style={cameraStyle.container}>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText} numberOfLines={2}>
            {error}
          </Text>
          <TouchableOpacity onPress={() => setError(null)}>
            <Text style={styles.errorBannerDismiss}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
      {!cameraPermission?.granted ? (
        <>
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              {!cameraPermission?.granted && (
                <Text style={styles.permissionText}>
                  {
                    "Camera permission is disabled.\nThere is no other way to use the camera without this permission.\n\n"
                  }
                </Text>
              )}
              {!hasMicrophonePermission?.granted && (
                <Text style={styles.permissionText}>
                  {
                    "Microphone permission is disabled.\nThere is no other way to record video without this permission."
                  }
                </Text>
              )}
            </Text>

            <TouchableOpacity
              onPress={() => Linking.openSettings()}
              style={styles.borderedButton}
            >
              <Text style={styles.borderedButtonText}>Open Settings</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <GestureDetector gesture={zoomPinch}>
            <View style={{ flex: 1 }}>
              <AnimatedCamera
                ref={cameraRef}
                device={device}
                isActive={true}
                style={{ flex: 1 }}
                zoom={zoom}
                onInitialized={onCameraReady}
                photo={true}
                video={true}
                audio={true}
                exposure={exposure}
                // frameProcessor={frameProcessor}
              />
            </View>
          </GestureDetector>
          <TopBarCamera
            exitCamera={onClose}
            cameraPermission={cameraPermission}
            requestcameraPermission={requestcameraPermission}
            albumPermission={albumPermission}
            requestAlbumPermission={requestAlbumPermission}
            microphonePermission={hasMicrophonePermission}
            requestMicrophonePermission={RequestMicrophonePermission}
          />
          <CameraSetting
            flash={flash}
            setFlash={toggleFlash}
            facing={facing}
            setFacing={setFacing}
          />
          <View style={cameraStyle.middleBar}>
            <ZoomText zoom={zoomText / 10} />
          </View>
          <HorizontalSlider
            value={exposure}
            onChange={setExposure}
            min={device.minExposure}
            max={device.maxExposure}
            label={"exposure"}
          />

          <View>
            <BotBarControl
              toggleCameraMode={toggleCameraMode}
              shutterButtonAction={shutterButtonAction}
              currentMode={currentMode}
              recording={recording}
              image_icon={image_icon}
              type={imageIconType}
            />
          </View>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  permissionText: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    lineHeight: 20,
  },
  borderedButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "transparent",
  },
  borderedButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
