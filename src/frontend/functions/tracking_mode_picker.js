import { useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native'

const MODES = [
  {
    key: 'normal',
    label: 'Detail Tracking (disable for now)',
    sub: 'GPS path, speed, altitude & photos',
    // preview: require('../../../assets/preview_detail.png'),   // swap with your asset
    // fallback placeholder if no asset yet:
    emoji: '🗺️',
  },
  {
    key: 'media_only',
    label: 'Only Medias (default) ',
    sub: 'Photos & videos only, no GPS path',
    // preview: require('../../../assets/preview_media.png'),
    emoji: '📷',
  },
]

export const TrackingModePicker = ({ value, onChange }) => {
  const [selected, setSelected] = useState(value ?? 'normal')

  const handleSelect = (key) => {
    setSelected(key)
    onChange?.(key)
  }

  const active = MODES.find(m => m.key === selected)

  return (
    <View style={s.wrapper}>

      {/* label */}
      <Text style={s.heading}>Tracking Mode</Text>
      <Text style={s.sub}>Choose how this trip records data</Text>

      {/* toggle row */}
      <View style={s.toggleRow}>
        {MODES.map(mode => (
          <TouchableOpacity
            disabled ={mode.key ==='normal'? true : false}
            key={mode.key}
            style={[s.option, selected === mode.key && s.optionActive]}
            onPress={() => handleSelect(mode.key)}
            activeOpacity={0.75}
          >
            <Text style={[s.optionText, selected === mode.key && s.optionTextActive]}>
              {mode.label}
            </Text>
            {selected === mode.key && <View style={s.activeDot} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* preview card */}
      <View style={s.previewCard}>
        {/* placeholder image — swap with real asset */}
        <View style={s.previewImageWrap}>
          <Text style={s.previewEmoji}>{active.emoji}</Text>
          {/* once you have real assets: */}
          {/* <Image source={active.preview} style={s.previewImage} resizeMode="cover" /> */}
        </View>

        <View style={s.previewInfo}>
          <Text style={s.previewTitle}>{active.label}</Text>
          <Text style={s.previewSub}>{active.sub}</Text>

          {/* feature bullets */}
          {active.key === 'normal' ? (
            <>
              <FeatureRow text="GPS coordinates logged" />
              <FeatureRow text="Speed & altitude tracked" />
              <FeatureRow text="Full route path on map" />
              <FeatureRow text="Photos pinned to location" />
            </>
          ) : (
            <>
              <FeatureRow text="Photos & videos only" />
              <FeatureRow text="No GPS path recorded" />
              <FeatureRow text="Lower battery usage" />
              <FeatureRow text="Media gallery view" />
            </>
          )}
          
        </View>
        
      </View>
      <View style={s.featureRow}>
        <Text style={s.featureDot}>·</Text>
        <Text style={s.noiceText}>You can change it later!</Text>
    </View>
    </View>
  )
}

const FeatureRow = ({ text }) => (
  <View style={s.featureRow}>
    <Text style={s.featureDot}>·</Text>
    <Text style={s.featureText}>{text}</Text>
  </View>
)

const s = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 12,
  },

  heading: {
    fontFamily: 'PermanentMarker',
    fontSize: 16,
    color: '#000000',
    letterSpacing: 0.04,
  },

  sub: {
    fontFamily: 'DMMono',
    fontSize: 10,
    color: '#5a5550',
    letterSpacing: 0.1,
    marginTop: -6,
  },

  // ── TOGGLE ──
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#141210',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    gap: 4,
  },

  optionActive: {
    backgroundColor: '#f0f0ec',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 4,
  },

  optionText: {
    fontFamily: 'DMMono',
    fontSize: 12,
    color: '#5a5550',
    letterSpacing: 0.06,
  },

  optionTextActive: {
    color: '#1a1a1a',
    fontWeight: '600',
  },

  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1a1a1a',
  },

  // ── PREVIEW CARD ──
  previewCard: {
    backgroundColor: '#1a1917',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },

  previewImageWrap: {
    width: 90,
    height: 110,
    borderRadius: 10,
    backgroundColor: '#242220',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  previewEmoji: {
    fontSize: 36,
  },

  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  previewInfo: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },

  previewTitle: {
    fontFamily: 'PermanentMarker',
    fontSize: 13,
    color: '#f0f0ec',
    letterSpacing: 0.04,
  },

  previewSub: {
    fontFamily: 'DMMono',
    fontSize: 9,
    color: '#5a5550',
    letterSpacing: 0.08,
    marginBottom: 4,
  },

  featureRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },

  featureDot: {
    color: '#c8a87a',
    fontSize: 16,
    lineHeight: 16,
  },

  featureText: {
    fontFamily: 'DMMono',
    fontSize: 10,
    color: '#888',
    letterSpacing: 0.06,
  },
  noiceText: {
    fontFamily: 'DMMono',
    fontSize: 10,
    color: '#ff0000',
    letterSpacing: 0.06,
  },
})