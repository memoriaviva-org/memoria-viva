import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: false
})

export class PrincipalPage implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;


  mostrarJanela = false;

  nome: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(async user => {
      if (user) {
        await user.reload(); 
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

