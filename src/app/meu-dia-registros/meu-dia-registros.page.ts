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
  carregando = true;// flag de carregamento
  temRegistros = false;// mecanismo do audio


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
    this.registrosAgrupados$.subscribe(registrosAgrupados => {
      this.carregando = false;
      this.temRegistros = Object.keys(registrosAgrupados).length > 0;
    });//mudado por conta do audio
  }

  groupByTwo(registros: MeuDia[]): MeuDia[][] {
    const grupos: MeuDia[][] = [];
    for (let i = 0; i < registros.length; i += 2) {
      grupos.push(registros.slice(i, i + 2));
    }
    return grupos;
  }

  imagemSelecionada: string | null = null;

  abrirImagemTelaCheia(url: string | undefined) {
    if (!url) return;
    console.log('Abrindo imagem:', url);
    this.imagemSelecionada = url;
  }

  fecharImagemTelaCheia() {
    this.imagemSelecionada = null;
  }

 abrirMidia(registro: any) {
  if (registro.tipoMidia === 'imagem' && registro.midiaUrl) {
    this.abrirImagemTelaCheia(registro.midiaUrl);
  } else if (registro.tipoMidia === 'video' && registro.midiaUrl) {
    registro.reproduzindo = !registro.reproduzindo;
  }
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

     // Define qual áudio será usado com base na flag temRegistros
    const novoSrc = this.temRegistros
    ? 'assets/audio/audio-teste.m4a'
    : 'assets/audio/audio-pequeno.mp3';

  // Atualiza o src e carrega o áudio
  audio.src = novoSrc;
  audio.load();

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

  // 🔑 aqui está a função que substitui Object.keys() no HTML
  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
