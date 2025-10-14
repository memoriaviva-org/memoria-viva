import { Component, ViewChild, ElementRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { FlashcardService, Flashcard } from '../services/flashcard.service';
import { firstValueFrom, of } from 'rxjs';

interface DadosCategoria {
  caminhoDaImagem: string;
  titulo: string;
}

interface FlashcardGroup {
  categoria: string;
  flashcards: Flashcard[];
  titulo: string;
}

@Component({
  selector: 'app-gerenciar-flashcards',
  templateUrl: './gerenciar-flashcards.page.html',
  styleUrls: ['./gerenciar-flashcards.page.scss'],
  standalone: false
})
export class GerenciarFlashcardsPage implements OnInit {
  private flashcardService = inject(FlashcardService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  flashcards$!: Observable<Flashcard[]>;
  flashcardsGrouped$!: Observable<FlashcardGroup[]>;
  carregando = true;
  mostrarJanela: boolean = false;

  categoria: string = '';
  categoriaImg: string = '';
  tituloCategoria: string = 'Meus Flashcards';

  // Nova propriedade para controlar quando mostrar a faixa
  mostrarFaixaCategoria: boolean = false;

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoria = params['categoria'] || '';

      const dados = this.getDadosCategoria(this.categoria);
      this.categoriaImg = dados.caminhoDaImagem;
      this.tituloCategoria = dados.titulo;

      // Define quando mostrar a faixa:
      // MOSTRAR faixa apenas quando NÃO estiver em uma categoria específica
      // (ou seja, quando estiver vendo TODOS os flashcards)
      this.mostrarFaixaCategoria = !this.categoria || this.categoria === 'all';

      this.carregarFlashcards();
    });
  }

  private carregarFlashcards(): void {
    this.carregando = true;

    if (this.categoria && this.categoria !== 'all') {
      this.flashcards$ = this.flashcardService.verFlashcardsPorCategoria(this.categoria);
    } else {
      this.flashcards$ = this.flashcardService.verTodosFlashcards();
    }

    // Agrupa os flashcards por categoria apenas se for mostrar a faixa
    if (this.mostrarFaixaCategoria) {
      this.flashcardsGrouped$ = this.flashcards$.pipe(
        map(flashcards => this.agruparFlashcardsPorCategoria(flashcards))
      );
    } else {
      // Se não for mostrar faixa, usa os flashcards diretamente sem agrupar
      this.flashcardsGrouped$ = this.flashcards$.pipe(
        map(flashcards => [{
          categoria: this.categoria,
          flashcards: flashcards,
          titulo: this.categoria
        }])
      );
    }

    // Atualiza o estado de carregamento quando os dados chegarem
    this.flashcards$.subscribe({
      next: () => this.carregando = false,
      error: () => this.carregando = false
    });
  }

  // Método para agrupar flashcards por categoria
  private agruparFlashcardsPorCategoria(flashcards: Flashcard[]): FlashcardGroup[] {
    const grupos: { [key: string]: FlashcardGroup } = {};

    flashcards.forEach(flashcard => {
      const categoria = flashcard.categoriaFlashcard;

      if (!grupos[categoria]) {
        grupos[categoria] = {
          categoria: categoria,
          flashcards: [],
          titulo: categoria
        };
      }

      grupos[categoria].flashcards.push(flashcard);
    });

    // Converte o objeto em array e ordena por categoria
    return Object.values(grupos).sort((a, b) =>
      a.categoria.localeCompare(b.categoria)
    );
  }

  // ... resto dos métodos permanecem iguais ...
  editarFlashcard(flashcardId: string | undefined) {
    if (!flashcardId) {
      console.error('ID do flashcard não encontrado');
      return;
    }

    this.router.navigate(['/criar-flashcard'], {
      queryParams: {
        editar: 'true',
        id: flashcardId,
        origem: 'gerenciar'
      }
    });
  }

  // Método para tratamento de erro em imagens
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  // Método para detectar tipo de mídia
  getMidiaAuxiliarTipo(flashcard: Flashcard): 'foto' | 'video' | 'audio' | 'none' {
    // Primeiro verifica se existe mídia auxiliar
    if (!flashcard.midiaAuxiliar || flashcard.midiaAuxiliar.trim() === '') {
      return 'none';
    }

    const midiaUrl = flashcard.midiaAuxiliar.toLowerCase();

    // Para Base64 - verifica o tipo pelo prefixo
    if (midiaUrl.startsWith('data:')) {
      if (midiaUrl.includes('image/')) return 'foto';
      if (midiaUrl.includes('video/')) return 'video';
      if (midiaUrl.includes('audio/')) return 'audio';
      return 'none';
    }

    // Para URLs - verifica pela extensão
    if (midiaUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
      return 'foto';
    }

    if (midiaUrl.match(/\.(mp4|webm|ogg|mov|avi|wmv)$/i)) {
      return 'video';
    }

    if (midiaUrl.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
      return 'audio';
    }

    return 'none';
  }

  // Verifica se a URL da mídia é válida (para Base64)
  isMidiaValida(url: string | undefined): boolean {
    if (!url) return false;

    // Para Base64, verifica se começa com data:
    if (url.startsWith('data:')) {
      return true;
    }

    // Para URLs externas
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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

    const caminhoDaImagem = categorias[nome] || 'assets/img/bolinha.png';

    return {
      caminhoDaImagem: caminhoDaImagem,
      titulo: nome || 'Minhas Memórias'
    };
  }

  getClasseCategoria(nome: string): string {
    const classes: any = {
      'Família': 'categoria-familia',
      'Amigos': 'categoria-amigos',
      'Passatempos': 'categoria-passatempos',
      'Infância': 'categoria-infancia',
      'Juventude': 'categoria-juventude',
      'Animais de Estimação': 'categoria-animais',
      'Momentos Marcantes': 'categoria-momentos'
    };
    return classes[nome] || 'categoria-default';
  }

  // Método para obter o ícone mini da categoria
  getIconeMiniCategoria(categoria: string): string {
    return this.getDadosCategoria(categoria).caminhoDaImagem;
  }

  async deletarFlashcard(id: string) {
    if (!id) {
      console.error('ID do flashcard não fornecido');
      return;
    }
  
    const confirmacao = confirm('Tem certeza que deseja deletar este flashcard?');
  
    if (confirmacao) {
      try {
        await this.flashcardService.deleteFlashcard(id);
        console.log('Flashcard deletado com sucesso');
  
        // Busca os flashcards atualizados
        let flashcardsAtualizados: Flashcard[];
  
        if (this.categoria && this.categoria !== 'all') {
          flashcardsAtualizados = await firstValueFrom(
            this.flashcardService.verFlashcardsPorCategoria(this.categoria)
          );
        } else {
          flashcardsAtualizados = await firstValueFrom(
            this.flashcardService.verTodosFlashcards()
          );
        }
  
        if (!flashcardsAtualizados || flashcardsAtualizados.length === 0) {
          // Se não tem flashcards, redireciona para /categorias
          this.router.navigate(['/categorias']);
        } else {
          // Atualiza o Observable para atualizar a lista na UI
          this.flashcards$ = of(flashcardsAtualizados);
  
          if (this.mostrarFaixaCategoria) {
            this.flashcardsGrouped$ = this.flashcards$.pipe(
              map(flashcards => this.agruparFlashcardsPorCategoria(flashcards))
            );
          } else {
            this.flashcardsGrouped$ = this.flashcards$.pipe(
              map(flashcards => [{
                categoria: this.categoria,
                flashcards: flashcards,
                titulo: this.categoria
              }])
            );
          }
        }
      } catch (error) {
        console.error('Erro ao deletar flashcard:', error);
        alert('Não foi possível deletar o flashcard.');
      }
    }
  }

  voltar(): void {
    this.router.navigate(['/categorias']);
  }

  inicio(): void {
    this.router.navigate(['/principal']);
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
