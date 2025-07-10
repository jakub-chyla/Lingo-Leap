import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audio = new Audio();

  public playSound(blob: Blob) {

    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.src = URL.createObjectURL(blob);
    this.audio.play().catch(err => {
      console.warn('Audio playback error:', err);
    });
  }

}
