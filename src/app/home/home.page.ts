import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../app/services/auth.service';
import { ToastController, Platform } from '@ionic/angular';

import { AudioPreferenceService } from '../services/audio-preference.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private platform: Platform,
    private audioPref: AudioPreferenceService) {}


  async loginGoogle() {
  try {
    await this.authService.loginWithGoogle();
    this.router.navigateByUrl('/principal');
  } catch (error: unknown) {
    if (error instanceof Error) {
      this.presentToast('Erro ao logar com Google: ' + error.message, 'danger');
    } else {
      this.presentToast('Erro desconhecido ao logar com Google.', 'danger');
    }
  }
}
  async presentToast(mensagem: string, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      color: cor,
      duration: 2000
    });

    const shadow = toast.shadowRoot;
    if (shadow) {
      const toastWrapper = shadow.querySelector('.toast-wrapper') as HTMLElement | null;

      if (toastWrapper) {
        toastWrapper.style.top = '80%';
        toastWrapper.style.borderRadius = '8px';
        toastWrapper.style.height = '60px';
        toastWrapper.style.marginTop = '0px';
        toastWrapper.style.width = '75%';

        switch (cor) {
          case 'success':
            toastWrapper.style.backgroundColor = '#e0f8e4';
            toastWrapper.style.borderLeft = '6px solid #00ff26';
            toastWrapper.style.color = '#018f16';
            break;
          case 'warning':
            toastWrapper.style.backgroundColor = '#ffecec';
            toastWrapper.style.borderLeft = '6px solid #ff3b30';
            toastWrapper.style.color = '#d00000';
            break;
          case 'danger':
            toastWrapper.style.backgroundColor = '#ffecec';
            toastWrapper.style.borderLeft = '6px solid #ff3b30';
            toastWrapper.style.color = '#d00000';
            break;
          case 'medium':
            toastWrapper.style.backgroundColor = '#f0f0f0';
            toastWrapper.style.borderLeft = '6px solid #666';
            break;
        }
      }

      const container = shadow.querySelector('.toast-container');
      const content = shadow.querySelector('.toast-content');
      const messageEl = shadow.querySelector('.toast-message');

      container?.classList.add('custom-toast-container');
      content?.classList.add('custom-toast-content');
      messageEl?.classList.add('custom-toast-message');

      container?.setAttribute('style', 'font-size: 16px;');
    }

    await toast.present();
  }

  async loginFacebook() {
    try {
      // verifica se está em ambiente mobile (Capacitor)
      if (this.platform.is('capacitor')) {
        await this.authService.loginWithFacebook();
      } else {
        this.presentToast('O login com Facebook funciona apenas no app móvel.', 'warning');
        return;
      }

      this.router.navigateByUrl('/principal');
    } catch (error: any) {
      this.presentToast('Erro ao logar com Facebook: ' + error.message, 'danger');
    }
  }

  
  toggleAudio() {
    this.audioPref.toggleAudio(this.audioPlayer);
  }
}
