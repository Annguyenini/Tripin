import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AvatarInitialsProps {
  username: string;
  color: string;
  size?: number;
}

export default function AvatarInitials({ username, color, size = 36 }: AvatarInitialsProps) {
  const initials = username
    .replace(/[._]/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}
    >
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
});
