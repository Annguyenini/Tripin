import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FriendActionButton, FriendStatus } from './relationship_action';
import { TripsRow, TripSummary } from './trips';
import UsersData from '../../../app-core/flow/handlers/users/users_handler';
import FriendshipsHandler from '../../../app-core/flow/handlers/friendships_handler';
import { UserRelationship } from '../../../types/user_data.types';
import { Feather } from '@expo/vector-icons';
import UserDataService from '../../../backend/storage/async_storage/user';
import UsersTripsHandler from '../../../app-core/flow/handlers/users/users_trips_handler';
import { Trip_Data } from '../../../types/trip_data.types';
import current_display_contents_observer from '../../trip-components/observers/current_contents/current_display_contents_observer';
import TripDisplayObserver from '../../trip-components/observers/trip_display_observer';

interface Params {
  target_user_data: UserRelationship,
  onClose: () => void,
  onCloseFriendScreen:()=>void,
  onAddFriend: (value:UserRelationship) => void,
  onAcceptFriend: (value:number) => void,
  onRefuseFriend: (value:number) => void,
  onCancelFriendRequest: (value:number) => void,
  onUnFriend: (value:number) => void
}
/**
 * Full profile card shown when a user is tapped (e.g. from search results,
 * a friends list, or a trip's tagged people). Composed of three
 * independently-testable pieces: avatar/identity header, the
 * status-dependent friend action, and a horizontal trips summary.
 */
export function UserCard({
  target_user_data,
  onClose,
  onCloseFriendScreen,
  onAcceptFriend,
  onAddFriend,
  onCancelFriendRequest,
  onRefuseFriend,
  onUnFriend
}:Params) {
  // const user_data = async () => {
  //   const userdata
  // }
  const [error,setError] = useState('')
  // const [relationshipStatus, setRelationshipStatus] = useState<FriendStatus>(null)
  const [relationship, setRelationship] = useState(null)
  const [trips,setTrips] = useState([])
  const user_id = UserDataService.getUserId()
  const tripSelectedHandler = (trip: Trip_Data) => {
    if (!trip) return
    //set the trip want to render
    TripDisplayObserver.setTripSelected(trip)
    //force close the friendships screen
    onCloseFriendScreen()
  }
  useEffect(() => {
    const relationship = async () => {
      if (!target_user_data) return
      const res = await FriendshipsHandler.getRelationship(target_user_data?.user_id)
      setRelationship (res)
    }
    const fetchTrips = async() => {
      if (!target_user_data) return
      const res = await UsersTripsHandler.getUsersTrips(target_user_data?.user_id)
      setTrips(res??[])
    }
    fetchTrips()
    relationship()
  }, [target_user_data?.user_id])
  const relationshipStatus:FriendStatus = useMemo(() => {
    if (!relationship) {

      return'not_friend'
    }
    if (relationship.status === 'FRIEND') {
      return'friend'
    }
    else if (relationship.status === 'REQ_1') {
      if (relationship.user_id1 === user_id) {
        return'outgoing_request'
      }
      else if (relationship.user_id1 === target_user_data.user_id) {
        return'incoming_request'
      }
    }
    else if (relationship.status === 'REQ_2') {
      if (relationship.user_id2 === user_id) {
        return'outgoing_request'
      }
      else if (relationship.user_id2 === target_user_data.user_id) {
        return'incoming_request'
      }
    }
    else {
      return'not_friend'
    }
  }, [relationship])

  if (!target_user_data) return null
  console.log(relationshipStatus,relationship)

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

      <FriendActionButton
        status={relationshipStatus}
        loading={false}
        onAddFriend={()=>onAddFriend(target_user_data)}
        onCancelRequest={()=>onCancelFriendRequest(target_user_data?.user_id)}
        onAccept={()=>onAcceptFriend(target_user_data?.user_id)}
        onRefuse={()=>onRefuseFriend(target_user_data?.user_id)}
        onUnfriend={()=>onUnFriend(target_user_data?.user_id)}
      />

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Trips</Text>
      <TripsRow trips={trips} onPressTrip={tripSelectedHandler}/>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    // borderRadius: 16,
    // borderWidth: 0.5,
    // borderColor: '#E4E2DA',
    padding: 16,
    top:35,
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
