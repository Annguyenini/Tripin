import { overlayCardStyle } from "../../styles/function/overlay_card.js";
import { View,TouchableOpacity,TextInput,Text } from "react-native";
export const OverlayCard = ({ title, children, onClose }) => (
  <View style={overlayCardStyle.overlayContainer}>
    <View style={overlayCardStyle.card}>
      <TouchableOpacity style={overlayCardStyle.exitButton} onPress={onClose}>
        <Text style={overlayCardStyle.exitText}>X</Text>
      </TouchableOpacity>
      <Text style={overlayCardStyle.title}>{title}</Text>
      {children}
    </View>
  </View>
);