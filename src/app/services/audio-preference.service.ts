import { Injectable, ElementRef } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AudioPreferenceService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  /** Define a preferência do usuário (true = auto, false = manual) */
  async setAutoPlay(value: boolean) {
    const user = this.auth.currentUser;
    if (user) {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userRef, { audioAutoPlay: value }, { merge: true });
    }
    localStorage.setItem('audioAutoPlay', String(value));
  }

  /** Retorna a preferência (com cache local) */
  async getAutoPlay(): Promise<boolean> {
    const cached = localStorage.getItem('audioAutoPlay');
    const localValue = cached === 'true';

    const user = this.auth.currentUser;
    if (user) {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      getDoc(userRef)
        .then(snap => {
          if (snap.exists()) {
            const data = snap.data() as any;
            localStorage.setItem('audioAutoPlay', String(data.audioAutoPlay));
          }
        })
        .catch(() => {});
    }

    return localValue;
  }

  /** Alterna áudio e botão */
  toggleAudio(audioRef: ElementRef<HTMLAudioElement>) {
    const audio = audioRef.nativeElement;
    const button = document.querySelector('.audio-btn') as HTMLElement;
    if (!button) return;

    if (audio.paused) {
      this.showAudio(audio, button);
      audio.play();
    } else {
      audio.pause();
    }

    audio.onended = () => this.hideAudio(audio, button);
  }

  /** Executa autoplay se ativado */
  async autoPlayIfEnabled(audioRef: ElementRef<HTMLAudioElement>) {
    const autoPlay = await this.getAutoPlay();
    if (autoPlay) {
      setTimeout(() => {
        this.showAudio(audioRef.nativeElement);
        audioRef.nativeElement.play();
      }, 500);
    }
  }

  /** Mostra player e oculta botão */
  private showAudio(audio: HTMLAudioElement, button?: HTMLElement) {
    audio.style.display = 'block';
    if (button) button.style.display = 'none';
  }

  /** Esconde player e mostra botão */
  private hideAudio(audio: HTMLAudioElement, button: HTMLElement) {
    audio.style.display = 'none';
    button.style.display = 'inline-flex';
  }
}