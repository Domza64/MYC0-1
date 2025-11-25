export interface Playlist {
  id: number;
  name: string;
  description?: string;
  shared: boolean;
  user_id: string;
  playlist_image?: string;
  username: string;
}
