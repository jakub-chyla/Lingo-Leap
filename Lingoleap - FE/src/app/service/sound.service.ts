import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audio = new Audio();
  private audioCache = new Map<string, Uint8Array>(); // key: attachment ID

  private MAX_CACHE_SIZE = 4;

  playSoundWithId(id: number, data: Uint8Array) {
    const stringId = id.toString();
    if (!this.audioCache.has(stringId)) {
      if (this.audioCache.size >= this.MAX_CACHE_SIZE) {
        const oldestKey = this.audioCache.keys().next().value;
        this.audioCache.delete(oldestKey);
      }
      this.audioCache.set(stringId, data);
    }

    this.playSound(data);
  }

  private playSound(data: Uint8Array) {
    const blob = new Blob([data], { type: 'audio/mp3' });
    const objectUrl = URL.createObjectURL(blob);

    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.src = objectUrl;
    this.audio.load();

    this.audio.oncanplaythrough = () => {
      this.audio.play().catch(err => {
        console.warn('Audio playback error:', err);
      });
    };
  }

  getCachedAudio(id: string): Uint8Array | null {
    return this.audioCache.get(id) || null;
  }
}
