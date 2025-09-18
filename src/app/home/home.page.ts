import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth'; 
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../app/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {

  constructor(    
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController) {}

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
}