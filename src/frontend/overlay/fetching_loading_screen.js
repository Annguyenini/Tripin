import { useEffect, useRef, useState } from 'react'
import {
  View, Text, Animated, StyleSheet, Dimensions, Easing
} from 'react-native'

const { width, height } = Dimensions.get('window')
const R = 110

const STEPS = [
  'plotting your route...',
  'syncing coordinates...',
  'loading memories...',
  'almost there...',
]

const DRIP_CFG = [
  { left: '6%',  h: 52, w: 5 },
  { left: '22%', h: 74, w: 7 },
  { left: '38%', h: 38, w: 5 },
  { left: '52%', h: 86, w: 8 },
  { left: '68%', h: 58, w: 6 },
  { left: '84%', h: 64, w: 6 },
]

const LAT_RINGS = [
  { lat: -60, opacity: 0.18 },
  { lat: -38, opacity: 0.25 },
  { lat: -18, opacity: 0.30 },
  { lat:   0, opacity: 0.35 },
  { lat:  18, opacity: 0.30 },
  { lat:  38, opacity: 0.25 },
  { lat:  60, opacity: 0.18 },
]

const LNG_STRIPS = [0, 1, 2, 3, 4, 5]
const LETTERS    = 'TRIPPING'.split('')

// ── same Globe component, unchanged ──
function Globe() {
  return (
    <View style={gb.sphere}>
      {LAT_RINGS.map(({ lat, opacity }) => {
        const y  = R + R * Math.sin((lat * Math.PI) / 180)
        const rx = R * Math.cos((lat * Math.PI) / 180)
        const ry = rx * 0.28
        if (rx < 4) return null
        return (
          <View key={`lat${lat}`} style={[gb.latRing, {
            width: rx * 2, height: ry * 2,
            borderRadius: rx,
            top: y - ry, left: R - rx,
            opacity,
          }]} />
        )
      })}
      {LNG_STRIPS.map(i => {
        const frac = i / LNG_STRIPS.length
        const rx   = Math.max(2, R * Math.abs(Math.sin(frac * Math.PI)))
        return (
          <View key={`lng${i}`} style={[gb.lngStrip, {
            width: rx * 2, height: R * 2,
            borderRadius: rx,
            left: R - rx,
            opacity: 0.22,
          }]} />
        )
      })}
      <View style={gb.glow} />
      <View style={gb.rim} />
      <View style={gb.pinOuter} />
      <View style={gb.pinMid} />
      <View style={gb.pinDot} />
    </View>
  )
}

const gb = StyleSheet.create({
  sphere: {
    width: R * 2, height: R * 2,
    borderRadius: R,
    backgroundColor: '#141210',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 12,
  },
  latRing: {
    position: 'absolute',
    borderWidth: 0.8,
    borderColor: '#c8b898',
    backgroundColor: 'transparent',
  },
  lngStrip: {
    position: 'absolute',
    top: 0,
    borderWidth: 0.8,
    borderColor: '#c8b898',
    backgroundColor: 'transparent',
  },
  glow: {
    position: 'absolute',
    top: -R * 0.25, left: -R * 0.15,
    width: R * 1.2, height: R * 1.2,
    borderRadius: R * 0.6,
    backgroundColor: 'rgba(200,184,152,0.10)',
  },
  rim: {
    position: 'absolute',
    top: 1, left: 1, right: 1, bottom: 1,
    borderRadius: R,
    borderWidth: 1.2,
    borderColor: 'rgba(200,184,152,0.28)',
    backgroundColor: 'transparent',
  },
  pinOuter: {
    position: 'absolute',
    top: R * 0.58 - 13, left: R * 1.16 - 13,
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 0.8,
    borderColor: 'rgba(240,240,236,0.18)',
    backgroundColor: 'transparent',
  },
  pinMid: {
    position: 'absolute',
    top: R * 0.58 - 8, left: R * 1.16 - 8,
    width: 16, height: 16, borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(240,240,236,0.35)',
    backgroundColor: 'transparent',
  },
  pinDot: {
    position: 'absolute',
    top: R * 0.58 - 4, left: R * 1.16 - 4,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#f0f0ec',
    opacity: 0.92,
  },
})

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase]         = useState('globe')
  const [stepIndex, setStepIndex] = useState(0)
  const [dotCount,  setDotCount]  = useState(0)

  const globeScale   = useRef(new Animated.Value(0)).current
  const globeOpacity = useRef(new Animated.Value(0)).current
  const globeRotate  = useRef(new Animated.Value(0)).current
  const globeTransY  = useRef(new Animated.Value(0)).current
  const globeShrink  = useRef(new Animated.Value(1)).current

  const letterAnims = LETTERS.map(() => ({
    opacity:    useRef(new Animated.Value(0)).current,
    translateY: useRef(new Animated.Value(28)).current,
  }))
  const tagOpacity = useRef(new Animated.Value(0)).current

  const dripAnims = DRIP_CFG.map(() => useRef(new Animated.Value(0)).current)
  const scanX     = useRef(new Animated.Value(-width)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(globeScale,   { toValue: 1, tension: 55, friction: 9,  useNativeDriver: true }),
      Animated.timing(globeOpacity, { toValue: 1, duration: 600,             useNativeDriver: true }),
    ]).start()

    Animated.loop(
      Animated.timing(globeRotate, {
        toValue: 1, duration: 8000,
        easing: Easing.linear, useNativeDriver: true,
      })
    ).start()

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(globeTransY, {
          toValue: -height * 0.68, duration: 700,
          easing: Easing.in(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(globeShrink, {
          toValue: 0.25, duration: 650,
          easing: Easing.in(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(globeOpacity, {
          toValue: 0, duration: 500, useNativeDriver: true,
        }),
      ]).start(() => {
        setPhase('brand')

        LETTERS.forEach((_, i) => {
          const la = letterAnims[i]
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(la.opacity,    { toValue: 1, duration: 280, useNativeDriver: true }),
              Animated.spring(la.translateY, { toValue: 0, tension: 80, friction: 9, useNativeDriver: true }),
            ]).start()
          }, i * 70)
        })

        setTimeout(() => {
          Animated.timing(tagOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start()
        }, LETTERS.length * 70 + 200)

        setTimeout(() => {
          dripAnims.forEach((a, i) => {
            const loop = () => {
              a.setValue(0)
              Animated.timing(a, {
                toValue: 1, duration: 820 + i * 160,
                delay: i * 170, easing: Easing.in(Easing.cubic),
                useNativeDriver: false,
              }).start(({ finished }) => { if (finished) loop() })
            }
            setTimeout(loop, i * 130)
          })
        }, 300)

        const runScan = () => {
          scanX.setValue(-width)
          Animated.timing(scanX, {
            toValue: width, duration: 1800,
            easing: Easing.inOut(Easing.quad), useNativeDriver: true,
          }).start(({ finished }) => { if (finished) setTimeout(runScan, 700) })
        }
        runScan()

        if (onDone) setTimeout(onDone, 2400)
      })
    }, 2200)

    const stepTimer = setInterval(() => setStepIndex(i => (i + 1) % STEPS.length), 1800)
    const dotTimer  = setInterval(() => setDotCount(d => (d + 1) % 4),             450)
    return () => { clearInterval(stepTimer); clearInterval(dotTimer) }
  }, [])

  const spinDeg = globeRotate.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <View style={s.container}>

      {/* ══ GLOBE ══ */}
      {phase === 'globe' && (
        <Animated.View style={[s.globeWrap, {
          opacity:   globeOpacity,
          transform: [
            { translateY: globeTransY },
            { scale:      globeShrink },
            { scale:      globeScale  },
            { rotate:     spinDeg     },
          ],
        }]}>
          <Globe />
          <View style={s.orbitRing} />
        </Animated.View>
      )}

      {/* ══ BRAND ══ */}
      {phase === 'brand' && (
        <View style={s.brandWrap}>
          {/* drips above */}
          <View style={s.dripRow} pointerEvents="none">
            {DRIP_CFG.map((cfg, i) => (
              <Animated.View key={i} style={[s.drip, {
                left:  cfg.left,
                width: cfg.w,
                height: dripAnims[i].interpolate({
                  inputRange:  [0, 1],
                  outputRange: [0, cfg.h],
                }),
                opacity: dripAnims[i].interpolate({
                  inputRange:  [0, 0.15, 0.85, 1],
                  outputRange: [0, 1,    1,    0],
                }),
              }]} />
            ))}
          </View>

          {/* letters */}
          <View style={s.lettersRow}>
            {LETTERS.map((char, i) => (
              <Animated.Text key={i} style={[s.letter, {
                opacity:   letterAnims[i].opacity,
                transform: [{ translateY: letterAnims[i].translateY }],
              }]}>
                {char}
              </Animated.Text>
            ))}
          </View>

          <Animated.Text style={[s.tagline, { opacity: tagOpacity }]}>
            your trips · your world
          </Animated.Text>
        </View>
      )}

      {/* ══ STATUS ══ */}
      <View style={s.statusWrap}>
        <Text style={s.stepText}>{STEPS[stepIndex]}</Text>
        <Text style={s.dots}>{'·'.repeat(dotCount).padEnd(3, ' ')}</Text>
      </View>

      {/* ══ SCAN LINE ══ */}
      <View style={s.scanTrack} pointerEvents="none">
        <Animated.View style={[s.scanLine, { transform: [{ translateX: scanX }] }]} />
      </View>

      {/* ══ STAMP ══ */}
      <Text style={s.stamp}>TRIPPING · GETTING READY</Text>

    </View>
  )
}

const s = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex:            1,
    backgroundColor: '#f5f0e8',   // ← polaroid warm white, matches AuthScreen frame
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          999,
  },

  // globe
  globeWrap: {
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   40,
  },
  orbitRing: {
    position:     'absolute',
    width:         R * 2 + 44,
    height:        R * 2 + 44,
    borderRadius: (R * 2 + 44) / 2,
    borderWidth:   1,
    borderColor:  'rgba(26,26,26,0.13)',   // ← dark on light
    borderStyle:  'dashed',
  },

  // brand
  brandWrap: {
    alignItems: 'center',
  },
  dripRow: {
    position: 'absolute',
    top:      -74,
    left:     -24,
    right:    -24,
    height:   82,
  },
  drip: {
    position:               'absolute',
    top:                    0,
    backgroundColor:        '#1a1a18',   // ← dark drip on light bg
    borderBottomLeftRadius:  50,
    borderBottomRightRadius: 50,
  },
  lettersRow: {
    flexDirection: 'row',
    alignItems:    'flex-end',
  },
  letter: {
    fontFamily:      'mainfont',          // ← matches AuthScreen
    fontSize:         52,
    color:           '#1a1a1a',           // ← dark on light bg
    letterSpacing:    2,
    textShadowColor:  'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
    marginHorizontal: 0.5,
  },
  tagline: {
    marginTop:    10,
    fontFamily:   'mainfont',             // ← matches AuthScreen
    fontSize:      11,
    color:        'rgba(26,26,26,0.45)',
    letterSpacing: 2.8,
    textTransform: 'uppercase',
  },

  // status
  statusWrap: {
    position:      'absolute',
    bottom:        height * 0.13,
    flexDirection: 'row',
    alignItems:    'center',
    gap:            4,
  },
  stepText: {
    fontFamily:    'mainfont',
    fontSize:       12,
    color:         'rgba(26,26,26,0.45)',
    letterSpacing:  0.8,
  },
  dots: {
    fontFamily: 'mainfont',
    fontSize:    12,
    color:      'rgba(26,26,26,0.28)',
    width:       18,
  },

  // scan
  scanTrack: {
    position: 'absolute',
    bottom:   58,
    left:     0,
    right:    0,
    height:   1,
    overflow: 'hidden',
    opacity:  0.2,
  },
  scanLine: {
    width:           width * 0.45,
    height:          1,
    backgroundColor: '#1a1a1a',   // ← dark scan on light bg
  },

  // stamp
  stamp: {
    position:      'absolute',
    bottom:        24,
    fontFamily:    'mainfont',
    fontSize:       8,
    color:         'rgba(26,26,26,0.18)',
    letterSpacing:  2.5,
    textTransform: 'uppercase',
  },
})