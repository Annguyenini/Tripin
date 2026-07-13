import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type FriendStatus = 'friend' | 'not_friend' | 'incoming_request' | 'outgoing_request';

interface FriendActionButtonProps {
  status: FriendStatus;
  loading?: boolean;
  onAddFriend?: () => void;
  onCancelRequest?: () => void;
  onAccept?: () => void;
  onRefuse?: () => void;
  onUnfriend?: () => void;
}

/**
 * Renders the correct call-to-action for a user card based on the
 * current relationship status between the viewer and the profile owner.
 * All backend calls (add/cancel/accept/refuse/unfriend) are handled by
 * the parent via the passed-in callbacks — this component is presentational.
 */
export function FriendActionButton({
  status,
  loading = false,
  onAddFriend,
  onCancelRequest,
  onAccept,
  onRefuse,
  onUnfriend,
}: FriendActionButtonProps) {
  if (loading) {
    return (
      <View style={[styles.button, styles.neutralButton]}>
        <ActivityIndicator size="small" color="#8A8A8E" />
      </View>
    );
  }

  switch (status) {
    case 'friend':
      return (
        <TouchableOpacity
          style={[styles.button, styles.neutralButton]}
          onPress={onUnfriend}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark" size={16} color="#5F5E5A" style={styles.icon} />
          <Text style={styles.neutralText}>Friends</Text>
        </TouchableOpacity>
      );

    case 'not_friend':
      return (
        <TouchableOpacity
          style={[styles.button, styles.accentButton]}
          onPress={onAddFriend}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.accentText}>Add friend</Text>
        </TouchableOpacity>
      );

    case 'incoming_request':
      return (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.accentButton, styles.flex1]}
            onPress={onAccept}
            activeOpacity={0.7}
          >
            <Text style={styles.accentText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.neutralButton, styles.flex1]}
            onPress={onRefuse}
            activeOpacity={0.7}
          >
            <Text style={styles.neutralText}>Refuse</Text>
          </TouchableOpacity>
        </View>
      );

    case 'outgoing_request':
      return (
        <TouchableOpacity
          style={[styles.button, styles.neutralButton]}
          onPress={onCancelRequest}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={16} color="#8A8A8E" style={styles.icon} />
          <Text style={styles.mutedText}>Cancel request</Text>
        </TouchableOpacity>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  flex1: {
    flex: 1,
  },
  button: {
    height: 40,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 4,
  },
  neutralButton: {
    backgroundColor: '#F5F5F3',
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
  },
  accentButton: {
    backgroundColor: '#185FA5',
  },
  neutralText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5F5E5A',
  },
  mutedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8A8A8E',
  },
  accentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
