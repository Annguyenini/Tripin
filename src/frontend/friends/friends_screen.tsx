import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView,Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';

import FriendsList from './friends_list';
import FriendSearch from './friend_search';
import IncomingRequests from './incoming_requests';
import OutgoingRequests from './outgoing_requests';
import { Friend, FriendRequest, FriendsView } from '../../types/friend.types';
import FriendShipsService from '../../app-core/flow/handlers/friendships_handler';
import { UserData } from '../../types/user_data.types';
import { UserCard } from './user/user_card';
import { useData } from '@shopify/react-native-skia';

const ICONS: { view: FriendsView; name: keyof typeof Feather.glyphMap }[] = [
  { view: 'search', name: 'search' },
  { view: 'incoming', name: 'user-check' },
  { view: 'outgoing', name: 'clock' },
];

// Placeholder data — swap these useState initial values for whatever your
// backend layer hands back (props, a hook, context, etc).
const MOCK_FRIENDS: Friend[] = [
  { id: '1', username: 'kim_moves', location: 'Tokyo, Japan', avatarColor: '#D85A30' },
  { id: '2', username: 'ryan.travels', location: 'Lisbon, Portugal', avatarColor: '#1D9E75' },
];

const MOCK_INCOMING: FriendRequest[] = [
  { id: 'r1', username: 'sam.packs', avatarColor: '#BA7517' },
];

const MOCK_OUTGOING: FriendRequest[] = [
  { id: 'r2', username: 'tam.wu', avatarColor: '#378ADD' },
];

export default function FriendsScreen({ onClose}) {
  const [activeView, setActiveView] = useState<FriendsView>('friends');

  const [friends, setFriends] = useState<UserData[]>([]);
  const [incoming, setIncoming] = useState<UserData[]>([]);
  const [outgoing, setOutgoing] = useState<UserData[]>([]);
  const [error, setError] = useState<string>('')
  const [selectedUserData,setSelectedUserData] = useState<UserData>(null)

  const toggleView = (view: FriendsView) => {
    setActiveView((current) => (current === view ? 'friends' : view));
  };

  // Each handler below just updates local UI state. Hook your backend
  // calls into these — optimistic update is already in place, so a
  // failed request just needs to revert the state on catch.
  useEffect(() => {
    FriendShipsService.getFriendsHandler().then((friends) => {
      if (!friends) setError('Failed to get friends')
      console.log(friends)
     setFriends(friends)
    }).catch((err) => { 'Failed to fetch friend' })

    FriendShipsService.getIncomingFriendRequests().then((friends) => {
      if (!friends) setError('Failed to get friends')
      console.log(friends)

     setIncoming(friends)
    }).catch((err) => { 'Failed to fetch friend' })

    FriendShipsService.getOutcomingFriendRequests().then((friends) => {
      if (!friends) setError('Failed to get friends')
      console.log(friends)

     setOutgoing(friends)
    }).catch((err)=>{'Failed to fetch friend'})
  },[])
  const handleAccept = async(requestId: number) => {
    console.log(requestId)
    const target = incoming.find((r)=>r.user_id ===requestId )
    if(!target) return
    const response = await FriendShipsService.acceptFriendRequest(requestId)
    if (!response) {
      setError('Failed to accept friend request! \nPlease try again later!')
      return
    }
    setError('')
    setIncoming((prev)=>prev.filter((r)=>r.user_id !== requestId))
    setFriends((prev) => [...prev, target])
    return
  };

  const handleDecline = async(requestId: number) => {
    const target = incoming.find((r)=>r.user_id ===requestId )
    if(!target) return
    const response = await FriendShipsService.deleteRelationship(requestId)
    if (!response) {
      setError('Failed to delince friend request! \nPlease try again later! ')
      return
    }
    setError('')
    setIncoming((prev)=>prev.filter((r)=>r.user_id !== requestId))
    return
  };

  const handleCancel = async(requestId: number) => {
    const target = outgoing.find((r)=>r.user_id ===requestId )
    if(!target) return
    const response = await FriendShipsService.deleteRelationship(requestId)
    if (!response) {
      setError('Failed to delince friend request! \nPlease try again later! ')
      return
    }
    setError('')
    setOutgoing((prev)=>prev.filter((r)=>r.user_id !== requestId))
    return
  };

  const handleSearch = async (query: string): Promise<Friend[]> => {
    // TODO: replace with your search call, e.g. GET /friends/search?q=
    return MOCK_FRIENDS.filter((f) =>
      f.username.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSendRequest = async (userId: string) => {
    // TODO: POST /friends/requests
  };

  const selectUserHandler = (userdata) => {
    setSelectedUserData(userdata)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}><Feather name="x" size={18} color="#5A5A56" /></TouchableOpacity>
        <Text style={styles.title}>Friends</Text>

        <View style={styles.iconRow}>
          {ICONS.map(({ view, name }) => {
            const active = activeView === view;
            return (
              <TouchableOpacity
                key={view}
                onPress={() => toggleView(view)}
                style={[styles.iconButton, active && styles.iconButtonActive]}
                accessibilityLabel={view}
              >
                <Feather name={name} size={16} color={active ? '#fff' : '#5A5A56'} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.error}>{error}</Text>

        {activeView === 'friends' && (
          <FriendsList
          selectUserHandler={selectUserHandler}
            friends={friends}

          />
        )}

        {activeView === 'search' && (
          <FriendSearch
          selectUserHandler={selectUserHandler}
            onSendRequest={handleSendRequest}
            onBack={() => setActiveView('friends')}
          />
        )}

        {activeView === 'incoming' && (
          <IncomingRequests
            requests={incoming}
            onAccept={handleAccept}
            onDecline={handleDecline}
            selectUserHandler={selectUserHandler}
            onBack={() => setActiveView('friends')}
          />
        )}

        {activeView === 'outgoing' && (
          <OutgoingRequests
            requests={outgoing}
            onCancel={handleCancel}
            onBack={() => setActiveView('friends')}
            selectUserHandler={selectUserHandler}

          />
        )}
        <Modal visible={!!selectedUserData}><UserCard target_user_data={selectedUserData} onClose={()=>setSelectedUserData(null)}></UserCard></Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F3EE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 25,

  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A18',
  },
  error: {
    paddingHorizontal: 10,

    fontSize: 15,
    fontWeight: '500',
    color: 'red',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#D8D7CE',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonActive: {
    backgroundColor: '#D85A30',
    borderColor: '#D85A30',
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
