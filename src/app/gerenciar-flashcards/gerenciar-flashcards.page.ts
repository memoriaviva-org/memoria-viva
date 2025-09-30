import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FlashcardService, Flashcard } from '../services/flashcard.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importação para usar o operador map

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

  // A lista de todos os flashcards do usuário (ou apenas os filtrados)
  flashcards$: Observable<Flashcard[]> | undefined = undefined;

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarJanela: boolean = false;
  mostrarResposta: boolean = false;

  // Variável para armazenar o flashcard atualmente exibido/selecionado
  flashcardAtual: Flashcard | null = null;

  categoria: string = '';
  categoriaImg: string = '';
  tituloCategoria: string = 'Meus Flashcards';

  // Estes campos devem ser atualizados a partir do 'flashcardAtual'
  tituloFlashcard: string = 'Título do Flashcard';

  perguntaAudioSrc: string = 'assets/audio/audio-teste.m4a';
  respostaAudioSrc: string = 'assets/audio/audio-teste.m4a';

  midiaAuxiliarSrc: string = 'assets/foto-1.png';
  midiaAuxiliarTipo: 'foto' | 'video' | 'audio' | 'none' = 'foto';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flashcardService: FlashcardService // Serviço injetado
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoria = params['categoria'] || '';

      const dados = this.getDadosCategoria(this.categoria);

      this.categoriaImg = dados.caminhoDaImagem;
      this.tituloCategoria = dados.titulo;

      // 🚀 AJUSTE PRINCIPAL AQUI: Carregar e/ou filtrar os flashcards
      this.carregarEFiltrarFlashcards();
    });
  }

  /**
   * Carrega todos os flashcards do serviço e filtra se houver uma categoria específica.
   */
  private carregarEFiltrarFlashcards(): void {
    // 1. Pega o Observable de todos os flashcards do usuário
    this.flashcards$ = this.flashcardService.verFlashcards().pipe(
      // 2. Usa o 'map' do RxJS para filtrar a lista se a categoria foi fornecida
      map(flashcards => {
        if (this.categoria && this.categoria !== 'all') { // Assume 'all' se não houver filtro
          return flashcards.filter(f => f.categoriaFlashcard === this.categoria);
        }
        return flashcards; // Retorna todos se não houver categoria ou se for 'all'
      })
    );

    // Opcional: Se quiser definir o primeiro flashcard como o 'flashcardAtual' após o carregamento
    this.flashcards$.subscribe(flashcards => {
      if (flashcards && flashcards.length > 0) {
        this.selecionarFlashcard(flashcards[0]);
      } else {
        this.flashcardAtual = null;
      }
    });
  }

  /**
   * Define o flashcard que será exibido na tela e atualiza as variáveis de mídia.
   */
  selecionarFlashcard(flashcard: Flashcard): void {
    this.flashcardAtual = flashcard;

    // Atualiza os dados da tela com base no flashcard selecionado
    this.tituloFlashcard = flashcard.tituloFlashcard;
    this.perguntaAudioSrc = flashcard.audioPergunta || ''; // Use um default vazio
    this.respostaAudioSrc = flashcard.audioResposta || ''; // Use um default vazio
    this.midiaAuxiliarSrc = flashcard.midiaAuxiliar || ''; // Use um default vazio

    // Lógica simples para definir o tipo de mídia (você pode aprimorar isso)
    if (flashcard.midiaAuxiliar) {
        if (flashcard.midiaAuxiliar.match(/\.(mp4|mov|avi)$/i)) {
            this.midiaAuxiliarTipo = 'video';
        } else if (flashcard.midiaAuxiliar.match(/\.(mp3|m4a|wav)$/i)) {
            this.midiaAuxiliarTipo = 'audio';
        } else {
            this.midiaAuxiliarTipo = 'foto'; // Assume foto para outros casos (png, jpg, etc.)
        }
    } else {
        this.midiaAuxiliarTipo = 'none';
    }
  }

  // ... (outros métodos como getDadosCategoria, voltar, inicio, mostrarJanelaMais, fecharJanelaMais, toggleAudio permanecem os mesmos)

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

  // Exemplo de como você pode usar o serviço para deletar um flashcard
  async deletarFlashcard(id: string) {
    try {
        await this.flashcardService.deleteFlashcard(id);
        alert('Flashcard deletado com sucesso!');
        // O Observable 'flashcards$' será atualizado automaticamente

        // Opcional: Limpar o flashcard atual se ele foi deletado
        if (this.flashcardAtual && this.flashcardAtual.id === id) {
             this.flashcardAtual = null;
        }
    } catch (error) {
        console.error('Erro ao deletar flashcard:', error);
        alert('Não foi possível deletar o flashcard.');
    }
  }
}
