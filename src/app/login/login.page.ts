import { Component } from '@angular/core';
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
  mostrarSenha = false;
  email = '';
  senha = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
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
      duration: 2000
    });
    toast.present();
  }
}
