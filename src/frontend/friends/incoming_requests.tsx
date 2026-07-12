import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
  import { Feather } from '@expo/vector-icons';
import AvatarInitials from './avatar_initials';
import { FriendRequest } from '../../types/friend.types';
import { UserData } from '../../types/user_data.types';

interface IncomingRequestsProps {
  requests: UserData[];
  loading?: boolean;
  onAccept: (requestId: number) => void;
  onDecline: (requestId: number) => void;
  onBack: () => void;
  selectUserHandler:(userdata:UserData)=>void
}

export default function IncomingRequests({
  requests,
  loading,
  onAccept,
  onDecline,
  onBack,
  selectUserHandler
}: IncomingRequestsProps) {
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} accessibilityLabel="Back">
          <Feather name="arrow-left" size={18} color="#5A5A56" />
        </TouchableOpacity>
        <Text style={styles.title}>Incoming requests</Text>
      </View>

      {loading && <Text style={styles.hint}>Loading…</Text>}
      {!loading && requests.length === 0 && (
        <Text style={styles.hint}>No incoming requests right now</Text>
      )}

      <FlatList
        data={requests}
        keyExtractor={(item) => `${item.user_id}`}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity onPress={()=>selectUserHandler(item)}>
            <AvatarInitials target_user_data={item} />
            <View style={styles.info}>
              <Text style={styles.username}>{item.display_name}</Text>
              <Text style={styles.subtext}>
                <Text style={{fontWeight: "bold"}}>
                  @{item.user_name}
                </Text>
                {" wants to be friends"}
              </Text>              {/*<Text style={styles.subtext}>wants to be friends</Text>*/}
            </View>
            <TouchableOpacity
              onPress={() => onAccept(item.user_id)}
              style={styles.acceptButton}
              accessibilityLabel="Accept"
            >
              <Feather name="check" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDecline(item.user_id)}
              style={styles.declineButton}
              accessibilityLabel="Decline"
            >
              <Feather name="x" size={16} color="#5A5A56" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A18',
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
  acceptButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1D9E75',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#D8D7CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 13,
    color: '#8A8A86',
    textAlign: 'center',
    paddingVertical: 32,
  },
});
