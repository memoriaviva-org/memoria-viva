import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.page.html',
  styleUrls: ['./contatos.page.scss'],
  standalone: false,
})
export class ContatosPage {

  constructor() {}

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarJanela = false

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela
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
