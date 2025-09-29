
import { Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gerenciar-flashcards',
  templateUrl: './gerenciar-flashcards.page.html',
  styleUrls: ['./gerenciar-flashcards.page.scss'],
  standalone: false
})
export class GerenciarFlashcardsPage implements OnInit {

 @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarJanela = false

  categoria: string = '';
  categoriaImg: string = '';

  tituloFlashcard: string = 'Meus Flashcards';

    // Variáveis das Mídias (Fontes)
  perguntaAudioSrc: string = 'assets/audio/audio-teste.m4a'; // Áudio da Pergunta
  respostaAudioSrc: string = 'assets/audio/audio-teste.m4a';   // Áudio da Resposta
  
  // Mídia Auxiliar (Fonte e Tipo)
  midiaAuxiliarSrc: string = 'assets/foto-1.png'; // Pode ser .jpg, .mp4, .m4a, etc.
  midiaAuxiliarTipo: 'foto' | 'video' | 'audio' | 'none' = 'foto'; // Tipo da Mídia ('foto', 'video', 'audio' ou 'none')

  mostrarResposta: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Pega o parâmetro enviado pela rota via queryParams
    this.route.queryParams.subscribe(params => {
      this.categoria = params['categoria'] || '';
      this.categoriaImg = this.getImagemCategoria(this.categoria);
    });
  }

  getImagemCategoria(nome: string): string {
    const imagens: any = {
      'Família': 'assets/img/categoria_familia.png',
      'Amigos': 'assets/img/categoria_amigos.png',
      'Passatempos': 'assets/img/categoria_passatempos.png',
      'Infância': 'assets/img/categoria_infancia.png',
      'Juventude': 'assets/img/categoria_juventude.png',
      'Animais de Estimação': 'assets/img/categoria_animais_de_estimacao.png',
      'Momentos Marcantes': 'assets/img/categoria_momentos_marcantes.png'
    };
    return imagens[nome] || 'assets/img/categorias/default.png';
  }

  // Botão voltar
  voltar() {
    this.router.navigate(['/categorias']);
  }

  // Botão início
  inicio() {
    this.router.navigate(['/home']);
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
