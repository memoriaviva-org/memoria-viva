import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-esqueci-minha-senha',
  templateUrl: './esqueci-minha-senha.page.html',
  styleUrls: ['./esqueci-minha-senha.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EsqueciMinhaSenhaPage {

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  isEmailFocused = false;
  email = '';
  errorMessage = '';

  private activeToast: HTMLIonToastElement | null = null;
  private isLoading = false;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) {}

  sanitize(input: string): string {
    return input.replace(/[<>"'\/]/g, '');
  }

  async onResetPassword() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.errorMessage = '';

    const sanitizedEmail = this.sanitize(this.email.trim());

    if (!sanitizedEmail) {
      this.errorMessage = 'Digite um e-mail.';
      this.isLoading = false;
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail);
    if (!emailValido) {
      this.errorMessage = 'Formato de e-mail inválido.';
      this.isLoading = false;
      return;
    }
    
    if (this.email.length > 254) {
      this.errorMessage = 'E-mail muito longo.';
      return;
    }


    try {
      const result = await this.authService.resetPassword(sanitizedEmail);

      if (result.success) {
        await this.presentToast(this.sanitize(result.message), 'success');
        this.email = '';

        await this.router.navigate(['/login']);
      } else {
        this.errorMessage = this.sanitize(result.message);
      }

    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      this.errorMessage = 'Ocorreu um erro ao tentar redefinir a senha. Tente novamente mais tarde.';
    } finally {
      this.isLoading = false;
    }
  }

  async presentToast(mensagem: string, tipo: 'success' | 'warning' | 'danger') {
    if (this.activeToast) {
      await this.activeToast.dismiss();
    }

    const cores: Record<string, string> = {
      success: '#28a745',
      warning: '#ffcc00',
      danger: '#ff3b30'
    };

    const toast = await this.toastController.create({
      message: this.sanitize(mensagem),
      duration: 3000,
      position: 'bottom',
      cssClass: 'custom-toast',
      animated: true
    });

    await toast.present();

    const shadow = toast.shadowRoot;
    if (shadow) {
      const wrapper = shadow.querySelector('.toast-wrapper') as HTMLElement | null;
      if (wrapper) {
        wrapper.style.background = cores[tipo];
        wrapper.style.color = '#fff';
        wrapper.style.borderRadius = '10px';
        wrapper.style.fontSize = '16px';
        wrapper.style.textAlign = 'center';
        wrapper.style.padding = '10px 12px';
      }
    }

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
