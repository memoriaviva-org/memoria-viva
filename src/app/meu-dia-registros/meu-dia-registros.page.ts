import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RegistroService, MeuDia } from '../services/registro.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-meu-dia-registros',
  templateUrl: './meu-dia-registros.page.html',
  styleUrls: ['./meu-dia-registros.page.scss'],
  standalone: false
})
export class MeuDiaRegistrosPage implements OnInit {
  registrosAgrupados$!: Observable<{ [dia: string]: MeuDia[] }>;
  mostrarJanela = false;
  mostrarConfirmacao = false;

  constructor(private registroService: RegistroService) {}

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  ngOnInit() {
    this.registrosAgrupados$ = this.registroService.verMeuDia().pipe(
      map(registros => {
        const grupos: { [dia: string]: MeuDia[] } = {};
        for (const r of registros) {
          if (!grupos[r.diaSemana]) grupos[r.diaSemana] = [];
          grupos[r.diaSemana].push(r);
        }
        return grupos;
      })
    );
  }

  groupByTwo(registros: MeuDia[]): MeuDia[][] {
    const grupos: MeuDia[][] = [];
    for (let i = 0; i < registros.length; i += 2) {
      grupos.push(registros.slice(i, i + 2));
    }
    return grupos;
  }
  
  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  mostrarAlertaConfirmacao() {
    this.mostrarConfirmacao = true;
  }

  naoExcluir() {
    this.mostrarConfirmacao = false;
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


