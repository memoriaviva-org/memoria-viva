import { Component, ViewChild, ElementRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContatoService, Contato } from '../../services/contato.service';
import { Router } from '@angular/router';
import { AudioPreferenceService } from '../../services/audio-preference.service';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.page.html',
  styleUrls: ['./contatos.page.scss'],
  standalone: false,
})
export class ContatosPage implements OnInit {

  contatos$!: Observable<Contato[]>;
  contatos: Contato[] = []; // 👈 adicionamos isso pra armazenar a lista

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarJanela = false;

  constructor(
    private contatoService: ContatoService,
    private router: Router, 
    private audioPref: AudioPreferenceService ) {}

  ngOnInit() {
    this.contatos$ = this.contatoService.verContatos();

    // 👇 guarda os contatos num array pra verificar depois
    this.contatos$.subscribe(dados => {
      this.contatos = dados || [];
    });
  }

  editarContato(contatoId: string | undefined) {
    if (!contatoId) {
      console.error('ID do contato não encontrado');
      return;
    }

    this.router.navigate(['/add-contatos'], {
      queryParams: {
        editar: 'true',
        id: contatoId,
        origem: 'gerenciar'
      }
    });
  }

  async ngAfterViewInit() {
    await this.audioPref.autoPlayIfEnabled(this.audioPlayer);
  }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  toggleAudio() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    const button = document.querySelector('.audio-btn') as HTMLElement;

    // 👇 Escolhe o áudio com base em ter contatos ou não
    const audioSrc = this.contatos.length > 0
      ? 'assets/audio/audio-teste.m4a'
      : 'assets/audio/audio-pequeno.mp3';

    audio.src = audioSrc;
    audio.load();

    if (audio.paused) {
      button.style.display = 'none';
      audio.style.display = 'block';
      audio.play().catch(err => console.error('Erro ao reproduzir áudio:', err));
    } else {
      audio.pause();
    }

    // Quando o áudio termina, volta ao botão
    audio.onended = () => {
      audio.style.display = 'none';
      button.style.display = 'inline-flex';
    };
  }

  abrirNoMaps(endereco: string): string {
    return 'https://www.google.com/maps?q=' + encodeURIComponent(endereco);
  }

}
