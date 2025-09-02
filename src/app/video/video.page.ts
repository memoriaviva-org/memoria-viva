import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

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
  videoStarted = false;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  showPlay = false;

  constructor() {}

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
}
