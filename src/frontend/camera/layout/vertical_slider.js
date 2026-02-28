import { View, Text, TouchableOpacity, StyleSheet, PanResponder } from 'react-native';
import { useState, useRef } from 'react';

const HorizontalSlider = ({ value, onChange, min, max, label }) => {
    const SLIDER_WIDTH = 150
    const lastX = useRef(null)

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
            lastX.current = e.nativeEvent.pageX
        },
        onPanResponderMove: (e) => {
            const deltaX = e.nativeEvent.pageX - lastX.current
            lastX.current = e.nativeEvent.pageX
            const range = max - min
            const delta = (deltaX / SLIDER_WIDTH) * range
            const newValue = Math.min(max, Math.max(min, value + delta))
            onChange(newValue)
        },
    })

    const thumbPosition = ((value - min) / (max - min)) * SLIDER_WIDTH

    return (
        <View style={hStyles.wrapper}>
            <Text style={hStyles.label}>{label}: {value.toFixed(1)}</Text>
            <View style={hStyles.track} {...panResponder.panHandlers}>
                <View style={[hStyles.thumb, { left: thumbPosition }]} />
            </View>
        </View>
    )
}
export default HorizontalSlider
const hStyles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        right: 0,
        bottom:'20%'
        
    },
    label: {
        color: '#FFD600',
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 6,
    },
    track: {
        width: 150,
        height: 4,
        backgroundColor: '#555',
        borderRadius: 2,
        position: 'relative',
    },
    thumb: {
        position: 'absolute',
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#FFD600',
        top: '50%',
        marginTop: -7,
        marginLeft: -7,
    }
})