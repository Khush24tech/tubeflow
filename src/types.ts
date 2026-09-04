export interface ArtistProfile {
  id?: string | number;
  name: string;
  picture: string;
  fans?: number;
  genre?: string;
  verified?: boolean;
}

export interface Track {
  videoId: string;
  title: string;
  author: {
    name: string;
  };
  timestamp: string;
  views: number;
  ago?: string;
  thumbnail: string;
  description?: string;
  category?: string;
  url?: string;
  previewUrl?: string;
  artistImage?: string;
  releaseYear?: string | number;
}

export interface FormatOption {
  format: 'mp3' | 'm4a' | 'flac' | 'mp4';
  quality: string;
  size: string;
  ext: string;
  mime: string;
}

export interface TrackFormats {
  audio: FormatOption[];
  video: FormatOption[];
}

export interface DownloadJob {
  id: string;
  track: Track;
  format: 'mp3' | 'm4a' | 'flac' | 'mp4';
  quality: string;
  progress: number;
  status: 'preparing' | 'converting' | 'downloading' | 'completed' | 'error';
  fileSize: string;
  timestamp: number;
  downloadUrl?: string;
  errorMessage?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
