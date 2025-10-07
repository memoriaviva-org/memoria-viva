import { Component, ViewChild, ElementRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Flashcard, FlashcardService } from '../services/flashcard.service';

@Component({
  selector: 'app-criar-flashcard',
  templateUrl: './criar-flashcard.page.html',
  styleUrls: ['./criar-flashcard.page.scss'],
  standalone: false
})
export class CriarFlashcardPage implements OnInit {
  private flashcardService = inject(FlashcardService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarJanela = false;

  // Variáveis do formulário
  tituloFlashcard = '';
  categoriaSelecionada = '';
  curiosidade = '';

  // base64
  midiaAuxiliar?: string;
  audioPergunta?: string;
  audioResposta?: string;

  // Arquivos e previews
  arquivoSelecionado?: File;
  tipoArquivo?: string;
  arquivoPreview?: string;

  // Variáveis para edição
  modoEdicao = false;
  flashcardId: string | null = null;
  flashcardOriginal: Flashcard | null = null;

  // NOVO: Variável para controlar a origem
  origem: string = 'gerenciar'; // valor padrão

  categorias: string[] = [
    'Família',
    'Amigos',
    'Passatempos',
    'Infância',
    'Juventude',
    'Animais de Estimação',
    'Momentos Marcantes'
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoriaSelecionada = params['categoria'] || '';

      // Verificar se está no modo edição
      if (params['editar'] === 'true' && params['id']) {
        this.modoEdicao = true;
        this.flashcardId = params['id'];
        this.origem = params['origem'] || 'gerenciar'; // CAPTURAR A ORIGEM
        this.carregarFlashcardParaEdicao();
      }
    });
  }

  carregarFlashcardParaEdicao() {
    if (!this.flashcardId) return;

    this.flashcardService.getFlashcardPorId(this.flashcardId).subscribe(flashcard => {
      if (flashcard) {
        this.flashcardOriginal = flashcard;
        this.tituloFlashcard = flashcard.tituloFlashcard;
        this.categoriaSelecionada = flashcard.categoriaFlashcard;
        this.curiosidade = flashcard.curiosidade || '';
        this.audioPergunta = flashcard.audioPergunta;
        this.audioResposta = flashcard.audioResposta;
        this.midiaAuxiliar = flashcard.midiaAuxiliar;

        // Configurar preview da mídia auxiliar
        if (this.midiaAuxiliar) {
          this.arquivoPreview = this.midiaAuxiliar;
          this.determinarTipoArquivo(this.midiaAuxiliar);
        }

        console.log('Flashcard carregado para edição:', flashcard);
        console.log('Origem:', this.origem);
      }
    });
  }

  // NOVO: Método para navegar de volta baseado na origem
  private navegarDeVolta() {
    if (this.origem === 'flashcards') {
      // Voltar para a página de flashcards com a categoria
      this.router.navigate(['/flashcard'], {
        queryParams: {
          categoria: this.categoriaSelecionada
        }
      });
    } else {
      // Voltar para gerenciar flashcards (comportamento padrão)
      this.router.navigate(['/gerenciar-flashcards'], {
        queryParams: {
          categoria: this.categoriaSelecionada
        }
      });
    }
  }

  async salvarFlashcard() {
    if (this.modoEdicao) {
      await this.atualizarFlashcard();
    } else {
      await this.criarNovoFlashcard();
    }
  }

  async criarNovoFlashcard() {
    if (!this.tituloFlashcard || !this.audioPergunta || !this.audioResposta || !this.categoriaSelecionada) {
      alert('Preencha todos os campos obrigatórios (Título, Categoria, Áudio da Pergunta e Áudio da Resposta)!');
      return;
    }

    const flashcard: Flashcard = {
      tituloFlashcard: this.tituloFlashcard,
      categoriaFlashcard: this.categoriaSelecionada,
      curiosidade: this.curiosidade || undefined,
      audioPergunta: this.audioPergunta,
      audioResposta: this.audioResposta
    };

    if (this.midiaAuxiliar) {
      flashcard.midiaAuxiliar = this.midiaAuxiliar;
    }

    try {
      await this.flashcardService.addFlashcard(flashcard);
      alert('Flashcard salvo com sucesso!');

      // USAR O NOVO MÉTODO
      this.navegarDeVolta();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar flashcard. O tamanho combinado da mídia é muito grande para o Firestore.');
    }
  }

  async atualizarFlashcard() {
    if (!this.flashcardId) {
      alert('ID do flashcard não encontrado');
      return;
    }

    if (!this.tituloFlashcard || !this.audioPergunta || !this.audioResposta || !this.categoriaSelecionada) {
      alert('Preencha todos os campos obrigatórios (Título, Categoria, Áudio da Pergunta e Áudio da Resposta)!');
      return;
    }

    const flashcardAtualizado: Flashcard = {
      id: this.flashcardId,
      tituloFlashcard: this.tituloFlashcard,
      categoriaFlashcard: this.categoriaSelecionada,
      curiosidade: this.curiosidade || undefined,
      audioPergunta: this.audioPergunta,
      audioResposta: this.audioResposta,
      midiaAuxiliar: this.midiaAuxiliar
    };

    try {
      await this.flashcardService.updateFlashcard(flashcardAtualizado);
      alert('Flashcard atualizado com sucesso!');

      // USAR O NOVO MÉTODO
      this.navegarDeVolta();
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar flashcard.');
    }
  }

  // Também atualizar o método voltar para usar a origem
  voltar() {
    this.navegarDeVolta();
  }

  // ... resto do código permanece igual
  determinarTipoArquivo(base64String: string) {
    if (base64String.startsWith('data:image/')) {
      this.tipoArquivo = 'image';
    } else if (base64String.startsWith('data:video/')) {
      this.tipoArquivo = 'video';
    } else if (base64String.startsWith('data:audio/')) {
      this.tipoArquivo = 'audio';
    } else {
      this.tipoArquivo = undefined;
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const MAX_SIZE_BYTES = 150000;
    if (file.size > MAX_SIZE_BYTES) {
      alert(`O arquivo é muito grande. Para armazenamento direto, o limite da Mídia Auxiliar é de ${MAX_SIZE_BYTES / 1000} KB.`);
      this.midiaAuxiliar = undefined;
      this.arquivoSelecionado = undefined;
      this.tipoArquivo = undefined;
      this.arquivoPreview = undefined;
      event.target.value = null;
      return;
    }

    this.arquivoSelecionado = file;

    if (file.type.startsWith('image/')) this.tipoArquivo = 'image';
    else if (file.type.startsWith('video/')) this.tipoArquivo = 'video';
    else if (file.type.startsWith('audio/')) this.tipoArquivo = 'audio';
    else this.tipoArquivo = undefined;

    const reader = new FileReader();
    reader.onload = () => {
        this.arquivoPreview = reader.result as string;
        this.midiaAuxiliar = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onAudioSelected(event: any, tipo: 'pergunta' | 'resposta') {
    const file: File = event.target.files[0];
    if (!file) return;

    const MAX_SIZE_BYTES = 120000;
    if (file.size > MAX_SIZE_BYTES) {
        alert(`O arquivo de áudio é muito grande. O limite máximo é de ${MAX_SIZE_BYTES / 1000} KB.`);
        event.target.value = null;
        if (tipo === 'pergunta') this.audioPergunta = undefined;
        else this.audioResposta = undefined;
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (tipo === 'pergunta') this.audioPergunta = base64;
      else this.audioResposta = base64;
    };
    reader.readAsDataURL(file);
  }

  limparMidiaAuxiliar() {
    this.midiaAuxiliar = undefined;
    this.arquivoSelecionado = undefined;
    this.tipoArquivo = undefined;
    this.arquivoPreview = undefined;
  }

  limparAudio(tipo: 'pergunta' | 'resposta') {
    if (tipo === 'pergunta') {
      this.audioPergunta = undefined;
    } else {
      this.audioResposta = undefined;
    }
  }

  mostrarJanelaMais() { this.mostrarJanela = !this.mostrarJanela; }
  fecharJanelaMais() { this.mostrarJanela = false; }

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
}
