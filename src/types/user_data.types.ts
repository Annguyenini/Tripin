export interface UserData {
  user_id?: number;
  avatarColor?: string;
  user_name: string;
  display_name: string;
  avatar: string;
  location?: string;
}
export interface UserAuthorization {
  user_id: number;
  role: string;
}
