import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audio = new Audio();

  public playSound(blob: Blob) {
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
