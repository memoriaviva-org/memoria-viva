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
  mostrarJanela = false;
  nome: string = '';

  constructor(
    private authService: AuthService,
    private audioPref: AudioPreferenceService,
  ) {}

  async ngOnInit() {
    this.authService.getCurrentUser().subscribe(async user => {
      if (user) {
        await user.reload();
        this.nome = user.displayName ?? 'Usuário';

      } else {
        console.log('PrincipalPage - Nenhum usuário autenticado');
        this.nome = 'Usuário';
      }
    });
  }


  ngAfterViewInit() {
    console.log('PrincipalPage - ngAfterViewInit');
    this.audioPref.autoPlayIfEnabled(this.audioPlayer);
  }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  toggleAudio() {
    this.audioPref.toggleAudio(this.audioPlayer);
  }
}
