import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../app/services/auth.service';
import { ToastController, Platform } from '@ionic/angular';


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
    private platform: Platform) {}

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
    toast.present();
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
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    const button = document.querySelector('.audio-btn') as HTMLElement;

    if (audio.paused) {
        // Esconde botão e mostra player
        button.style.display = 'none';
        audio.style.display = 'block';
        audio.play();
      } else {
        audio.pause();
      }

        // Quando terminar, esconde player e volta botão
        audio.onended = () => {
        audio.style.display = 'none';
        button.style.display = 'inline-flex'; // volta o ion-button
      };
   }
}
