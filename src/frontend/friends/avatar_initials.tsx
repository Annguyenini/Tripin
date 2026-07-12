import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { UserData } from '../../types/user_data.types';

interface AvatarInitialsProps {
  username: string;
  color: string;
  size?: number;
}

export default function AvatarInitials({target_user_data}:{target_user_data:UserData}) {
  const initials = target_user_data.user_name
    .replace(/[._]/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <View>
      {target_user_data.avatar ? (<Image style={ {width: 36, height: 36, borderRadius: 36 / 2}} source={{uri:target_user_data?.avatar}}/>):(<View
        style={[
          styles.circle,
          { width: 36, height: 36, borderRadius: 36 / 2, backgroundColor: '#D85A30' },
        ]}
      ><Text style={styles.initials}>{initials}</Text></View>)}

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
