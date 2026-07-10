import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AvatarInitials from './avatar_initials';
import { Friend } from '../../types/friend.types';

interface SearchResult extends Friend {
  requestSent?: boolean;
}

interface FriendSearchProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onSendRequest: (userId: string) => Promise<void>;
  onBack: () => void;
}

export default function FriendSearch({ onSearch, onSendRequest, onBack }: FriendSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await onSearch(query.trim());
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSend = async (userId: string) => {
    setResults((prev) =>
      prev.map((r) => (r.id === userId ? { ...r, requestSent: true } : r))
    );
    await onSendRequest(userId);
  };

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
      {!loading && query.trim().length > 0 && results.length === 0 && (
        <Text style={styles.hint}>No matches for "{query}"</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <AvatarInitials username={item.username} color={item.avatarColor} />
            <Text style={styles.username}>{item.username}</Text>
            <TouchableOpacity
              disabled={item.requestSent}
              onPress={() => handleSend(item.id)}
              style={[styles.sendButton, item.requestSent && styles.sendButtonDisabled]}
            >
              <Text style={styles.sendButtonText}>
                {item.requestSent ? 'Sent' : 'Add'}
              </Text>
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
