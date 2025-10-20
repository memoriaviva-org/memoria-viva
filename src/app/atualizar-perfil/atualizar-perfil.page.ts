import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-atualizar-perfil',
  templateUrl: './atualizar-perfil.page.html',
  styleUrls: ['./atualizar-perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AtualizarPerfilPage implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  nome = '';
  email = '';
  idade = 0;
  password = '';

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      // Pega o usuário atual como Promise
      const user = await firstValueFrom(this.authService.getCurrentUser());
      if (!user) return;

      await user.reload();
      this.email = user.email ?? '';
      this.nome = user.displayName ?? '';

      // Busca dados adicionais no Firestore
      const userData = await this.authService.getUserData(user.uid);
      if (userData) {
        this.idade = userData['idade'] ?? 0;
        this.nome = userData['nome'] ?? this.nome;
      }
    } catch (err) {
      console.error('Erro ao carregar dados do usuário:', err);
    }
  }

  async atualizarDados() {
    try {
      await this.authService.updateUserData(this.nome, this.idade);

      if (this.email) {
        const res = await this.authService.updateUserEmail(this.email, this.password);
        if (!res.success) throw new Error(res.message);
      }

      const toast = await this.toastController.create({
        message: 'Dados atualizados com sucesso!',
        duration: 2000,
        color: 'success'
      });
      toast.present();

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
      'font-size: 16px; color:#00d023'
    );

    if (toastWrapper) {
      toastWrapper.style.top = '80%';
      toastWrapper.style.borderRadius = '8px';
      toastWrapper.style.height = '60px';
      toastWrapper.style.marginTop = '0px'
      toastWrapper.style.width = '75%';
      toastWrapper.style.backgroundColor = 'white';
      toastWrapper.style.borderLeft = '6px solid #00d023';
    }
    await toast.present();

    } catch (error: any) {
      const toast = await this.toastController.create({
        message: error.message || 'Erro ao atualizar dados.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      console.error('Erro ao atualizar dados:', error);

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
      toastWrapper.style.backgroundColor = '#ffecec';
      toastWrapper.style.borderLeft = '6px solid #ff3b30';
    }
    await toast.present();
    }
  }

  async logout() {
    await this.authService.logout();
    const toast = await this.toastController.create({
      message: 'Você saiu da conta.',
      duration: 2000,
      color: 'medium'
    });
    toast.present();
    this.router.navigateByUrl('/home');

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
      toastWrapper.style.backgroundColor = '#ffecec';
      toastWrapper.style.borderLeft = '6px solid #ff3b30';
    }
    await toast.present();
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
