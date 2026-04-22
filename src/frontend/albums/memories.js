import React, { useEffect, useMemo, useState } from 'react';
import CurrentDisplayTripMediaObserver from '../map_box/functions/current_display_media_observer';
import CurrentTripDataService from '../../backend/storage/current_trip';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Platform,
} from 'react-native';
import Svg, { Line, Path, Defs, Marker } from 'react-native-svg';
import { Image } from 'expo-image';
import Video from 'react-native-video';

const { width: SW, height: SH } = Dimensions.get('window');

const BG = 'rgba(255, 252, 245, 0.95)';
const TEXT_PRIMARY = '#000000';
const TEXT_MUTED = '#555';
const ACCENT = '#000000';
const STRING_COLOR = '#c8b070';
const TAPE_COLOR = '#e8d5a8';

const STRING_Y = 30;
const CARD_W = 88;
const CARD_H = 110;
const HANG_LEN = 90;
const SLOT_W = 160;
const GALLERY_H = SH * 0.3;
const GALLERY_W = SW;

const mono = Platform.OS === 'ios' ? 'Courier New' : 'monospace';
const serif = Platform.OS === 'ios' ? 'Georgia' : 'serif';

function cardCenter(locationArray, index) {
    const slotLeft = index * SLOT_W + 36;
    const cardTop = locationArray[index].hang ? STRING_Y + HANG_LEN : STRING_Y;
    return {
        x: slotLeft + CARD_W / 2,
        y: cardTop + CARD_H / 2,
    };
}

function GalleryOverlay({ width, locationArray }) {
    return (
        <Svg
            width={width}
            height={GALLERY_H}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
        >
            <Defs>
                <Marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <Path d="M0,0 L6,3 L0,6 Z" fill={ACCENT} opacity="0.7" />
                </Marker>
            </Defs>

            <Line
                x1="0" y1={STRING_Y}
                x2={width} y2={STRING_Y}
                stroke={STRING_COLOR} strokeWidth="1.5" opacity="0.5"
            />

            {locationArray.map((loc, i) =>
                loc.hang ? (
                    <Line
                        key={`thread-${i}`}
                        x1={i * SLOT_W + 36 + CARD_W / 2} y1={STRING_Y + 8}
                        x2={i * SLOT_W + 36 + CARD_W / 2} y2={STRING_Y + HANG_LEN}
                        stroke={STRING_COLOR} strokeWidth="1" opacity="0.4"
                    />
                ) : null
            )}

            {locationArray.map((loc, i) => {
                if (i === locationArray.length - 1) return null;
                const from = cardCenter(locationArray, i);
                const to = cardCenter(locationArray, i + 1);
                const x1 = from.x + CARD_W / 2 - 4;
                const y1 = from.y;
                const x2 = to.x - CARD_W / 2 + 4;
                const y2 = to.y;
                const cpx = (x1 + x2) / 2;
                const cpy = Math.min(y1, y2) - 40;
                return (
                    <Path
                        key={`arrow-${i}`}
                        d={`M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`}
                        fill="none"
                        stroke={ACCENT}
                        strokeWidth="1"
                        strokeDasharray="5 4"
                        opacity="0.55"
                        markerEnd="url(#arrow)"
                    />
                );
            })}
        </Svg>
    );
}

function PolaroidCard({ location, index, onPress }) {
    const slotLeft = index * SLOT_W + 36;
    const cardTop = location.hang ? STRING_Y + HANG_LEN : STRING_Y;
    const rot = location.rot ?? (index % 2 === 0 ? -5 : 5);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.cardSlot, { left: slotLeft }]}
        >
            <View style={[styles.tape, { top: STRING_Y - 8, left: CARD_W / 2 - 13 }]} />

            <View style={[styles.polaroid, { top: cardTop, transform: [{ rotate: `${rot}deg` }] }]}>
                {location.medias?.[0]?.media_path ? (


                    location.medias?.[0]?.media_type === 'video' ? (
                        <Video
                            cachePolicy='memory-disk'
                            source={{ uri: location.medias[0].media_path }}
                            style={styles.photoArea}
                        />)
                        : (<Image
                            cachePolicy="memory-disk"
                            source={{ uri: location.medias[0].media_path }}
                            style={styles.photoArea}
                            contentFit="cover"
                        />)
                ) : (
                    <View style={[styles.photoArea, { backgroundColor: '#ccc' }]} />
                )}
                <View style={styles.cardBottom}>
                    <Text style={styles.cardCity} numberOfLines={1}>
                        {location.city.toLowerCase()}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function PhotoSheet({ location, onClose }) {
    const FRAME_H = 160;
    const FRAME_W = 120;
    const HOLE_H = 7;
    const HOLE_W = 10;
    const holes = Array.from({ length: 5 });

    const SprocketRow = () => (
        <View style={{ justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 5, height: FRAME_H }}>
            {holes.map((_, i) => <View key={i} style={styles.hole} />)}
        </View>
    );

    return (
        <View style={styles.overlay}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
            <View style={styles.sheet}>
                <View style={styles.sheetHandle} />
                <View style={styles.sheetHeader}>
                    <Text style={styles.sheetCity}>{location.city}</Text>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={styles.closeTxt}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Film strip */}
                <View style={styles.filmStrip}>
                    <SprocketRow />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.frames}
                    >
                        {location.medias.map((media, i) => (
                            <View key={media.media_path ?? i} style={styles.frame}>
                                {
                                    media.media_type === 'video' ?
                                        (<Video
                                            cachePolicy='memory-disk'
                                            source={{ uri: media.media_path }}
                                            style={styles.photoArea}
                                            repeat={true}
                                        />) :
                                        (<Image
                                            cachePolicy="memory-disk"
                                            source={{ uri: media.media_path }}
                                            style={StyleSheet.absoluteFill}
                                            contentFit="cover"
                                        />)
                                }
                                <Text style={styles.frameNum}>{String(i + 1).padStart(2, '0')}</Text>
                            </View>
                        ))}
                    </ScrollView>
                    <SprocketRow />
                </View>
            </View>
        </View>
    );
}

export default function PolaroidGallery() {
    const [selectedCity, setSelectedCity] = useState(null);
    const [locationArray, setLocationArray] = useState([])
    const [displayMedias, setDisplayMedias] = useState(
        CurrentDisplayTripMediaObserver.watchArray[
        CurrentDisplayTripMediaObserver.GENERATE_KEY(CurrentTripDataService.getCurrentTripId())
        ]
    );

    useEffect(() => {
        const observer = {
            update(newImages) {
                console.log('nana', newImages);
                setDisplayMedias([...newImages]);
            }
        };
        const key = CurrentDisplayTripMediaObserver.GENERATE_KEY(CurrentTripDataService.getCurrentTripId());
        CurrentDisplayTripMediaObserver.attach(observer, key);
        return () => CurrentDisplayTripMediaObserver.detach(observer, key);
    }, []);
    useEffect(() => {
        console.log('nana', 11)

        const loc = () => {
            if (!displayMedias) return [];
            const result = [];
            for (const media of displayMedias) {
                const city = media.city ?? 'Unknown';
                let entry = result.find(item => item.city === city);
                if (!entry) {
                    entry = {
                        city,
                        region: media.region,
                        country: media.country,
                        iso_country_code: media.iso_country_code,
                        hang: result.length % 2 !== 0,
                        rot: result.length % 2 === 0 ? -5 : 6,
                        medias: [],
                    };
                    result.push(entry);
                }
                entry.medias.push(media);
            }
            return result;
        }
        console.log('nana', loc())
        setLocationArray(loc())

    }, [displayMedias])
    // const locationArray = useMemo(() => {
    //     console.log('nana', 11)
    //     if (!displayMedias) return [];
    //     const result = [];
    //     for (const media of displayMedias) {
    //         const city = media.city ?? 'Unknown';
    //         let entry = result.find(item => item.city === city);
    //         if (!entry) {
    //             entry = {
    //                 city,
    //                 region: media.region,
    //                 country: media.country,
    //                 iso_country_code: media.iso_country_code,
    //                 hang: result.length % 2 !== 0,
    //                 rot: result.length % 2 === 0 ? -5 : 6,
    //                 medias: [],
    //             };
    //             result.push(entry);
    //         }
    //         entry.medias.push(media);
    //     }
    //     return result;
    // }, [displayMedias]);

    const worldWidth = Math.max(GALLERY_W, locationArray.length * SLOT_W + 80);

    if (!locationArray.length) return null;

    return (
        <View style={styles.root}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.gallery}
                contentContainerStyle={{ width: worldWidth, height: GALLERY_H }}
            >
                <GalleryOverlay width={worldWidth} locationArray={locationArray} />

                {locationArray.map((loc, i) => (
                    <PolaroidCard
                        key={loc.city}
                        location={loc}
                        index={i}
                        onPress={() => setSelectedCity(loc)}
                    />
                ))}
            </ScrollView>

            {selectedCity && (
                <PhotoSheet location={selectedCity} onClose={() => setSelectedCity(null)} />
            )}
        </View>
    );
}


const _getFlag = (isoCode) => {
    if (!isoCode) return '';
    return isoCode
        .toUpperCase()
        .split('')
        .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
        .join('');
}
const styles = StyleSheet.create({
    filmStrip: {
        backgroundColor: '#4a2e08',
        flexDirection: 'row',
        alignItems: 'center',
        height: 160,
    },
    frames: {
        alignItems: 'center',
        gap: 3,
        paddingVertical: 12,
    },
    frame: {
        width: 120,
        height: 136,
        backgroundColor: '#2a2a2a',
        borderWidth: 1.5,
        borderColor: '#333',
        overflow: 'hidden',
    },
    frameNum: {
        position: 'absolute',
        bottom: 3, right: 5,
        fontFamily: mono,
        fontSize: 9,
        color: 'rgba(255,255,255,0.25)',
    },
    hole: {
        width: 10, height: 7,
        backgroundColor: '#7a5010',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#333',
    },
    root: { flex: 1 },

    gallery: { flexGrow: 0 },

    cardSlot: { position: 'absolute', width: CARD_W, height: GALLERY_H },

    tape: {
        position: 'absolute',
        width: 26, height: 13,
        backgroundColor: TAPE_COLOR,
        borderRadius: 2,
        opacity: 0.85,
        zIndex: 10,
    },

    polaroid: {
        position: 'absolute',
        width: CARD_W, height: CARD_H,
        backgroundColor: '#f2ece0',
        borderRadius: 3,
        padding: 7,
        paddingBottom: 0,
        zIndex: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 10,
    },

    photoArea: { flex: 1, borderRadius: 1, overflow: 'hidden' },

    cardBottom: { paddingTop: 4, paddingBottom: 5, alignItems: 'center' },
    cardCity: { fontFamily: mono, fontSize: 9, color: '#2a201a', fontWeight: '700', letterSpacing: 0.5 },

    overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },

    sheet: {
        backgroundColor: BG,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
    },

    sheetHandle: {
        width: 34, height: 4,
        backgroundColor: '#ccc',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 10, marginBottom: 8,
    },

    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },

    sheetCity: {
        flex: 1,
        fontFamily: serif,
        fontSize: 22,
        color: TEXT_PRIMARY,
    },

    closeBtn: {
        width: 30, height: 30,
        backgroundColor: '#e0ddd6',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeTxt: { color: TEXT_MUTED, fontSize: 12 },

    photoStrip: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 10,
        alignItems: 'flex-start',
    },

    stripPhoto: {
        width: 140,
        height: 180,
        borderRadius: 6,
    },
});