import { StyleSheet } from 'react-native';

export const colors = {
    bg: '#fdf6ee',
    surface: '#f5ece0',
    text: '#2c2a25',
    textMuted: '#9a9080',
    textHint: '#b0a090',
    divider: '#e8ddd0',
    peach: '#f2c4a0',
    peachDark: '#7a4a2a',
    peachMid: '#e8a87c',
    sage: '#b8d4b8',
    sageDark: '#2a5a2a',
    sky: '#b8d4e8',
    skyDark: '#2a5a7a',
    lilac: '#d4b8e0',
    lilacDark: '#5a2a7a',
    rose: '#e8b8c4',
    roseDark: '#7a2a3a',
};

export const profileStyle = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    header: {
        paddingTop: 56,
        paddingHorizontal: 20,
        paddingBottom: 16,
        fontFamily: 'PermanentMarker-Regular',
        fontSize: 22,
        color: colors.text,
    },
    avatarImage: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
    closeBtn: {
        position: 'absolute',
        top: 52,
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.peach,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // avatar section
    avatarSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 32,
        gap: 14,
    },
    avatarRing: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: colors.peach,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        fontFamily: 'PermanentMarker-Regular',
        fontSize: 15,
        color: colors.peachDark,
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.peachMid,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    displayName: {
        fontFamily: 'PermanentMarker-Regular',
        fontSize: 20,
        color: colors.text,
    },
    username: {
        fontFamily: 'DMMono-Regular',
        fontSize: 12,
        color: colors.textMuted,
        letterSpacing: 1,
    },
    editBtn: {
        backgroundColor: colors.peach,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 14,
    },
    editBtnText: {
        fontFamily: 'DMMono-Regular',
        fontSize: 12,
        color: colors.peachDark,
    },

    // divider
    divider: {
        height: 0.5,
        backgroundColor: colors.divider,
        marginHorizontal: 20,
    },

    // section
    section: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionLabel: {
        fontFamily: 'DMMono-Regular',
        fontSize: 10,
        color: colors.textHint,
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 12,
    },

    // row
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.divider,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rowIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowLabel: {
        fontFamily: 'DMMono-Regular',
        fontSize: 14,
        color: colors.text,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rowValue: {
        fontFamily: 'DMMono-Regular',
        fontSize: 12,
        color: colors.textMuted,
    },
});