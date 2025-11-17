import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AudioPreferenceService } from '../services/audio-preference.service';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
  standalone: false
})
export class VideoPage {
  videoStarted = false;
  showPlay = false;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(
    private audioPref: AudioPreferenceService,
    private router: Router,
    private firestore: Firestore,
    private auth: Auth
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.showPlay = true;
    }, 500);
  }

  playVideo() {
    this.videoStarted = true;
    setTimeout(() => {
      this.videoPlayer?.nativeElement.play();
    }, 100);
  }

  toggleAudio() {
    this.audioPref.toggleAudio(this.audioPlayer);
  }

  async escolher(auto: boolean) {
    await this.audioPref.setAutoPlay(auto);

    const user = this.auth.currentUser;
    if (user) {
      const ref = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(ref, { audioConfigured: true });
    }

    this.router.navigate(['/principal']);
  }
}