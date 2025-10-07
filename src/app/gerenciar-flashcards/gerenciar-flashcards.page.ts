import { Component, ViewChild, ElementRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FlashcardService, Flashcard } from '../services/flashcard.service';

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
  private flashcardService = inject(FlashcardService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  flashcards$!: Observable<Flashcard[]>;
  carregando = true;
  mostrarJanela: boolean = false;

  categoria: string = '';
  categoriaImg: string = '';
  tituloCategoria: string = 'Meus Flashcards';

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoria = params['categoria'] || '';

      const dados = this.getDadosCategoria(this.categoria);
      this.categoriaImg = dados.caminhoDaImagem;
      this.tituloCategoria = dados.titulo;

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

    // Atualiza o estado de carregamento quando os dados chegarem
    this.flashcards$.subscribe({
      next: () => this.carregando = false,
      error: () => this.carregando = false
    });
  }

  // NOVO: Função para editar flashcard
  editarFlashcard(flashcardId: string | undefined) {
    if (!flashcardId) {
      console.error('ID do flashcard não encontrado');
      return;
    }

    this.router.navigate(['/criar-flashcard'], {
      queryParams: {
        editar: 'true',
        id: flashcardId
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

        // Recarrega a lista
        this.carregarFlashcards();
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
