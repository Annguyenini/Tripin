import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CurrentTripDataService from '../../../backend/storage/current_trip'
import CurrentDisplayTripMedia from "./current_display_media_observer";
import { useEffect, useState } from "react";
import LocationDataService from "../../../backend/storage/current_location_data_service";
import { DATA_KEYS } from "../../../backend/storage/keys/storage_keys";

export const TripStatCards = () => {
    const [createdTime, setCreatedTime] = useState(null)
    const [duration, setDuration] = useState({ hours: 0, minutes: 0 })
    const [medias, setMedias] = useState(0)
    const [city, setCity] = useState(null)
    useEffect(() => {
        const fetchDurration = async () => {
            setCreatedTime(CurrentTripDataService.getCurrentCreatedTime())
        }
        const fetchTotalMedia = async () => {
            let totalMedias = CurrentDisplayTripMedia.watchArray(CurrentDisplayTripMedia.GENERATE_KEY(CurrentTripDataService.getCurrentTripId()))
            setMedias(totalMedias.length ?? 0)
        }
        const fetchCurrentCity = async () => {
            let currentCity = await LocationDataService.getCurrentCityFormLocal()
            console.log('city', currentCity)
            setCity(currentCity)
        }
        fetchTotalMedia()
        fetchDurration()
        fetchCurrentCity()
    }, [])
    useEffect(() => {
        const updateDisplayList = {
            update(newAssets) {
                setMedias(newAssets.length ?? 0)
            }
        }
        const updateCity = {
            update(newcity) {
                setCity(newcity)
            }
        }
        CurrentDisplayTripMedia.attach(updateDisplayList, CurrentDisplayTripMedia.GENERATE_KEY(CurrentTripDataService.getCurrentTripId()))
        LocationDataService.attach(updateCity, DATA_KEYS.LOCATION.CITY)
        return () => {
            CurrentDisplayTripMedia.detach(updateDisplayList, CurrentDisplayTripMedia.GENERATE_KEY(CurrentTripDataService.getCurrentTripId()))
            LocationDataService.detach(updateCity, DATA_KEYS.LOCATION.CITY)
        }

    }, [])
    useEffect(() => {

        if (!createdTime) {
            return;
        }
        const interval = setInterval(() => {
            const dur = Date.now() - createdTime
            const hour = dur / 3600000
            const hours_floor = Math.floor(hour)
            const minutes = Math.floor((hour - hours_floor) * 60);
            setDuration({ hours: hours_floor, minutes: minutes })
        }, 1000)
        return () => clearInterval(interval)
    }, [createdTime])
    return (
        <View style={s.statsRow}>

            <View style={[s.statCard, { backgroundColor: '#fde8ef', borderColor: '#f0b8cc' }]}>
                <Text style={s.statEmoji}>🏙️</Text>
                <Text style={[s.statLabel, { color: '#a83058' }]}>Current Location</Text>
                <Text adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.3} style={[s.statValue, { color: '#e07a3a' }]}>{city ?? 'You lost some where'}</Text>
            </View>
            <View style={[s.statCard, { backgroundColor: '#fef3e2', borderColor: '#f5d8a8' }]}>
                <Text style={s.statEmoji}>⏰</Text>
                <Text style={[s.statLabel, { color: '#b86a10' }]}>Duration</Text>
                <Text style={s.statValue}>{duration.hours ?? 0}h {duration.minutes ?? 0}m</Text>
            </View>
            <View style={[s.statCard, { backgroundColor: '#e8f4fd', borderColor: '#b8d8f0' }]}>
                <Text style={s.statEmoji}>📸</Text>
                <Text style={[s.statLabel, { color: '#2a6aaa' }]}>Shots taken</Text>
                <Text style={s.statValue}>{medias ?? 0}</Text>
            </View>
            {/* <View style={[s.statCard, { backgroundColor: '#fde8ef', borderColor: '#f0b8cc' }]}>
                <Text style={s.statEmoji}>🌅</Text>
                <Text style={[s.statLabel, { color: '#a83058' }]}>Days left</Text>
                <Text style={[s.statValue, { color: '#e07a3a' }]}>{4}</Text>
            </View> */}
        </View>)
}

const s = StyleSheet.create({
    statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
    statCard: { flex: 1, borderRadius: 12, borderWidth: 0.5, padding: 10 },
    statEmoji: { fontSize: 18, marginBottom: 4 },
    statLabel: { fontSize: 10, marginBottom: 2, fontFamily: 'DMMono', letterSpacing: 0.4 },
    statValue: { fontSize: 22, color: '#3a2a18', fontFamily: 'DMMono' },
})