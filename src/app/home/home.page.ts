import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../app/services/auth.service';

import { LocalNotifications } from '@capacitor/local-notifications';

import { Platform, LoadingController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
  
export class HomePage implements OnInit {
  
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  isProcessing = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}
 async ngOnInit() {
  console.log('🏠 HomePage iniciada');
  await this.checkLoginState();
}


private async checkLoginState() {
  if (this.isProcessing) return;
  this.isProcessing = true;

  try {
    // 🔥 Tenta recuperar login via redirect
    const user = await this.authService.handleAuthRedirect();

    if (user) {
      console.log('🎉 Login detectado. Redirecionando...');
      this.navigateToMain();
      return;
    }

    // 🔍 Se já estiver logado (sem redirect)
    const currentUser = this.authService['authenticate'].currentUser;
    if (currentUser) {
      console.log('✅ Já logado:', currentUser.email);
      this.navigateToMain();
    }

  } catch (err) {
    console.error('Erro ao checar login:', err);
  } finally {
    this.isProcessing = false;
  }
}

async onGoogleLogin() {
  console.log('🔐 Iniciando login Google');
  try {
    await this.authService.loginWithGoogle();
    // Web → login imediato
    const user = this.authService['authenticate'].currentUser;
    if (user) {
      this.navigateToMain();
    }
  } catch (error) {
    console.error('❌ Erro no login Google:', error);
    this.showErrorToast('Falha no login com Google');
  }
}

private navigateToMain() {
  console.log('🚀 Indo para /principal');
  this.router.navigateByUrl('/principal', { replaceUrl: true });
}


  private async showError(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }

  /**
   * Mostra toast de erro padrão
   */
  private async showErrorToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: 'danger',
      position: 'bottom',
      buttons: [{
        text: 'Fechar',
        role: 'cancel'
      }]
    });
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

     // Notificações:
   async ionViewDidEnter() {
    // 1️⃣ Pede permissão para mandar notificações
    const perm = await LocalNotifications.requestPermissions();

    if (perm.display === 'granted') {
      // 2️⃣ Agenda uma notificação pra aparecer em 5 segundos
      await LocalNotifications.schedule({
        notifications: [
          {
            title: '💭 Lembrete de Memória Viva',
            body: 'Ei! Que tal criar um flashcard hoje?',
            id: 1,
            schedule: { at: new Date(Date.now() + 5000) }, // 5 segundos
            sound: 'default',
          },
        ],
      });
      console.log('Notificação agendada com sucesso!');
    } else {
      console.log('Permissão negada.');
    }
  }

}
