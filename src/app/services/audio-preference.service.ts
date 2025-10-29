import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioPreferenceService {
  private autoPlay = false;

  setAutoPlay(value: boolean) {
    this.autoPlay = value;
    localStorage.setItem('audioAutoPlay', String(value));
  }

  getAutoPlay(): boolean {
    const stored = localStorage.getItem('audioAutoPlay');
    return stored ? stored === 'true' : this.autoPlay;
  }
}
