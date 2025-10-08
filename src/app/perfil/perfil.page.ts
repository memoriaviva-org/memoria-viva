// import { firebase } from 'firebase/compat/app';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
})


export class PerfilPage implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarJanela = false

  nome: string = '';
  email: string = '';
  idade: string = '';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

ngOnInit() {
  this.authService.getCurrentUser().subscribe(async user => {
    if (user) {
      await user.reload();
      this.nome = user.displayName ?? 'Usuário';
      this.email = user.email ?? 'Email não disponível';

      // Agora busca os dados no Firestore
      const dados = await this.authService.getUserData(user.uid);
      if (dados && dados['idade']) {
        this.idade = dados['idade'].toString(); // converte para string se necessário
      } else {
        this.idade = 'Idade não disponível';
      }
    } else {
      this.nome = 'Não autenticado';
      this.email = 'Email não disponível';
      this.idade = '0';
    }
  });
}


  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  voltar() {
    this.navCtrl.back();
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
