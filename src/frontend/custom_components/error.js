import { useEffect, useRef, useState } from 'react'
import { View, Text, Animated, StyleSheet, Dimensions, Easing } from 'react-native'

const { width } = Dimensions.get('window')

export function ErrorMessageBox({ title, message, duration = 3000 }) {
  const [visible, setVisible] = useState(true)
  const slideY  = useRef(new Animated.Value(-80)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // slide in
    Animated.parallel([
      Animated.spring(slideY,  { toValue: 0, tension: 70, friction: 11, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 250,             useNativeDriver: true }),
    ]).start()

    // slide out before unmount
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideY,  { toValue: -80, duration: 280, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0,   duration: 220, useNativeDriver: true }),
      ]).start(() => setVisible(false))
    }, duration - 300)

    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  return (
    <Animated.View style={[s.container, { opacity, transform: [{ translateY: slideY }] }]}>
      {/* left accent bar */}
      <View style={s.accent} />
      <View style={s.content}>
        <Text style={s.title}>{title}</Text>
        {message ? <Text style={s.message}>{message}</Text> : null}
      </View>
    </Animated.View>
  )
}

const s = StyleSheet.create({
  container: {
    position:        'absolute',
    top:             52,
    left:            16,
    right:           16,
    flexDirection:   'row',
    alignItems:      'stretch',
    backgroundColor: '#1a1917',
    borderWidth:     1,
    borderColor:     'rgba(200,184,152,0.18)',
    shadowColor:     '#000',
    shadowOffset:    { width: 4, height: 4 },
    shadowOpacity:   0.35,
    shadowRadius:    0,
    elevation:       8,
    zIndex:          1000,
  },
  accent: {
    width:           3,
    backgroundColor: '#c8603a',   // muted burnt orange — error without being harsh
  },
  content: {
    flex:    1,
    padding: 12,
  },
  title: {
    fontFamily:    'mainfont',
    fontSize:       15,
    color:         '#f0f0ec',
    letterSpacing:  0.5,
    marginBottom:   3,
  },
  message: {
    fontFamily:    'mainfont',
    fontSize:       11,
    color:         'rgba(240,240,236,0.55)',
    letterSpacing:  0.3,
    lineHeight:     16,
  },
})