import { Component, ViewChild, ElementRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContatoService, Contato } from '../../services/contato.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.page.html',
  styleUrls: ['./contatos.page.scss'],
  standalone: false,
})
export class ContatosPage implements OnInit {

  contatos$!: Observable<Contato[]>;

  constructor(private contatoService: ContatoService, private router: Router) {}

  ngOnInit() {
    this.contatos$ = this.contatoService.verContatos();
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


  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarJanela = false

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
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
}
