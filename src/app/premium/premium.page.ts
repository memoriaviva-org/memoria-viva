import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioPreferenceService } from '../services/audio-preference.service';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.page.html',
  styleUrls: ['./premium.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
})

  export class PremiumPage {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(private audioPref: AudioPreferenceService) {}

  async ngAfterViewInit() {
    await this.audioPref.autoPlayIfEnabled(this.audioPlayer);
  }

  mostrarJanela = false

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }


  toggleAudio() {
    this.audioPref.toggleAudio(this.audioPlayer);
  }
}
