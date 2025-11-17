export class Song {
  id: number;
  title: string;
  artist: string | null;
  album: string | null;
  genre?: string | null;
  year?: number | null;
  file_path: string;
  file_name: string;
  folder_id?: number | null;
  duration?: number | null;
  file_size: number;
  file_format: string;
  album_art?: string | null;
  play_count?: number;
  last_played?: string | null;

  constructor(data: Partial<Song> = {}) {
    this.id = data.id ?? 0;
    this.title = data.title ?? data.file_name ?? "Unknown Title";
    this.artist = data.artist ?? "Unknown Artist";
    this.album = data.album ?? "Unknown Album";
    this.genre = data.genre ?? "Unknown Genre";
    this.year = data.year ?? null;
    this.file_path = data.file_path ?? "";
    this.file_name = data.file_name ?? "";
    this.folder_id = data.folder_id ?? null;
    this.duration = data.duration ?? null;
    this.file_size = data.file_size ?? 0;
    this.file_format = data.file_format ?? "";
    this.album_art = data.album_art ?? null;
    this.play_count = data.play_count ?? 0;
    this.last_played = data.last_played ?? null;
  }

  get formattedFileSize(): string {
    if (this.file_size === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB"];
    let size = this.file_size;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  get displayName(): string {
    if (this.title === "Unknown Title") {
      return this.file_name;
    }
    return `${this.artist} - ${this.title}`;
  }

  // Convert to plain object (for API calls)
  toJSON(): any {
    return {
      id: this.id,
      title: this.title,
      artist: this.artist,
      album: this.album,
      genre: this.genre,
      year: this.year,
      file_path: this.file_path,
      file_name: this.file_name,
      folder_id: this.folder_id,
      duration: this.duration,
      file_size: this.file_size,
      file_format: this.file_format,
      album_art: this.album_art,
      play_count: this.play_count,
      last_played: this.last_played,
    };
  }
}
