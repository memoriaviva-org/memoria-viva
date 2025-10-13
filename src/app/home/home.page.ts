import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../app/services/auth.service';
import { ToastController } from '@ionic/angular';

import { LocalNotifications } from '@capacitor/local-notifications';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

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
