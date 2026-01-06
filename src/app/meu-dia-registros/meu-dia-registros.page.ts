import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RegistroService, MeuDia } from '../services/registro.service';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router'; // ADICIONAR
import { NotificacaoService} from '../services/notificacao.service';

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
  carregando = true;
  temRegistros = false;

  // ADICIONAR Router no constructor
  constructor(
    private registroService: RegistroService,
    private router: Router,
    private notificacaoService: NotificacaoService
  ) {}

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  async ngOnInit() {
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

    this.registrosAgrupados$.subscribe(async registrosAgrupados => {
      this.carregando = false;
      this.temRegistros = Object.keys(registrosAgrupados).length > 0;

      // Solicitar permissão para notificações
      await this.notificacaoService.solicitarPermissao();

      // Só agenda se houver registros no dia
      if (this.temRegistros) {
        const jaTemAviso = await this.notificacaoService.jaTemAvisoAgendado(4);
        if (!jaTemAviso) {
          await this.notificacaoService.agendarAvisoApagarMeuDia(this.temRegistros);
        }
      }
      else {
        console.log('Sem registros, notificação não será agendada.');
      }
    });
  }


  // NOVA FUNÇÃO: Navegar para edição
  editarRegistro(registroId: string | undefined) {
    this.router.navigate(['/add'], {
      queryParams: {
        editar: 'true',
        id: registroId
      }
    });
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

    const novoSrc = this.temRegistros
      ? '../../assets/audio/AudioMeuDia.mp3'
      : '../../assets/audio/AudioExplicacaoMeuDia.mp3'; 

    audio.src = novoSrc;
    audio.load();

    if (audio.paused) {
      button.style.display = 'none';
      audio.style.display = 'block';
      audio.play();
    } else {
      audio.pause();
    }

    audio.onended = () => {
      audio.style.display = 'none';
      button.style.display = 'inline-flex';
    };
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
