import { Component, ViewChild, ElementRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Flashcard, FlashcardService } from '../services/flashcard.service';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.page.html',
  styleUrls: ['./flashcard.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class FlashcardPage implements OnInit {
  private flashcardService = inject(FlashcardService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private navCtrl = inject(NavController);

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  // Observable para lista de flashcards
  flashcards$!: Observable<Flashcard[]>;
  
  // Flashcard atual sendo exibido
  flashcardAtual: Flashcard | null = null;
  currentIndex: number = 0;

  // Estados da UI
  mostrarConfirmacao = false;
  mostrarMensagemSucesso = false;
  mostrarJanela = false;
  mostrarResposta: boolean = false;
  mostrarCuriosidade: boolean = false;

  // Categoria
  categoriaSelecionada: string = '';
  categoriaImagem: string = '';
  categoriaTexto: string = '';
  isMinhasMemorias: boolean = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoriaSelecionada = params['categoria'] || '';
      this.setCategoria(this.categoriaSelecionada);
      
      // Carrega flashcards
      this.carregarFlashcards();
    });
  }

  carregarFlashcards() {
    if (this.isMinhasMemorias) {
      // "Minhas Memórias" = mostra TODOS os flashcards
      this.flashcards$ = this.flashcardService.verTodosFlashcards();
    } else if (this.categoriaSelecionada) {
      // Categoria específica
      this.flashcards$ = this.flashcardService.verFlashcardsPorCategoria(this.categoriaSelecionada);
    }
    
    this.flashcards$.subscribe(flashcards => {
      console.log('Flashcards carregados:', flashcards.length);
      if (flashcards.length > 0) {
        this.flashcardAtual = flashcards[0];
        this.currentIndex = 0;
      } else {
        this.flashcardAtual = null;
      }
    });
  }

  setCategoria(cat: string) {
    this.categoriaSelecionada = cat;

    // Verifica se é "Minhas Memórias"
    this.isMinhasMemorias = !cat || cat.toLowerCase() === 'minhas memórias';

    if (this.isMinhasMemorias) {
      this.categoriaImagem = '../../assets/img/bolinha.png';
      this.categoriaTexto = 'Minhas Memórias';
    } else {
      // Categorias específicas
      switch (cat.toLowerCase()) {
        case 'amigos':
          this.categoriaImagem = '../../assets/img/categoria_amigos.png';
          this.categoriaTexto = 'Amigos';
          break;
        case 'família':
        case 'familia':
          this.categoriaImagem = '../../assets/img/categoria_familia.png';
          this.categoriaTexto = 'Família';
          break;
        case 'momentos marcantes':
          this.categoriaImagem = '../../assets/img/categoria_momentos_marcantes.png';
          this.categoriaTexto = 'Momentos Marcantes';
          break;
        case 'passatempos':
          this.categoriaImagem = '../../assets/img/categoria_passatempos.png';
          this.categoriaTexto = 'Passatempos';
          break;
        case 'infância':
        case 'infancia':
          this.categoriaImagem = '../../assets/img/categoria_infancia.png';
          this.categoriaTexto = 'Infância';
          break;
        case 'juventude':
          this.categoriaImagem = '../../assets/img/categoria_juventude.png';
          this.categoriaTexto = 'Juventude';
          break;
        case 'animais de estimação':
        case 'animais':
          this.categoriaImagem = '../../assets/img/categoria_animais_de_estimacao.png';
          this.categoriaTexto = 'Animais de Estimação';
          break;
        default:
          this.categoriaImagem = '../../assets/img/bolinha.png';
          this.categoriaTexto = cat;
      }
    }
  }

  // Métodos para manipulação de mídia
  getMidiaAuxiliarTipo(flashcard: Flashcard): string {
    if (!flashcard.midiaAuxiliar) return '';
    
    if (flashcard.midiaAuxiliar.startsWith('data:image')) return 'image';
    if (flashcard.midiaAuxiliar.startsWith('data:video')) return 'video';
    if (flashcard.midiaAuxiliar.startsWith('data:audio')) return 'audio';
    
    return '';
  }

  isMidiaValida(midia: string | undefined): boolean {
    return !!midia && midia.trim() !== '' && midia.startsWith('data:');
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }

  // Navegação entre flashcards
  verResposta() {
    this.mostrarResposta = !this.mostrarResposta;
  }

  proximo() {
    this.flashcards$.subscribe(flashcards => {
      if (flashcards.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % flashcards.length;
        this.flashcardAtual = flashcards[this.currentIndex];
        this.mostrarResposta = false;
        this.mostrarCuriosidade = false;
      }
    });
  }

  anterior() {
    this.flashcards$.subscribe(flashcards => {
      if (flashcards.length > 0) {
        this.currentIndex = (this.currentIndex - 1 + flashcards.length) % flashcards.length;
        this.flashcardAtual = flashcards[this.currentIndex];
        this.mostrarResposta = false;
        this.mostrarCuriosidade = false;
      }
    });
  }

  // Gerenciamento de flashcards
  mostrarAlertaConfirmacao() {
    this.mostrarConfirmacao = true;
  }

  naoExcluir() {
    this.mostrarConfirmacao = false;
  }

  async confirmarExclusao() {
    if (this.flashcardAtual?.id) {
      try {
        await this.flashcardService.deleteFlashcard(this.flashcardAtual.id);
        this.mostrarConfirmacao = false;
        this.mostrarMensagemSucesso = true;
        
        // Recarrega a lista após exclusão
        setTimeout(() => {
          this.mostrarMensagemSucesso = false;
          this.carregarFlashcards();
        }, 2000);
      } catch (error) {
        console.error('Erro ao excluir flashcard:', error);
      }
    }
  }

  editarFlashcard(flashcard: Flashcard) {
    this.router.navigate(['/criar-flashcard'], {
      queryParams: {
        id: flashcard.id,
        categoria: flashcard.categoriaFlashcard,
        titulo: flashcard.tituloFlashcard,
        curiosidade: flashcard.curiosidade,
        editando: true
      }
    });
  }

  // Navegação
  voltar() {
    this.router.navigate(['/categorias']);
  }

  inicio() {
    this.router.navigate(['/home']);
  }

  // Curiosidade
  abrirCuriosidade() {
    this.mostrarCuriosidade = true;
  }

  fecharCuriosidade() {
    this.mostrarCuriosidade = false;
  }

  // Janela mais opções
  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  voltar2() {
    this.navCtrl.back();
  }

  // Áudio
  toggleAudio() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    const button = document.querySelector('.audio-btn') as HTMLElement;

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

  // Criar novo flashcard
  criarNovoFlashcard() {
    this.router.navigate(['/criar-flashcard'], {
      queryParams: {
        categoria: this.isMinhasMemorias ? '' : this.categoriaSelecionada
      }
    });
  }

  // Método para mostrar a categoria real do flashcard (opcional)
  getCategoriaFlashcard(flashcard: Flashcard): string {
    return flashcard.categoriaFlashcard || 'Sem categoria';
  }
}