// True YouTube Real Audio & Video Player Engine
// Plays the genuine 100% authentic YouTube audio & video master stream

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export type PlaybackState = 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued';

class RealYouTubePlayerEngine {
  private ytPlayer: any = null;
  private isApiReady = false;
  private isPlayerReady = false;
  private pendingVideoId: string | null = null;
  private isPlaying = false;
  private currentTime = 0;
  private duration = 180;
  private volume = 85;
  private isMuted = false;
  private isVideoMode = false;
  private timeUpdateInterval: any = null;
  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private onStateChangeCallback: ((state: PlaybackState) => void) | null = null;
  private containerId = 'tubeflow-yt-player-host';

  constructor() {
    this.loadYouTubeIframeAPI();
  }

  private loadYouTubeIframeAPI() {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      this.isApiReady = true;
      return;
    }

    // Check if script tag already added
    const existingScript = document.getElementById('youtube-iframe-api-script');
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      this.isApiReady = true;
      if (this.pendingVideoId) {
        this.initPlayer();
      }
    };
  }

  private ensureHostElement(): HTMLElement {
    let host = document.getElementById(this.containerId);
    if (!host) {
      host = document.createElement('div');
      host.id = this.containerId;
      host.style.position = 'fixed';
      host.style.bottom = '95px';
      host.style.right = '20px';
      host.style.width = '320px';
      host.style.height = '180px';
      host.style.zIndex = '40';
      host.style.borderRadius = '16px';
      host.style.overflow = 'hidden';
      host.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6)';
      host.style.border = '1px solid rgba(51, 65, 85, 0.8)';
      host.style.backgroundColor = '#020617';
      host.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      // Keep rendered in DOM so audio decoder & iframe stream remain active
      host.style.opacity = '0';
      host.style.pointerEvents = 'none';
      host.style.transform = 'translateY(16px) scale(0.96)';
      host.style.display = 'block';
      document.body.appendChild(host);

      const playerTarget = document.createElement('div');
      playerTarget.id = 'tubeflow-yt-player-target';
      host.appendChild(playerTarget);
    }
    return host;
  }

  private initPlayer() {
    if (typeof window === 'undefined') return;

    if (!this.isApiReady) {
      if (window.YT && window.YT.Player) {
        this.isApiReady = true;
      } else {
        this.loadYouTubeIframeAPI();
        return;
      }
    }

    if (!this.pendingVideoId && !this.ytPlayer) return;

    this.ensureHostElement();

    if (!this.ytPlayer) {
      try {
        const videoToPlay = this.pendingVideoId || 'JGwWNGJdvx8';
        this.pendingVideoId = null;

        this.ytPlayer = new window.YT.Player('tubeflow-yt-player-target', {
          height: '100%',
          width: '100%',
          videoId: videoToPlay,
          playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              this.isPlayerReady = true;
              try {
                event.target.setVolume(this.volume);
                if (this.pendingVideoId) {
                  event.target.loadVideoById(this.pendingVideoId);
                  this.pendingVideoId = null;
                }
                event.target.playVideo();
                this.startProgressTracking();
              } catch (e) {
                console.warn('Playback onReady warning:', e);
              }
            },
            onStateChange: (event: any) => {
              this.handleStateChange(event.data);
            },
            onError: (error: any) => {
              console.warn('YouTube Player notice code:', error?.data || error);
              this.onStateChangeCallback?.('paused');
            },
          },
        });
      } catch (err) {
        console.warn('Player init note:', err);
      }
    } else if (this.isPlayerReady && this.pendingVideoId) {
      const vid = this.pendingVideoId;
      this.pendingVideoId = null;
      try {
        this.ytPlayer.loadVideoById(vid);
        this.ytPlayer.playVideo();
        this.startProgressTracking();
      } catch (err) {
        console.warn('Failed to load video on existing player:', err);
      }
    }
  }

  private handleStateChange(stateCode: number) {
    if (!window.YT) return;

    if (stateCode === window.YT.PlayerState.PLAYING) {
      this.isPlaying = true;
      const actualDuration = this.ytPlayer?.getDuration?.();
      if (actualDuration && actualDuration > 0) {
        this.duration = actualDuration;
      }
      this.startProgressTracking();
      this.onStateChangeCallback?.('playing');
    } else if (stateCode === window.YT.PlayerState.PAUSED) {
      this.isPlaying = false;
      this.stopProgressTracking();
      this.onStateChangeCallback?.('paused');
    } else if (stateCode === window.YT.PlayerState.ENDED) {
      this.isPlaying = false;
      this.stopProgressTracking();
      this.currentTime = 0;
      this.onTimeUpdateCallback?.(0, this.duration);
      this.onEndCallback?.();
      this.onStateChangeCallback?.('ended');
    } else if (stateCode === window.YT.PlayerState.BUFFERING) {
      this.onStateChangeCallback?.('buffering');
    }
  }

  private startProgressTracking() {
    this.stopProgressTracking();
    this.timeUpdateInterval = setInterval(() => {
      if (this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
        try {
          const time = this.ytPlayer.getCurrentTime() || 0;
          const dur = this.ytPlayer.getDuration() || this.duration;
          this.currentTime = time;
          if (dur > 0) this.duration = dur;
          this.onTimeUpdateCallback?.(time, this.duration);
        } catch {}
      }
    }, 350);
  }

  private stopProgressTracking() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
  }

  /**
   * Play real song from YouTube
   */
  public play(
    videoIdOrTitle: string,
    fallbackDuration: number = 210,
    onProgress?: (time: number, duration: number) => void,
    onEnd?: () => void,
    onStateChange?: (state: PlaybackState) => void
  ) {
    this.onTimeUpdateCallback = onProgress || null;
    this.onEndCallback = onEnd || null;
    this.onStateChangeCallback = onStateChange || null;
    this.duration = fallbackDuration;
    this.currentTime = 0;
    this.isPlaying = true;

    // Clean video ID
    let videoId = videoIdOrTitle;
    if (videoId.includes('v=')) {
      videoId = videoId.split('v=')[1]?.split('&')[0] || videoId;
    } else if (videoId.includes('youtu.be/')) {
      videoId = videoId.split('youtu.be/')[1]?.split('?')[0] || videoId;
    }

    this.ensureHostElement();

    if (this.ytPlayer && this.isPlayerReady && typeof this.ytPlayer.loadVideoById === 'function') {
      try {
        this.ytPlayer.loadVideoById(videoId);
        this.ytPlayer.playVideo();
        this.startProgressTracking();
      } catch {
        this.pendingVideoId = videoId;
        this.initPlayer();
      }
    } else {
      this.pendingVideoId = videoId;
      this.initPlayer();
    }
  }

  public pause() {
    this.isPlaying = false;
    this.stopProgressTracking();
    if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch {}
    }
  }

  public resume() {
    this.isPlaying = true;
    if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      try {
        this.ytPlayer.playVideo();
        this.startProgressTracking();
      } catch {}
    }
  }

  public seek(seconds: number) {
    this.currentTime = seconds;
    if (this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
      try {
        this.ytPlayer.seekTo(seconds, true);
        this.onTimeUpdateCallback?.(seconds, this.duration);
      } catch {}
    }
  }

  public setVolume(val: number) {
    const percent = Math.round(Math.max(0, Math.min(val * 100, 100)));
    this.volume = percent;
    if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
      try {
        this.ytPlayer.setVolume(percent);
        if (percent === 0) {
          this.ytPlayer.mute();
          this.isMuted = true;
        } else if (this.isMuted) {
          this.ytPlayer.unMute();
          this.isMuted = false;
        }
      } catch {}
    }
  }

  public toggleMute(): boolean {
    if (this.ytPlayer && typeof this.ytPlayer.isMuted === 'function') {
      try {
        if (this.ytPlayer.isMuted()) {
          this.ytPlayer.unMute();
          this.isMuted = false;
        } else {
          this.ytPlayer.mute();
          this.isMuted = true;
        }
      } catch {}
    }
    return this.isMuted;
  }

  public setVideoVisibility(visible: boolean) {
    this.isVideoMode = visible;
    const host = document.getElementById(this.containerId);
    if (host) {
      if (visible) {
        host.style.opacity = '1';
        host.style.pointerEvents = 'auto';
        host.style.transform = 'translateY(0) scale(1)';
      } else {
        host.style.opacity = '0';
        host.style.pointerEvents = 'none';
        host.style.transform = 'translateY(16px) scale(0.96)';
      }
    }
  }

  public isVideoVisible(): boolean {
    return this.isVideoMode;
  }

  public stop() {
    this.isPlaying = false;
    this.stopProgressTracking();
    if (this.ytPlayer && typeof this.ytPlayer.stopVideo === 'function') {
      try {
        this.ytPlayer.stopVideo();
      } catch {}
    }
    this.setVideoVisibility(false);
  }
}

export const audioPlayer = new RealYouTubePlayerEngine();

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function parseDurationToSeconds(timeStr: string): number {
  if (!timeStr) return 180;
  const parts = String(timeStr).split(':').map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 180;
}

export function formatViews(views: number | string): string {
  if (typeof views === 'string') {
    if (views.includes('views') || views.includes('M') || views.includes('B') || views.includes('K')) {
      return views.replace('views', '').trim();
    }
    const parsed = parseInt(views.replace(/[^\d]/g, ''), 10);
    if (!isNaN(parsed)) views = parsed;
  }

  const num = typeof views === 'number' ? views : 100000;
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
