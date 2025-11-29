import type { Album, Author } from "./data";

export class Song {
  id: number;
  _title: string;
  author: Author;
  album: Album;
  genre?: string | null;
  year?: number | null;
  file_path: string;
  file_name: string;
  folder_id?: number | null;
  duration?: number | null;
  file_size: number;
  file_format: string;
  image?: string | null;
  play_count?: number;
  last_played?: string | null;

  constructor(data: Partial<Song> = {}) {
    this.id = data.id ?? 0;
    this._title = data.title || data.file_name || "Unknown Title";
    // TODO: Backend should ensure author and album are always present, same unknown album and authro for all songs that don't have them
    this.author = data.author || { id: 0, name: "Unknown Author" };
    this.album = data.album || { id: 0, title: "Unknown Album", author_id: -1 };
    this.genre = data.genre ?? null;
    this.year = data.year ?? null;
    this.file_path = data.file_path ?? "";
    this.file_name = data.file_name ?? "";
    this.folder_id = data.folder_id ?? null;
    this.duration = data.duration ?? null;
    this.file_size = data.file_size ?? 0;
    this.file_format = data.file_format ?? "";
    this.image = data.image ?? null;
    this.play_count = data.play_count ?? 0;
    this.last_played = data.last_played ?? null;
  }

  get title(): string {
    return this._title;
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
    if (this.author.name === "Unknown Author") {
      return this.title;
    }
    return `${this.author.name} - ${this.title}`;
  }

  // Convert to plain object (for API calls)
  toJSON(): any {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      album: this.album,
      genre: this.genre,
      year: this.year,
      file_path: this.file_path,
      file_name: this.file_name,
      folder_id: this.folder_id,
      duration: this.duration,
      file_size: this.file_size,
      file_format: this.file_format,
      image: this.image,
      play_count: this.play_count,
      last_played: this.last_played,
    };
  }
}
