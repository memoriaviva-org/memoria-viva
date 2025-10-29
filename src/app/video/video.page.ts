import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AudioPreferenceService } from '../services/audio-preference.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
})



  export class VideoPage {

  constructor(
    private audioPref: AudioPreferenceService,
    private router: Router
  ) {}
  videoStarted = false;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  showPlay = false;


  ngOnInit() {
    setTimeout(() => {
      this.showPlay = true;
    }, 500);
  }

  playVideo() {
    this.videoStarted = true;
    setTimeout(() => {
      this.videoPlayer?.nativeElement.play();
    }, 100); // pequeno delay p/ garantir renderização
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

  escolher(auto: boolean) {
    this.audioPref.setAutoPlay(auto);
    this.router.navigate(['/principal']); // ou rota desejada
  }

}

