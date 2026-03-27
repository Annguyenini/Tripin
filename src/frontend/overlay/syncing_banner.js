import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';

export const SyncBanner = ({ visible }) => {
    const dot1 = useRef(new Animated.Value(1)).current;
    const dot2 = useRef(new Animated.Value(1)).current;
    const dot3 = useRef(new Animated.Value(1)).current;
    const rotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!visible) return;

        Animated.loop(
            Animated.timing(rotate, {
                toValue: 1, duration: 2400,
                easing: Easing.linear, useNativeDriver: true,
            })
        ).start();

        const pulseDot = (dot, delay) => Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(dot, { toValue: 0.2, duration: 500, useNativeDriver: true }),
                Animated.timing(dot, { toValue: 1, duration: 500, useNativeDriver: true }),
            ])
        ).start();

        pulseDot(dot1, 0);
        pulseDot(dot2, 300);
        pulseDot(dot3, 600);
    }, [visible]);

    const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    if (!visible) return null;

    return (
        <View style={styles.banner}>
            {/* globe made from borders */}
            <Animated.View style={[styles.globe, { transform: [{ rotate: spin }] }]}>
                <View style={styles.globeOuter}>
                    <View style={styles.globeInner} />
                    <View style={styles.globeEquator} />
                </View>
            </Animated.View>
            <View>
                <Text style={styles.label}>TRIPPING</Text>
                <Text style={styles.title}>Syncing your trip...</Text>
                <View style={styles.dots}>
                    {[dot1, dot2, dot3].map((d, i) => (
                        <Animated.View key={i} style={[styles.dot, { opacity: d }]} />
                    ))}
                </View>
            </View>
        </View>
    );
};

const SIZE = 32;

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: '#1a1917', borderWidth: 1, borderColor: '#2e2c29',
        borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14,
    },
    globe: {
        width: SIZE, height: SIZE,
        alignItems: 'center', justifyContent: 'center',
    },
    globeOuter: {
        width: SIZE, height: SIZE, borderRadius: SIZE / 2,
        borderWidth: 1.5, borderColor: '#f0f0ec',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
    },
    globeInner: {
        width: SIZE * 0.5, height: SIZE,
        borderRadius: SIZE * 0.5,
        borderWidth: 1.5, borderColor: '#6b6860',
        position: 'absolute',
    },
    globeEquator: {
        width: SIZE, height: SIZE * 0.45,
        borderRadius: SIZE * 0.5,
        borderWidth: 1.5, borderColor: '#6b6860',
        position: 'absolute',
    },
    label: {
        fontFamily: 'DMMono', fontSize: 10,
        color: '#6b6860', letterSpacing: 1.2,
    },
    title: {
        fontFamily: 'DMMono', fontSize: 13,
        color: '#f0f0ec', fontWeight: '600', marginTop: 2,
    },
    dots: { flexDirection: 'row', gap: 4, marginTop: 5 },
    dot: {
        width: 5, height: 5, borderRadius: 3,
        backgroundColor: '#f0f0ec',
    },
});