import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class PrincipalPage implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;


  mostrarJanela = false;

  nome: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(async user => {
      if (user) {
        await user.reload(); // <- Garante que o displayName está atualizado
        this.nome = user.displayName ?? 'Usuário';
      } else {
        this.nome = 'Não autenticado';
      }
    });
  }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  toggleAudio() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;

    if (audio.paused) {
      audio.style.display = 'block'; // mostra controles
      audio.play();
    } else {
      audio.pause();
    }

    // Esconder player quando terminar
    audio.onended = () => {
      audio.style.display = 'none';
    };
  }

}

