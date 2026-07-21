import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';

import FriendsList from './friends_list';
import FriendSearch from './friend_search';
import IncomingRequests from './incoming_requests';
import OutgoingRequests from './outgoing_requests';
import { Friend, FriendRequest, FriendsView } from '../../types/friend.types';
import FriendShipsService from '../../app-core/flow/handlers/friendships_handler';
import { UserData, UserRelationship } from '../../types/user_data.types';
import { UserCard } from './user/user_card';
import SocketService from '../../app-core/flow/web_socket/socket';
import FriendlistObservers from './observers/friendlist_observer';
import { friendsScreenStyle as styles } from '../../styles/friendscreen/friendscreen.styles';
import { Friendships_events } from '../../types/events/friendships_events.types';

const friendshipEvents: Friendships_events[] = [
  "friend_request",
  "friend_removed",
  "friend_reject",
  "friend_cancel",
  "friend_accept",
];

const ICONS: {
  view: FriendsView;
  name: keyof typeof Feather.glyphMap;
  count?: number;
}[] = [
  { view: 'search', name: 'search' },
  { view: 'incoming', name: 'user-check', count: 0 },
  { view: 'outgoing', name: 'clock', count: 0 },
];


export default function FriendsScreen({ onClose }) {
  const [activeView, setActiveView] = useState<FriendsView>('friends');

  const [friends, setFriends] = useState<UserData[]>([]);
  const [incoming, setIncoming] = useState<UserData[]>([]);
  const [outgoing, setOutgoing] = useState<UserData[]>([]);
  const [error, setError] = useState<string>('');
  const [selectedUserData, setSelectedUserData] = useState<UserData>(null);
  const [usercardRenderId, setUsercardRenderId] = useState(1);

  const toggleView = (view: FriendsView) => {
    setActiveView((current) => (current === view ? 'friends' : view));
  };

  // Each handler below just updates local UI state. Hook your backend
  // calls into these — optimistic update is already in place, so a
  // failed request just needs to revert the state on catch.
  useEffect(() => {
    FriendShipsService.getFriendsHandler()
      .then((friends) => {
        if (!friends) setError('Failed to get friends');
        setFriends(friends);
      })
      .catch((err) => { 'Failed to fetch friend' });

    FriendShipsService.getIncomingFriendRequests()
      .then((friends) => {
        if (!friends) setError('Failed to get friends');
        setIncoming(friends);
      })
      .catch((err) => { 'Failed to fetch friend' });

    FriendShipsService.getOutcomingFriendRequests()
      .then((friends) => {
        if (!friends) setError('Failed to get friends');
        setOutgoing(friends);
      })
      .catch((err) => { 'Failed to fetch friend' });
  }, []);

  useEffect(() => {
    const updateFriend = {
      update(event: Friendships_events, user: UserData) {
        console.log(event, user);

        switch (event) {
          case "friend_request":
            setIncoming(prev => [...prev, user]);
            break;

          case "friend_removed":
            setFriends(prev =>
              prev.filter(friend => friend.user_id !== user.user_id)
            );
            break;

          case "friend_reject":
            setOutgoing(prev =>
              prev.filter(request => request.user_id !== user.user_id)
            );
            break;

          case "friend_cancel":
            setIncoming(prev =>
              prev.filter(request => request.user_id !== user.user_id)
            );
            break;

          case "friend_accept":
            setFriends(prev => [...prev, user]);
            setOutgoing(prev =>
              prev.filter(request => request.user_id !== user.user_id)
            );
            break;
        }
      },
    };

    const events: Friendships_events[] = [
      "friend_request",
      "friend_removed",
      "friend_reject",
      "friend_cancel",
      "friend_accept",
    ];

    events.forEach(event => {
      FriendlistObservers.attach(event, updateFriend);
    });

    return () => {
      events.forEach(event => {
        FriendlistObservers.detach(event, updateFriend);
      });
    };
  }, []);

  const handleAccept = async (requestId: number) => {
    const target = incoming.find((r) => r.user_id === requestId);
    if (!target) return;
    const response = await FriendShipsService.acceptFriendRequest(requestId);
    if (!response) {
      setError('Failed to accept friend request! \nPlease try again later!');
      return;
    }
    setError('');
    setIncoming((prev) => prev.filter((r) => r.user_id !== requestId));
    setFriends((prev) => [...prev, target]);
    setUsercardRenderId((prev) => prev + 1);
    return;
  };

  const handleDecline = async (requestId: number) => {
    const target = incoming.find((r) => r.user_id === requestId);
    if (!target) return;
    const response = await FriendShipsService.rejectFriendRequest(requestId);
    if (!response) {
      setError('Failed to delince friend request! \nPlease try again later! ');
      return;
    }
    setError('');
    setIncoming((prev) => prev.filter((r) => r.user_id !== requestId));
    setUsercardRenderId((prev) => prev + 1);
    return;
  };

  const handleCancel = async (requestId: number) => {
    const target = outgoing.find((r) => r.user_id === requestId);
    if (!target) return;
    const response = await FriendShipsService.cancelFriendRequest(requestId);
    if (!response) {
      setError('Failed to cancel friend request! \nPlease try again later! ');
      return;
    }
    setError('');
    setOutgoing((prev) => prev.filter((r) => r.user_id !== requestId));
    setUsercardRenderId((prev) => prev + 1);
    return;
  };


  const handleSendRequest = async (target: UserRelationship) => {
    // TODO: POST /friends/requests
    if (!target) return;
    const response = await FriendShipsService.requestFriend(target?.user_id);
    if (!response) {
      setError('Failed to request friend! \nPlease try again later! ');
      return;
    }
    setError('');
    setOutgoing((prev) => [...prev, target]);
    setUsercardRenderId((prev) => prev + 1);
    return;
  };

  const deleteFriend = async (requestId: number) => {
    // TODO: POST /friends/requests
    const target = friends.find((r) => r.user_id === requestId);
    if (!target) return;
    const response = await FriendShipsService.removeFriend(requestId);
    if (!response) {
      setError('Failed to request friend! \nPlease try again later! ');
      return;
    }
    setError('');
    setFriends((prev) => prev.filter((r) => r.user_id !== requestId));
    setUsercardRenderId((prev) => prev + 1);
    return;
  };

  const selectUserHandler = (userdata) => {
    setSelectedUserData(userdata);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Feather name="x" size={18} color={styles.colors.inkSoft} />
        </TouchableOpacity>
        <Text style={styles.title}>Friends</Text>

        <View style={styles.iconRow}>
          {ICONS.map(({ view, name }) => {
            const count =
              view === 'incoming'
                ? incoming?.length
                : view === 'outgoing'
                ? outgoing?.length
                : 0;

            const active = activeView === view;

            return (
              <TouchableOpacity
                key={view}
                onPress={() => toggleView(view)}
                style={[styles.iconButton, active && styles.iconButtonActive]}
                accessibilityLabel={view}
              >
                <Feather
                  name={name}
                  size={16}
                  color={active ? styles.colors.card : styles.colors.inkSoft}
                />

                {count > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {count > 99 ? '99+' : count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.body}>
        {!!error && <Text style={styles.error}>{error}</Text>}

        {activeView === 'friends' && (
          <FriendsList selectUserHandler={selectUserHandler} friends={friends} />
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

        <Modal visible={!!selectedUserData}>
          <UserCard
            key={usercardRenderId}
            target_user_data={selectedUserData}
            onClose={() => setSelectedUserData(null)}
            onCloseFriendScreen={onClose}
            onAcceptFriend={handleAccept}
            onAddFriend={handleSendRequest}
            onCancelFriendRequest={handleCancel}
            onRefuseFriend={handleDecline}
            onUnFriend={deleteFriend}
          />
        </Modal>
      </View>
    </SafeAreaView>
  );
}
