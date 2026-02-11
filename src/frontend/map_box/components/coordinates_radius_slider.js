
import React, { useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import radius_selector_style from "../../../styles/function/radius_selector_style";
import eventBus from "../../../backend/services/UI_event_bus";
const values = [0, 20, 40, 60, 80, 100];

const RadiusSelector = () => {
  const [selected, setSelected] = useState(eventBus.getValueFromKey('RadiusChange'));
  const changeRadius =(val)=>{
    eventBus.emit('RadiusChange',val)
    setSelected(val)
  }
  return (
    <View style={radius_selector_style.container}>
      <Text style={radius_selector_style.valueText}>Coordiantes Marker Grouping Radius Value: {selected}m</Text>

      <View style={radius_selector_style.buttonRow}>
        {values.map((val) => (
          <TouchableOpacity
            key={val}
            style={[
              radius_selector_style.button,
              selected === val && radius_selector_style.activeButton,
            ]}
            onPress={() => changeRadius(val)}
          >
            <Text
              style={[
                radius_selector_style.buttonText,
                selected === val && radius_selector_style.activeButtonText,
              ]}
            >
              {val}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default RadiusSelector;
