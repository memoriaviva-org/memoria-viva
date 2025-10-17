import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})

export class LoginPage {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarSenha = false;
  email = '';
  senha = '';
  isEmailFocused: boolean = false;
  isSenhaFocused: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
  ) {}

  togglePassword() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  async login() {
    try {
      await this.authService.login(this.email, this.senha);
      this.router.navigateByUrl('/principal');
    } catch (error: any) {
      this.presentToast('Erro ao logar: ' + (error.message || error), 'danger');
    }
  }

  async loginGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigateByUrl('/principal');
    } catch (error: any) {
      this.presentToast('Erro ao logar com Google: ' + (error.message || error), 'danger');
    }
  }


  async presentToast(mensagem: string, cor: string) {
  const toast = await this.toastController.create({
    message: mensagem,
    color: cor,
    duration: 9999999,
  });

  await toast.present();

  // O toast JÁ é o elemento <ion-toast>
  const shadow = toast.shadowRoot;
  if (!shadow) return;

  const container = shadow.querySelector('.toast-container');
  const content = shadow.querySelector('.toast-content');
  const message = shadow.querySelector('.toast-message');

  container?.classList.add('custom-toast-container');
  content?.classList.add('custom-toast-content');
  message?.classList.add('custom-toast-message');
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
