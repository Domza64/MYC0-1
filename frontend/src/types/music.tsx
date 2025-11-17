export interface Playlist {
  id: string;
  name: string;
  description?: string;
  shared: boolean;
  user_id: string;
  playlist_image?: string;
}
