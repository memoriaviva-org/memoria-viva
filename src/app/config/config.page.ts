import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { AudioPreferenceService } from '../services/audio-preference.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
})

  export class ConfigPage {

  constructor(
    private navCtrl: NavController,
    private audioPref: AudioPreferenceService
  ) {}

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  voltar() {
    this.navCtrl.back();
  }

  async ngAfterViewInit() {
    await this.audioPref.autoPlayIfEnabled(this.audioPlayer);
  }

  toggleAudio() {
    this.audioPref.toggleAudio(this.audioPlayer);
  }
}
