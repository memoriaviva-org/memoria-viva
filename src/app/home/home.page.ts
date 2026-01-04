import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { AuthService } from '../../app/services/auth.service';
import { AudioPreferenceService } from '../services/audio-preference.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private audioPref: AudioPreferenceService
  ) {}

  // ---------- LOGIN GOOGLE ----------
  async loginGoogle() {
    try {
      await this.authService.loginWithGoogle();
    } catch (error: any) {
      this.presentToast(
        'Erro ao logar com Google: ' + error.message,
        'danger'
      );
    }
  }

  // ---------- LOGIN FACEBOOK ----------
  async loginFacebook() {
    try {
      await this.authService.loginWithFacebook();
    } catch (error: any) {
      this.presentToast(
        'Erro ao logar com Facebook: ' + error.message,
        'danger'
      );
    }
  }

  // ---------- TOAST ----------
  async presentToast(mensagem: string, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      color: cor,
      duration: 2000
    });

    const shadow = toast.shadowRoot;
    if (shadow) {
      const toastWrapper = shadow.querySelector(
        '.toast-wrapper'
      ) as HTMLElement | null;

      if (toastWrapper) {
        toastWrapper.style.top = '80%';
        toastWrapper.style.borderRadius = '8px';
        toastWrapper.style.height = '60px';
        toastWrapper.style.width = '75%';

        switch (cor) {
          case 'success':
            toastWrapper.style.backgroundColor = '#e0f8e4';
            toastWrapper.style.borderLeft = '6px solid #00ff26';
            toastWrapper.style.color = '#018f16';
            break;
          case 'danger':
            toastWrapper.style.backgroundColor = '#ffecec';
            toastWrapper.style.borderLeft = '6px solid #ff3b30';
            toastWrapper.style.color = '#d00000';
            break;
          case 'warning':
            toastWrapper.style.backgroundColor = '#ffecec';
            toastWrapper.style.borderLeft = '6px solid #ff3b30';
            toastWrapper.style.color = '#d00000';
            break;
        }
      }
    }

    await toast.present();
  }

  // ---------- ÁUDIO ----------
  toggleAudio() {
    this.audioPref.toggleAudio(this.audioPlayer);
  }

  // ---------- AUTO REDIRECT ----------
  ngOnInit() {
    this.authService.getCurrentUserOnce().then(user => {
      if (user) {
        this.router.navigateByUrl('/principal');
      }
    });
  }
}
