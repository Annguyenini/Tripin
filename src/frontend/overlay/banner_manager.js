import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, Pressable, Linking, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import Permission from "../../backend/storage/settings/permissions";
import network_observer from "../../app-core/flow/sync/network_observer";
import { _registerNetworkCallback } from "../../app-core/flow/sync/network_observer";
import { _registerSyncingCallback } from "../../app-core/flow/sync/trip_contents_sync_manager";
import { SyncBanner } from "./syncing_banner";
import { SatelliteOffIcon, SatelliteOnIcon } from "../../styles/icons/satellite";
import { LocationOnIcon, LocationOffIcon } from "../../styles/icons/navigation";
// individual banner types

const OfflineBanner = () => (
    <View style={styles.banner}>
        <View style={styles.wifiIcon}>
            <View style={[styles.arc, styles.arc1]} />
            <View style={[styles.arc, styles.arc2]} />
            <View style={styles.wifiDot} />
            <View style={styles.slash} />
        </View>
        <View>
            <Text style={styles.bannerTitle}>Offline</Text>
            <Text style={styles.bannerSub}>
                Not from the world —{' '}
                <Text style={styles.bannerSubAccent}>just the server.</Text>

            </Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => network_observer.callServer()}>
                <Text style={styles.retryText}>Wake them up</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const LocationBanner = ({ text }) => (
    <View style={styles.banner}>
        <Text style={styles.text}>{text}</Text>
        <Pressable
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
            onPress={() => Linking.openSettings()}
        >
            <Text style={styles.buttonText}>Enable</Text>
        </Pressable>
    </View>
);

// main manager — stacks banners vertically, only shows what's needed
export const BannerManager = () => {
    const [foregroundGranted, setForegroundGranted] = useState(false);
    const [backgroundGranted, setBackgroundGranted] = useState(false);
    const [isOffline, setIsOffline] = useState(network_observer.isReachable)
    const [sync, setSync] = useState(false)
    useEffect(() => {
        const init = async () => {
            const fg = await Location.requestForegroundPermissionsAsync();
            setForegroundGranted(fg.status === "granted");
            await Permission.setForeGroundPer(fg.status === "granted" ? "true" : "false");

            const bg = await Location.requestBackgroundPermissionsAsync();
            setBackgroundGranted(bg.status === "granted");
            await Permission.setBackGroundPer(bg.status === "granted" ? "true" : "false");
        };
        init();
        _registerNetworkCallback(setIsOffline)
        _registerSyncingCallback(setSync)
    }, []);

    const hasAnything = !foregroundGranted || !backgroundGranted;
    if (!hasAnything) return null;

    return (
        <View style={styles.wrapper} pointerEvents="box-none">
            {!isOffline && <OfflineBanner />}
            {!foregroundGranted && (
                <View style={styles.banner}>
                    <LocationOffIcon></LocationOffIcon>
                    <Text style={styles.text}>I mean how the map suppost to work with out Location?</Text>
                </View>
            )}
            {!backgroundGranted && (
                <View style={styles.banner}>
                    <SatelliteOffIcon></SatelliteOffIcon>
                </View>
            )}
            {backgroundGranted && (
                <View style={styles.banner}>
                    <SatelliteOnIcon></SatelliteOnIcon>
                </View>
            )}
            {

            }
            <SyncBanner visible={sync}></SyncBanner>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        top: Platform.OS === "ios" ? 50 : 20,
        left: 12,
        zIndex: 1000,
        gap: 6,
    },
    banner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1917",
        borderWidth: 1,
        borderColor: "#2e2c29",
        borderRadius: 10,
        paddingVertical: 7,
        paddingHorizontal: 12,
        gap: 8,
    },
    retryText: {
        fontFamily: 'DMMono', fontSize: 10,
        color: '#a09e99', marginTop: 4,
    },
    retryBtn: {
        marginTop: 6,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#2e2c29',
        alignSelf: 'flex-start',
        backgroundColor: '#ffffff00'
    },
    // offline wifi icon
    wifiIcon: {
        width: 16, height: 14,
        alignItems: "center", justifyContent: "flex-end",
        gap: 2, position: "relative",
    },
    arc: {
        borderWidth: 1.5, borderColor: "#3a3835",
        borderBottomWidth: 0, borderRadius: 20,
    },
    arc1: { width: 16, height: 8 },
    arc2: { width: 10, height: 5 },
    wifiDot: {
        width: 3, height: 3, borderRadius: 2,
        backgroundColor: "#f0f0ec", opacity: 0.4,
    },
    slash: {
        position: "absolute", width: 1.5, height: 18,
        backgroundColor: "#6b6860", borderRadius: 1,
        transform: [{ rotate: "25deg" }],
        top: -2, left: 7,
    },
    bannerTitle: {
        fontFamily: "DMMono", fontSize: 12,
        color: "#f0f0ec", fontWeight: "600",
    },
    bannerSub: {
        fontFamily: "DMMono", fontSize: 10,
        color: "#6b6860", marginTop: 2, lineHeight: 14,
    },
    bannerSubAccent: { color: "#a09e99" },
    // location banner
    text: {
        fontFamily: "DMMono", fontSize: 11,
        color: "#f0f0ec",
    },
    button: {
        backgroundColor: "#f0f0ec",
        paddingVertical: 3, paddingHorizontal: 8,
        borderRadius: 6,
    },
    buttonText: {
        fontFamily: "DMMono",
        color: "#0d0c0a", fontWeight: "600", fontSize: 11,
    },
});