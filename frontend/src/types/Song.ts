import type { Album, Author } from "./data";

export class Song {
  id: number;
  _title: string;
  author: Author;
  album: Album;
  genre?: string | null;
  year?: number | null;
  filePath: string;
  fileName: string;
  folderId?: number | null;
  duration?: number | null;
  fileSize: number;
  fileFormat: string;
  image?: string | null;
  playCount?: number;
  lastPlayed?: string | null;
  rating: number | null;

  constructor(data: Partial<Song> = {}) {
    this.id = data.id ?? 0;
    this._title = data.title || data.fileName || "Unknown Title";
    // TODO: Backend should ensure author and album are always present, same unknown album and authro for all songs that don't have them
    this.author = data.author || { id: 0, name: "Unknown Author" };
    this.album = data.album || {
      id: 0,
      title: "Unknown Album",
      author: { id: -1, name: "Unknown Author" },
    };
    this.genre = data.genre ?? null;
    this.year = data.year ?? null;
    this.filePath = data.filePath ?? "";
    this.fileName = data.fileName ?? "";
    this.folderId = data.folderId ?? null;
    this.duration = data.duration ?? null;
    this.fileSize = data.fileSize ?? 0;
    this.fileFormat = data.fileFormat ?? "";
    this.image = data.image ?? null;
    this.playCount = data.playCount ?? 0;
    this.lastPlayed = data.lastPlayed ?? null;
    this.rating = data.rating ?? null;
  }

  get title(): string {
    return this._title;
  }

  get displayName(): string {
    if (this.author.name === "Unknown Author") {
      return this.title;
    }
    return `${this.author.name} - ${this.title}`;
  }
}
