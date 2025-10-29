import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AudioPreferenceService } from '../services/audio-preference.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: false
})

export class PrincipalPage implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;


  ngOnInit() {
    this.authService.getCurrentUser().subscribe(async user => {
      if (user) {
        await user.reload();
        this.nome = user.displayName ?? 'Usuário';
      } else {
        this.nome = 'Não autenticado';
      }
    });
    const autoPlay = this.audioPref.getAutoPlay();
    if (autoPlay) {
      setTimeout(() => this.playAudio(), 500); // pequena espera para garantir carregamento
    }
  }

  mostrarJanela = false;

  nome: string = '';

  constructor(private authService: AuthService, private audioPref: AudioPreferenceService) {}


  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  toggleAudio() {
    const audio = this.audioPlayer.nativeElement;
    const button = document.querySelector('.audio-btn') as HTMLElement;
    if (audio.paused) {
      button.style.display = 'none';
      audio.style.display = 'block';
      audio.play();
    } else {
      audio.pause();
    }
    audio.onended = () => {
      audio.style.display = 'none';
      button.style.display = 'inline-flex';
    };
  }

  private playAudio() {
    const audio = this.audioPlayer.nativeElement;
    audio.style.display = 'block';
    audio.play();
  }
}

