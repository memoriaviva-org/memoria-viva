import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-esqueci-minha-senha',
  templateUrl: './esqueci-minha-senha.page.html',
  styleUrls: ['./esqueci-minha-senha.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EsqueciMinhaSenhaPage {

  email: string = ''; // e-mail digitado
  errorMessage: string = ''; // mensagem de erro na tela

  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  async onResetPassword() {
    this.errorMessage = ''; // limpa erro anterior

    if (!this.email) {
      this.errorMessage = 'Digite um e-mail válido.'; // O Firebase, por segurança, não retorna erro de “usuário não encontrado” no sendPasswordResetEmail. Ele sempre responde que “o e-mail foi enviado” para evitar que alguém descubra quais e-mails existem ou não no sistema. 
      return;
    }

    try {
      const result = await this.authService.resetPassword(this.email);

      if (result.success) {
        const toast = await this.toastController.create({
          message: result.message,
          duration: 4000,
          color: 'success',
          position: 'top'
        });
        await toast.present();

        // limpa o campo após sucesso
        this.email = '';
      } else {
        this.errorMessage = result.message;
      }

    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      this.errorMessage = 'Ocorreu um erro ao tentar redefinir a senha. Tente novamente mais tarde.';
    }
  }
}
