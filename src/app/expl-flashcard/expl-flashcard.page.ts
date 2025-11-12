import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioPreferenceService } from '../services/audio-preference.service';

@Component({
  selector: 'app-expl-flashcard',
  templateUrl: './expl-flashcard.page.html',
  styleUrls: ['./expl-flashcard.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
})
export class ExplFlashcardPage {

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
