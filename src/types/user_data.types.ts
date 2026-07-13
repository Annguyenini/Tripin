export interface UserData {
  user_id?: number;
  avatarColor?: string;
  user_name: string;
  display_name: string;
  avatar: string;
  location?: string;
}
export interface UserRelationship {
  user_id?: number;
  avatarColor?: string;
  user_name: string;
  display_name: string;
  avatar: string;
  location?: string;
  user_id1?: number;
  user_id2?: number;
  status?: string;
}
export interface UserAuthorization {
  user_id: number;
  role: string;
}
