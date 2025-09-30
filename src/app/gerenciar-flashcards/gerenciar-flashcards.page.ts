import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface DadosCategoria {
  caminhoDaImagem: string;
  titulo: string;
}

@Component({
  selector: 'app-gerenciar-flashcards',
  templateUrl: './gerenciar-flashcards.page.html',
  styleUrls: ['./gerenciar-flashcards.page.scss'],
  standalone: false
})
export class GerenciarFlashcardsPage implements OnInit {

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarJanela: boolean = false;
  mostrarResposta: boolean = false;

  categoria: string = '';
  categoriaImg: string = '';
  tituloCategoria: string = 'Meus Flashcards';

  tituloFlashcard: string = 'Título do Flashcard';

  perguntaAudioSrc: string = 'assets/audio/audio-teste.m4a';
  respostaAudioSrc: string = 'assets/audio/audio-teste.m4a';

  midiaAuxiliarSrc: string = 'assets/foto-1.png';
  midiaAuxiliarTipo: 'foto' | 'video' | 'audio' | 'none' = 'foto';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoria = params['categoria'] || '';
      
      const dados = this.getDadosCategoria(this.categoria);
      
      this.categoriaImg = dados.caminhoDaImagem;
      this.tituloCategoria = dados.titulo;
    });
  }

  getDadosCategoria(nome: string): DadosCategoria {
    const categorias: { [key: string]: string } = {
      'Família': 'assets/img/categoria_familia.png',
      'Amigos': 'assets/img/categoria_amigos.png',
      'Passatempos': 'assets/img/categoria_passatempos.png',
      'Infância': 'assets/img/categoria_infancia.png',
      'Juventude': 'assets/img/categoria_juventude.png',
      'Animais de Estimação': 'assets/img/categoria_animais_de_estimacao.png',
      'Momentos Marcantes': 'assets/img/categoria_momentos_marcantes.png'
    };

    const caminhoDaImagem = categorias[nome];

    if (caminhoDaImagem) {
      return {
        caminhoDaImagem: caminhoDaImagem,
        titulo: nome
      };
    } else {
      return {
        caminhoDaImagem: 'assets/img/bolinha.png',
        titulo: 'Minhas Memórias'
      };
    }
  }

  voltar(): void {
    this.router.navigate(['/categorias']);
  }

  inicio(): void {
    this.router.navigate(['/home']);
  }

  mostrarJanelaMais(): void {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais(): void {
    this.mostrarJanela = false;
  }

  toggleAudio(): void {
    if (!this.audioPlayer) return;
    
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    const button = document.querySelector('.audio-btn') as HTMLElement;

    if (audio.paused) {
      if (button) button.style.display = 'none';
      audio.style.display = 'block';
      audio.play();
    } else {
      audio.pause();
    }

    audio.onended = () => {
      audio.style.display = 'none';
      if (button) button.style.display = 'inline-flex';
    };
  }
}