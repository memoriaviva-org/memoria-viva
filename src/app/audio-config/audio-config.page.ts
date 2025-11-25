import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AudioPreferenceService } from '../services/audio-preference.service';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-audio-config',
  templateUrl: './audio-config.page.html',
  styleUrls: ['./audio-config.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AudioConfigPage {
  videoStarted = false;
  showPlay = false;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(
    private audioPref: AudioPreferenceService,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.showPlay = true;
    }, 500);
  }

  ngAfterViewInit() {
    this.audioPref.autoPlayIfEnabled(this.audioPlayer);
  }


  playVideo() {
    this.videoStarted = true;
    setTimeout(() => {
      this.videoPlayer?.nativeElement.play();
    }, 100);
  }


// audio-config.page.ts
  async escolher(auto: boolean) {
    // Mostra loading
    const loading = await this.loadingController.create({
      message: 'Salvando preferências...'
    });
    await loading.present();

    try {
      await this.audioPref.setAutoPlay(auto);
      await loading.dismiss();
      this.router.navigate(['/principal']);
    } catch (error) {
      await loading.dismiss();
      console.error('Erro:', error);
    }
  }
  toggleAudio() {
    this.audioPref.toggleAudio(this.audioPlayer);
  }
}
