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
  isEmailFocused = false;
  isSenhaFocused = false;

  private isLoading = false;
  private activeToast: HTMLIonToastElement | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  togglePassword() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  sanitize(input: string): string {
    return input.replace(/[<>]/g, '');
  }

  async login() {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      if (!this.email || !this.senha) {
        await this.presentToast('⚠️ Preencha todos os campos.', 'warning');
        return;
      }

      await this.authService.login(this.email, this.senha);
      this.router.navigateByUrl('/principal');
      await this.presentToast('✅ Login realizado com sucesso!', 'success');
    } catch (error: any) {
      const code = error.code || '';
      const mensagens: Record<string, string> = {
        'auth/user-not-found': 'E-mail ou senha incorretos.',
        'auth/wrong-password': 'E-mail ou senha incorretos.',
        'auth/invalid-email': 'Formato de e-mail inválido.',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.'
      };
      const msg = mensagens[code] || '⚠️ Erro ao realizar login. Verifique sua conexão.';
      await this.presentToast(msg, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async presentToast(mensagem: string, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      color: cor,
      duration: 3000,


    });

    const shadow = toast.shadowRoot;
    if (!shadow) return;

    const toastWrapper = shadow.querySelector('.toast-wrapper.toast-bottom.toast-layout-baseline') as HTMLElement | null;
    const container = shadow.querySelector('.toast-container');
    const content = shadow.querySelector('.toast-content');
    const message = shadow.querySelector('.toast-message');

    container?.classList.add('custom-toast-container');
    content?.classList.add('custom-toast-content');
    message?.classList.add('custom-toast-message');
    container?.setAttribute('style',
      'font-size: 16px; color: #d00000'
    );

    if (toastWrapper) {
      toastWrapper.style.top = '80%';
      toastWrapper.style.borderRadius = '8px';
      toastWrapper.style.height = '60px';
      toastWrapper.style.marginTop = '0px'
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
          case 'medium':
            toastWrapper.style.backgroundColor = '#f0f0f0';
            toastWrapper.style.borderLeft = '6px solid #666';
            break;
        }

    }
    await toast.present();
    this.activeToast = toast;
    toast.onDidDismiss().then(() => (this.activeToast = null));
  }

  toggleAudio() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    const button = document.querySelector('.audio-btn') as HTMLElement;

    if (audio.paused) {
      button.style.display = 'none';
      audio.style.display = 'block';
      audio.play();
    } else {
      audio.pause();
    }

    audio.onended = () => {
      audio.style.display = 'none';
      button.style.display = 'inline-flex';
    };
  }
}
