import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  audio = new Audio();

  playSound(data: Uint8Array) {
    const blob = new Blob([data], {type: 'audio/mp3'});
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
}
