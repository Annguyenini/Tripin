import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AvatarInitials from './avatar_initials';
import { Friend } from '../../types/friend.types';
import UsersHandler from '../../app-core/flow/handlers/users/users_handler';
import { UserData } from '../../types/user_data.types';
import { UserCard } from './user/user_card';
import { OverlayCard } from '../overlay/overlay_card';
import UserDataService from '../../backend/storage/async_storage/user';

interface SearchResult extends Friend {
  requestSent?: boolean;
}

interface FriendSearchProps {
  onSendRequest: (userId: string) => Promise<void>;
  selectUserHandler:(userdata:UserData) =>void
  onBack: () => void;
}

export default function FriendSearch({ onSendRequest, onBack,selectUserHandler }: FriendSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserData,setSelectedUserData] = useState<UserData>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const user_id = UserDataService.getUserId()
  const onSearch = async (keywords) => {
    const result = await UsersHandler.searchUsers(keywords)
    return result
  }
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await onSearch(query.trim());
        if (!data) return
        console.log(data)
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);


  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} accessibilityLabel="Back">
          <Feather name="arrow-left" size={18} color="#5A5A56" />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <Feather name="search" size={16} color="#B5B4AC" style={{ marginRight: 8 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by username"
            placeholderTextColor="#B5B4AC"
            autoFocus
            style={styles.input}
          />
        </View>
      </View>

      {loading && <Text style={styles.hint}>Searching…</Text>}
      {!loading && query.trim().length === 0 && (
        <Text style={styles.hint}>Start typing to find people</Text>
      )}
      {!loading && query.trim().length <3 && query.trim().length >0 && (
        <Text style={styles.hint}>Need more than 3 letters</Text>
      )}
      {!loading && query.trim().length > 3 && results.length === 0 && (
        <Text style={styles.hint}>No matches for "{query}"</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=>selectUserHandler(item)}>
          <View style={styles.row}>
            <AvatarInitials target_user_data={item}/>
              <Text style={styles.username}>@{item.user_name}</Text>
              {/*<TouchableOpacity
                disabled={item.status}
                onPress={() => handleSend(item.id)}
                style={[styles.sendButton, item.status && styles.sendButtonDisabled]}
              >
                <Text style={styles.sendButtonText}>
                  {item.status === 'FRIEND' ? 'friend' : ''}
                  {(item.status === 'REQ_1' && item.user_i1 === user_id) ? 'sent' :''}
                </Text>
              </TouchableOpacity>*/}
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
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#D8D7CE',
    borderRadius: 8,
    height: 36,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
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
  username: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A18',
  },
  sendButton: {
    backgroundColor: '#D85A30',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E4DD',
  },
  sendButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  hint: {
    fontSize: 13,
    color: '#8A8A86',
    textAlign: 'center',
    paddingVertical: 32,
  },
});
