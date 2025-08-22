import { Component } from '@angular/core'; 
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { updateProfile, User } from 'firebase/auth';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CadastroPage {
  nome: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  async register() {
    this.errorMessage = ''; // limpa erro anterior

     if (!this.nome || !this.email || !this.password) {
    this.errorMessage = this.getFriendlyError('empty-fields');
    return;
  }
   const nomeValido = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(this.nome);
  if (!nomeValido) {
    this.errorMessage = this.getFriendlyError('invalid-name');
    return;
  }

    try {
      const userCredential = await this.authService.register(this.email,   this.password, this.nome);
  
      const user = userCredential.user as User; // Ensure correct type

      // Atualiza o nome no perfil do usuário Firebase
      if (user) {
        await updateProfile(user, {
        displayName: this.nome // será usado no "Olá, {{ user.displayName }}!" do app
      });
    } else {
      throw new Error('Usuário não encontrado após cadastro.');
    }

      console.log('Usuário cadastrado:', user);

      // Mostra mensagem de sucesso
      const toast = await this.toastController.create({
        message: `Cadastro realizado com sucesso! Bem-vindo(a), ${this.nome}. Verifique seu e-mail para confirmar.`,
        duration: 4000,
        color: 'success'
      });
      await toast.present();

      // Limpa formulário
      this.nome = '';
      this.email = '';
      this.password = '';

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
      default:
        return 'Ocorreu um erro ao cadastrar. Tente novamente mais tarde.';
    }
  }
}
