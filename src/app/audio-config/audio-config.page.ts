import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-audio-config',
  templateUrl: './audio-config.page.html',
  styleUrls: ['./audio-config.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
})

  export class AudioConfigPage {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  showPlay = false;
  videoStarted = false;

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.showPlay = true;
    }, 500);
  }

  playVideo() {
    this.videoPlayer.nativeElement.play();
    this.videoStarted = true;
    this.showPlay = false; // remove classe .show se quiser sumir com botão instantâneo
  }
}