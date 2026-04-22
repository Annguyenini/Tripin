import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    Image,
    Linking
} from 'react-native';
import * as Location from "expo-location";

import { Ionicons } from '@expo/vector-icons';
import { GPSStyle, colors } from '../../styles/setting/gps';
import UserDataService from '../../backend/storage/user'
// import { Image } from 'expo-image';
import { ProfileImagePicker } from '../custom_components/profile_image_picker';
const ROW_ICONS = {
    location: { bg: colors.peach, iconColor: colors.peachDark },
    navigate: { bg: colors.sage, iconColor: colors.sageDark },
    flash: { bg: colors.sky, iconColor: colors.skyDark },
    'scan-circle': { bg: colors.lilac, iconColor: colors.lilacDark },
};

function RowItem({ icon, label, value, isLast }) {
    const { bg, iconColor } = ROW_ICONS[icon] || { bg: colors.peach, iconColor: colors.peachDark };
    return (
        <TouchableOpacity
            style={[GPSStyle.row, isLast && { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
            onPress={() => Linking.openSettings()}
        >
            <View style={GPSStyle.rowLeft}>
                <View style={[GPSStyle.rowIcon, { backgroundColor: bg }]}>
                    <Ionicons name={icon} size={15} color={iconColor} />
                </View>
                <Text style={GPSStyle.rowLabel}>{label}</Text>
            </View>
            <View style={GPSStyle.rowRight}>
                <Text style={GPSStyle.rowValue}>{value}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
        </TouchableOpacity>
    );
}

export default function GPSSetting({ onClose }) {
    const [foregroundGranted, setForegroundGranted] = useState(false);
    const [backgroundGranted, setBackgroundGranted] = useState(false);

    useEffect(() => {
        const init = async () => {
            const fg = await Location.requestForegroundPermissionsAsync();
            setForegroundGranted(fg.status === "granted");

            const bg = await Location.requestBackgroundPermissionsAsync();
            setBackgroundGranted(bg.status === "granted");
        };
        init();
    }, []);
    return (

        <ScrollView style={GPSStyle.screen} showsVerticalScrollIndicator={false}>

            <Text style={GPSStyle.header}>GPS</Text>

            <TouchableOpacity style={GPSStyle.closeBtn} onPress={onClose} activeOpacity={0.8}>
                <Ionicons name="close" size={18} color={colors.peachDark} />
            </TouchableOpacity>
            <RowItem icon={'location'} label={'GPS'} value={foregroundGranted ? "on" : 'off'}></RowItem>
            <RowItem icon={'navigate'} label={'Background Tracking'} value={backgroundGranted ? "on" : 'off'}></RowItem>


        </ScrollView>
    );
}