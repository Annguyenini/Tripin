export interface Friend {
  id: string;
  username: string;
  location?: string;
  avatarColor: string;
}

export interface FriendRequest {
  id: string;
  username: string;
  avatarColor: string;
}

export type FriendsView = 'friends' | 'search' | 'incoming' | 'outgoing';
