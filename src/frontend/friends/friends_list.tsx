import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AvatarInitials from './avatar_initials';
import { Friend } from '../../types/friend.types';
import { UserData } from '../../types/user_data.types';

interface FriendsListProps {
  friends: UserData[];
  loading?: boolean;
  onOpenChat: (friendId: string) => void;
}

export default function FriendsList({ friends, loading, onOpenChat }: FriendsListProps) {
  if (loading) {
    return <Text style={styles.hint}>Loading friends…</Text>;
  }

  if (friends.length === 0) {
    return <Text style={styles.hint}>No friends yet. Try the search icon above.</Text>;
  }

  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => `${item.user_id}`}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <AvatarInitials username={item.display_name} color={item.avatarColor} />
          <View style={styles.info}>
            <Text style={styles.username}>{item.display_name}</Text>
            {!!!item.location && <Text style={styles.subtext}>@{item.user_name}</Text>}
          </View>
          {/*<TouchableOpacity onPress={() => onOpenChat(item.id)} accessibilityLabel="Message">
            <Feather name="message-circle" size={18} color="#8A8A86" />
          </TouchableOpacity>*/}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E5E4DD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  info: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A18',
  },
  subtext: {
    fontSize: 12,
    color: '#8A8A86',
    marginTop: 2,
  },
  hint: {
    fontSize: 13,
    color: '#8A8A86',
    textAlign: 'center',
    paddingVertical: 32,
  },
});
