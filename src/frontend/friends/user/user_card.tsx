import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { FriendActionButton, FriendStatus } from './FriendActionButton';
// import { TripsRow, TripSummary } from './TripsRow';
import UsersData from '../../../app-core/flow/handlers/users/users_handler';
import FriendshipsHandler from '../../../app-core/flow/handlers/friendships_handler';
import { UserData } from '../../../types/user_data.types';
import { Feather } from '@expo/vector-icons';

interface Params {target_user_data:UserData,onClose:()=>void}

/**
 * Full profile card shown when a user is tapped (e.g. from search results,
 * a friends list, or a trip's tagged people). Composed of three
 * independently-testable pieces: avatar/identity header, the
 * status-dependent friend action, and a horizontal trips summary.
 */
export function UserCard({
  target_user_data,
  onClose
}:Params) {
  // const user_data = async () => {
  //   const userdata
  // }
  const [error,setError] = useState('')
  const [userData, setUserData] = useState(null)
  const [relationship,setRelationship]= useState(null)

  useEffect(() => {

    const getRelationship = async () => {
      const relationship = await FriendshipsHandler.getRelationship(target_user_data.user_id)
      if (!relationship) {
        setError('Failed to get relationship')
        return
      }
      setRelationship(relationship)
      setError('')
    }
    getRelationship()
  }, [])
  return (

    <View style={styles.card}>
      <View style={styles.header}>

        <View style={styles.avatarWrap}>
          {target_user_data.avatar ? (
            <Image source={{ uri: target_user_data.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={28} color="#8A8A8E" />
            </View>
          )}
        </View>

        <View style={styles.identity}>
          <Text style={styles.displayName} numberOfLines={1}>
            {target_user_data.display_name}
          </Text>
          <Text style={styles.username} numberOfLines={1}>
            @{target_user_data.user_name}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose}><Feather name="x" size={18} color="#5A5A56" /></TouchableOpacity>

      </View>

      {/*<FriendActionButton
        status={friendStatus}
        loading={friendActionLoading}
        onAddFriend={onAddFriend}
        onCancelRequest={onCancelRequest}
        onAccept={onAccept}
        onRefuse={onRefuse}
        onUnfriend={onUnfriend}
      />*/}

      <View style={styles.divider} />

      {/*<Text style={styles.sectionLabel}>Trips</Text>*/}
      {/*<TripsRow trips={trips} onPressTrip={onPressTrip} />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#E4E2DA',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarWrap: {
    marginRight: 12,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    backgroundColor: '#ECEBE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: {
    flex: 1,
  },
  displayName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  username: {
    fontSize: 14,
    color: '#8A8A8E',
    marginTop: 2,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#E4E2DA',
    marginVertical: 16,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#8A8A8E',
    marginBottom: 10,
  },
});
