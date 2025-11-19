import { Injectable, ElementRef } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AudioPreferenceService {
  private isAudioVisible = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private currentAudioButton: HTMLElement | null = null;

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

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
      try {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data() as any;
          const firestoreValue = data.audioAutoPlay;
          localStorage.setItem('audioAutoPlay', String(firestoreValue));
          return firestoreValue;
        }
      } catch (error) {
        console.error('Erro ao buscar preferência do Firestore:', error);
      }
    }

    return localValue;
  }

  /** Alterna áudio e botão */
  toggleAudio(audioRef: ElementRef<HTMLAudioElement>) {
    const audio = audioRef.nativeElement;
    const button = document.querySelector('.audio-btn') as HTMLElement;
    
    if (!button) return;

    // Atualiza referências atuais
    this.currentAudioElement = audio;
    this.currentAudioButton = button;

    if (audio.paused) {
      this.showAudio(audio, button);
      audio.play().catch(error => {
        console.error('Erro ao reproduzir áudio:', error);
        this.hideAudio(audio, button);
      });
    } else {
      audio.pause();
      // Não chama hideAudio aqui - deixa o usuário controlar manualmente
    }

    // Só esconde quando terminar naturalmente
    audio.onended = () => this.hideAudio(audio, button);
  }

  /** Executa autoplay se ativado */
  async autoPlayIfEnabled(audioRef: ElementRef<HTMLAudioElement>) {
    const autoPlay = await this.getAutoPlay();
    if (autoPlay) {
      setTimeout(() => {
        const audio = audioRef.nativeElement;
        const button = document.querySelector('.audio-btn') as HTMLElement;
        
        if (audio && button) {
          // Mostra o áudio e esconde o botão (igual ao toggleAudio)
          this.showAudio(audio, button);
          
          // Configura o evento ended para esconder o áudio e mostrar o botão
          audio.onended = () => this.hideAudio(audio, button);
          
          // Toca o áudio
          audio.play().catch(error => {
            console.error('Erro no autoplay:', error);
            // Se der erro, mostra o botão novamente
            this.hideAudio(audio, button);
          });
        }
      }, 500);
    } else {
      // Garante que o botão está visível se autoplay estiver desativado
      const button = document.querySelector('.audio-btn') as HTMLElement;
      if (button) {
        button.style.display = 'inline-flex';
      }
    }
  }

  /** Sincroniza estado visual ao entrar na página */
  syncAudioState(audioRef: ElementRef<HTMLAudioElement>) {
    const audio = audioRef.nativeElement;
    const button = document.querySelector('.audio-btn') as HTMLElement;
    
    if (!button) return;

    if (audio.style.display === 'block' || !audio.paused) {
      this.showAudio(audio, button);
    } else {
      this.hideAudio(audio, button);
    }
  }

  /** Mostra player e oculta botão */
  private showAudio(audio: HTMLAudioElement, button?: HTMLElement) {
    audio.style.display = 'block';
    if (button) {
      button.style.display = 'none';
    }
    this.isAudioVisible = true;
  }

  /** Esconde player e mostra botão */
  private hideAudio(audio: HTMLAudioElement, button: HTMLElement) {
    audio.style.display = 'none';
    button.style.display = 'inline-flex';
    this.isAudioVisible = false;
  }
}
