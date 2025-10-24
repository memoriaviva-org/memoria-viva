import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: false
})
export class CadastroPage {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  nome: string = '';
  email: string = '';
  password: string = '';
  dataNasc: string = ''; // Alterado para string para compatibilidade com ion-input type="date"
  errorMessage: string = '';

  isEmailFocused: boolean = false;
  isSenhaFocused: boolean = false;
  isNomeFocused: boolean = false;
  isdataNascFocused: boolean = false;

  mostrarSenha = false;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) {}

  // ver senha
  togglePassword() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  async register() { // Removidos parâmetros - usar propriedades da classe
    this.errorMessage = ''; // limpa erro anterior

    // Validações
    if (!this.nome || !this.email || !this.password || !this.dataNasc) {
      this.errorMessage = this.getFriendlyError('empty-fields');
      return;
    }

    const nomeValido = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(this.nome);
    if (!nomeValido) {
      this.errorMessage = this.getFriendlyError('invalid-name');
      return;
    }

    if (this.nome.length > 50) {
      this.errorMessage = 'O nome não pode ultrapassar 50 caracteres.';
      return;
    }

    if (this.password.length < 6 || this.password.length > 25) {
      this.errorMessage = 'A senha deve ter entre 6 e 25 caracteres.';
      return;
    }

    // Validação de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Por favor, insira um e-mail válido.';
      return;
    }

    // Converter string da data para Date
    const dataNascDate = new Date(this.dataNasc);

    // Validar data (não pode ser no futuro)
    const hoje = new Date();
    if (dataNascDate > hoje) {
      this.errorMessage = 'A data de nascimento não pode ser no futuro.';
      return;
    }

    // Validar idade mínima (ex: 13 anos)
    const idadeMinima = new Date();
    idadeMinima.setFullYear(idadeMinima.getFullYear() - 13);
    if (dataNascDate > idadeMinima) {
      this.errorMessage = 'Você deve ter pelo menos 13 anos para se cadastrar.';
      return;
    }

    try {
      const userCredential = await this.authService.register(
        this.email,
        this.password,
        this.nome,
        dataNascDate
      );

      console.log('Usuário cadastrado:', userCredential.user);

      // Mostra mensagem de sucesso
      const safeNome = this.nome.replace(/[<>&'"]/g, '');
      const toast = await this.toastController.create({
        message: `Cadastro realizado com sucesso! Bem-vindo(a), ${safeNome}. Verifique seu e-mail para confirmar.`,
        duration: 4000,
        color: 'success'
      });
      await toast.present();

      this.router.navigate(['/login']);

      // Limpa formulário
      this.nome = '';
      this.email = '';
      this.password = '';
      this.dataNasc = '';

    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      this.errorMessage = this.getFriendlyError(error.code);
    }
  }

  getFriendlyError(code: string): string {
    switch (code) {
      case 'empty-fields':
        return 'Por favor, preencha todos os campos.';
      case 'invalid-name':
        return 'O nome não pode conter números ou caracteres especiais.';
      case 'auth/email-already-in-use':
        return 'Este e-mail já está em uso. Tente recuperar sua conta.';
      case 'auth/invalid-email':
        return 'O e-mail inserido não é válido. Verifique o formato (ex: nome@dominio.com).';
      case 'auth/weak-password':
        return 'A senha é muito fraca. Use pelo menos 6 caracteres.';
      case 'auth/missing-password':
        return 'Você precisa informar uma senha.';
      case 'auth/network-request-failed':
        return 'Falha de conexão. Verifique sua internet e tente novamente.';
      case 'auth/invalid-credential':
        return 'Credenciais inválidas. Verifique seus dados.';
      case 'auth/user-disabled':
        return 'Esta conta foi desativada. Entre em contato com o suporte.';
      case 'auth/operation-not-allowed':
        return 'Operação não permitida. Entre em contato com o suporte.';
      default:
        return 'Ocorreu um erro ao cadastrar. Tente novamente mais tarde.';
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
