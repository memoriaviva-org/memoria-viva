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
  dataNasc: string = ''; // Alterado para string para compatibilidade com input date
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
        // Converte Timestamp para string no formato yyyy-mm-dd
        if (userData['dataNasc']) {
          const dataNascTimestamp = userData['dataNasc'];
          const dataNascDate = dataNascTimestamp.toDate();
          this.dataNasc = this.formatDateForInput(dataNascDate);
        }
        this.nome = userData['nome'] ?? this.nome;
      }
    } catch (err) {
      console.error('Erro ao carregar dados do usuário:', err);
    }
  }

  // Método para formatar Date para string no formato yyyy-mm-dd
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  async atualizarDados() {
  try {
    // 1. Validação de campos obrigatórios
    if (!this.nome.trim()) throw new Error('O nome é obrigatório.');
    if (!this.dataNasc) throw new Error('A data de nascimento é obrigatória.');

    // 2. Sanitização do nome
    this.nome = this.nome
      .trim()
      .replace(/[=\/?*$&'"@()#!+<>$%{}-]/g, ''); // remove caracteres potencialmente perigosos
    if (this.nome.length > 50) throw new Error('O nome deve ter no máximo 50 caracteres.');

    // 3. Validação de e-mail
    if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email))
      throw new Error('E-mail inválido.');
    if (this.email.length > 100) throw new Error('O e-mail deve ter no máximo 100 caracteres.');

    // 4. Validação e normalização da data
    const [ano, mes, dia] = this.dataNasc.split('-').map(Number);
    const dataNascDate = new Date(ano, mes - 1, dia, 12);


    // 5. Validação de idade mínima (pelo menos 10 anos)
    const idadeMinima = 10;
    const hoje = new Date();
    const diff = hoje.getFullYear() - dataNascDate.getFullYear();
    const ajustaAniversario =
      hoje.getMonth() < dataNascDate.getMonth() ||
      (hoje.getMonth() === dataNascDate.getMonth() && hoje.getDate() < dataNascDate.getDate());
    const idade = ajustaAniversario ? diff - 1 : diff;

    if (idade < idadeMinima) {
      throw new Error('Você precisa ter pelo menos 10 anos para usar o aplicativo.');
    }

    // 5. Atualização segura no Firestore
    await this.authService.updateUserData(this.nome, dataNascDate);

    // 6. Atualizar e-mail se alterado
    const currentUser = await firstValueFrom(this.authService.getCurrentUser());
    if (currentUser && this.email !== currentUser.email) {
      await this.authService.updateUserEmail(this.email, this.password);
    }

    await this.showToast('Dados atualizados com sucesso!', 'success');
  } catch (error: any) {
    console.error('Erro ao atualizar dados:', error);
    await this.showToast(error.message || 'Erro ao atualizar dados.', 'danger');
  }
}


  private async showToast(message: string, color: 'success' | 'danger' | 'medium') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color
    });

    // Estilização customizada do toast
    const shadow = toast.shadowRoot;
    if (shadow) {
      const toastWrapper = shadow.querySelector('.toast-wrapper') as HTMLElement | null;

      if (toastWrapper) {
        toastWrapper.style.top = '80%';
        toastWrapper.style.borderRadius = '8px';
        toastWrapper.style.height = '60px';
        toastWrapper.style.marginTop = '0px';
        toastWrapper.style.width = '75%';

        switch (color) {
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

  async logout() {
    await this.authService.logout();
    await this.showToast('Você saiu da conta.', 'medium');
    this.router.navigateByUrl('/home');
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
      audio.style.display = 'none';
      button.style.display = 'inline-flex';
    }

    // Quando terminar, esconde player e volta botão
    audio.onended = () => {
      audio.style.display = 'none';
      button.style.display = 'inline-flex';
    };
  }
}
