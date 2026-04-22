import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { profileStyle, colors } from '../../styles/setting/profile';
import UserDataService from '../../backend/storage/user'
// import { Image } from 'expo-image';
import { ProfileImagePicker } from '../custom_components/profile_image_picker';
const ROW_ICONS = {
    person: { bg: colors.peach, iconColor: colors.peachDark },
    mail: { bg: colors.sky, iconColor: colors.skyDark },
    'lock-closed': { bg: colors.sage, iconColor: colors.sageDark },
    notifications: { bg: colors.lilac, iconColor: colors.lilacDark },
    eye: { bg: colors.rose, iconColor: colors.roseDark },
};

function RowItem({ icon, label, value, isLast }) {
    const { bg, iconColor } = ROW_ICONS[icon] || { bg: colors.peach, iconColor: colors.peachDark };
    return (
        <TouchableOpacity
            style={[profileStyle.row, isLast && { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
        >
            <View style={profileStyle.rowLeft}>
                <View style={[profileStyle.rowIcon, { backgroundColor: bg }]}>
                    <Ionicons name={icon} size={15} color={iconColor} />
                </View>
                <Text style={profileStyle.rowLabel}>{label}</Text>
            </View>
            <View style={profileStyle.rowRight}>
                <Text style={profileStyle.rowValue}>{value}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
        </TouchableOpacity>
    );
}

export default function ProfileScreen({ onClose }) {
    const [userName, setUserName] = useState(UserDataService.getUserName() ?? null)
    const [displayName, setdisplayName] = useState(UserDataService.getDisplayName() ?? null)
    const [profileImageUri, setProfileImageUri] = useState(UserDataService.getProfileImageUri() ?? null)
    const [avatarPickerVisible, setAvatarPickerVisible] = useState(false)
    return (

        <ScrollView style={profileStyle.screen} showsVerticalScrollIndicator={false}>

            <Text style={profileStyle.header}>profile</Text>
            <TouchableOpacity style={profileStyle.closeBtn} onPress={onClose} activeOpacity={0.8}>
                <Ionicons name="close" size={18} color={colors.peachDark} />
            </TouchableOpacity>
            {/* avatar */}
            <View style={profileStyle.avatarSection}>
                <View style={profileStyle.avatarRing}>
                    {profileImageUri && <Image source={{ uri: profileImageUri }} style={profileStyle.avatarImage} />}
                    {!profileImageUri && <Text style={profileStyle.avatarInitials}>TRIPPER</Text>}
                    <TouchableOpacity style={profileStyle.editAvatarBtn} activeOpacity={0.8} onPress={() => setAvatarPickerVisible(true)}>
                        <Ionicons name="pencil" size={13} color={colors.peachDark} />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', gap: 4 }}>
                    <View style={profileStyle.nameRow}>
                        <Text style={profileStyle.displayName}>{displayName}</Text>
                        {/* <TouchableOpacity style={profileStyle.editBtn} activeOpacity={0.8}>
                            <Text style={profileStyle.editBtnText}>edit</Text>
                        </TouchableOpacity> */}
                    </View>
                    <Text style={profileStyle.username}>@{userName}</Text>
                </View>
            </View>

            <View style={profileStyle.divider} />

            {/* account section */}
            <View style={profileStyle.section}>
                <Text style={profileStyle.sectionLabel}>account</Text>
                {/* {ACCOUNT_ROWS.map((row, i) => (
                    <RowItem
                        key={row.label}
                        {...row}
                        isLast={i === ACCOUNT_ROWS.length - 1}
                    />
                ))} */}
                <RowItem icon={'person'} label={'Display Name'} value={displayName}></RowItem>
            </View>

            <View style={[profileStyle.divider, { marginTop: 24 }]} />

            {/* preferences section */}
            {/* <View style={profileStyle.section}>
                <Text style={profileStyle.sectionLabel}>preferences</Text>
                {PREFERENCE_ROWS.map((row, i) => (
                    <RowItem
                        key={row.label}
                        {...row}
                        isLast={i === PREFERENCE_ROWS.length - 1}
                    />
                ))}
            </View> */}
            <Modal
                visible={avatarPickerVisible}
                animationType="slide"
            >
                <ProfileImagePicker onClose={() => setAvatarPickerVisible(false)}></ProfileImagePicker>
            </Modal>
        </ScrollView>
    );
}