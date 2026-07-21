import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AvatarInitials from './avatar_initials';
import { FriendRequest } from '../../types/friend.types';
import { UserData } from '../../types/user_data.types';
interface OutgoingRequestsProps {
  requests: UserData[];
  loading?: boolean;
  onCancel: (requestId: number) => void;
  onBack: () => void;
  selectUserHandler:(userdata:UserData)=>void

}

export default function OutgoingRequests({
  requests,
  loading,
  onCancel,
  onBack,
  selectUserHandler
}: OutgoingRequestsProps) {
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} accessibilityLabel="Back">
          <Feather name="arrow-left" size={18} color="#5A5A56" />
        </TouchableOpacity>
        <Text style={styles.title}>Outgoing requests</Text>
      </View>

      {loading && <Text style={styles.hint}>Loading…</Text>}
      {!loading && requests?.length === 0 && (
        <Text style={styles.hint}>No pending requests</Text>
      )}

      <FlatList
        data={requests}
        keyExtractor={(item) => `${item.user_id}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=>selectUserHandler(item)}>

          <View style={styles.row}>
            <AvatarInitials target_user_data={item} />
            <View style={styles.info}>
              <Text style={styles.username}>{item.display_name}</Text>
              <Text style={styles.subtext}>
                <Text style={{fontWeight: "bold"}}>
                  @{item.user_name}
                </Text>
                {" Pending"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => onCancel(item.user_id)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

          </View>
          </TouchableOpacity>
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
  cancelButton: {
    borderWidth: 0.5,
    borderColor: '#D8D7CE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    fontSize: 12,
    color: '#5A5A56',
  },
  hint: {
    fontSize: 13,
    color: '#8A8A86',
    textAlign: 'center',
    paddingVertical: 32,
  },
});
