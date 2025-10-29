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

  mostrarAlertCO =  false;
  mostrarAlertSuccess = false;
  mostrarAlertFirestore = false;
  mostrarAlertID = false;
  mostrarAlertSuccessEdicao = false;
  mostrarAlertEAF = false;
  mostrarAlertArquivoGrande = false;
  mostrarAlertArquivoAudioGrande = false;
  maxSizeInKB: number | undefined;
  maxSizeInKB2: number | undefined;

  // Variáveis do formulário
  tituloFlashcard = '';
  categoriaSelecionada = '';
  curiosidade = '';
  midiaAuxiliar: string = '';


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
        this.curiosidade = flashcard.curiosidade || 'uma curiosidade não foi adicionada';
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

    private sanitizeInput(input: string): string {
    const temp = document.createElement('div');
    temp.textContent = input.trim();
    return temp.innerHTML;
  }

  private validarCampos(): boolean {
    return (
      this.tituloFlashcard.trim() !== '' &&
      this.categoriaSelecionada.trim() !== '' &&
      !!this.audioPergunta?.trim() &&
      !!this.audioResposta?.trim() &&
      this.midiaAuxiliar.trim() !== ''
    );
  }

  async salvarFlashcard() {
    if (this.modoEdicao) {
      if (!this.validarCampos()) {
        this.mostrarAlertCO = true;
        setTimeout(() => this.mostrarAlertCO = false, 4000);
        return;
      }

      await this.atualizarFlashcard();
    } else {

      if (!this.validarCampos()) {
        this.mostrarAlertCO = true;
        setTimeout(() => this.mostrarAlertCO = false, 4000);
        return;
      }

      await this.criarNovoFlashcard();
    }
  }

  async criarNovoFlashcard() {
    if (!this.tituloFlashcard || !this.audioPergunta || !this.audioResposta || !this.categoriaSelecionada || !this.midiaAuxiliar) {
      this.mostrarAlertCO = true;
      setTimeout(() => {
        this.mostrarAlertCO = false;
      }, 4000);
      return
    }

    const flashcard: Flashcard = {
      tituloFlashcard: this.sanitizeInput(this.tituloFlashcard),
      categoriaFlashcard: this.sanitizeInput(this.categoriaSelecionada),
      curiosidade: this.curiosidade ? this.sanitizeInput(this.curiosidade) : '',
      audioPergunta: this.audioPergunta,
      audioResposta: this.audioResposta,
      midiaAuxiliar: this.midiaAuxiliar
    };

    if (this.midiaAuxiliar) {
      flashcard.midiaAuxiliar = this.midiaAuxiliar;
    }

    try {
      await this.flashcardService.addFlashcard(flashcard);
      this.mostrarAlertSuccess = true;

      await this.delay(3000);

      this.mostrarAlertSuccess = false;

      // USAR O NOVO MÉTODO
      this.navegarDeVolta();
    } catch (err) {
      console.error(err);

      this.mostrarAlertFirestore = true;

      setTimeout(() => {
        this.mostrarAlertFirestore = false;
      }, 4000);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async atualizarFlashcard() {
    if (!this.flashcardId) {
      this.mostrarAlertID = true;

      setTimeout(() => {
        this.mostrarAlertID = false;
      }, 4000);

      return;
    }

    if (!this.tituloFlashcard || !this.audioPergunta || !this.audioResposta || !this.categoriaSelecionada || !this.midiaAuxiliar) {

      this.mostrarAlertCO = true;

      setTimeout(() => {
        this.mostrarAlertCO = false;
      }, 4000);

      return;
    }

    const flashcardAtualizado: Flashcard = {
      id: this.flashcardId,
      tituloFlashcard: this.sanitizeInput(this.tituloFlashcard),
      categoriaFlashcard: this.sanitizeInput(this.categoriaSelecionada),
      curiosidade: this.curiosidade ? this.sanitizeInput(this.curiosidade) : undefined,
      audioPergunta: this.audioPergunta,
      audioResposta: this.audioResposta,
      midiaAuxiliar: this.midiaAuxiliar
    };

    try {
      await this.flashcardService.updateFlashcard(flashcardAtualizado);

      this.mostrarAlertSuccessEdicao = true;

      await this.delay(3000);

      this.mostrarAlertSuccessEdicao = false;

      this.navegarDeVolta();
    } catch (err) {
      console.error(err);

      this.mostrarAlertEAF = true;

      setTimeout(() => {
        this.mostrarAlertEAF = false;
      }, 4000);
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

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const MAX_SIZE_BYTES = 150000;
    this.maxSizeInKB = MAX_SIZE_BYTES / 1000;  // Variável para o limite em KB

    if (file.size > MAX_SIZE_BYTES) {
      this.mostrarAlertArquivoGrande = true;

      await this.delay(5000);

      this.mostrarAlertArquivoGrande = false;

      this.limparMidiaAuxiliar();
      event.target.value = null;
      return;
    }

    this.arquivoSelecionado = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.arquivoPreview = reader.result as string;
      this.midiaAuxiliar = reader.result as string;
      this.determinarTipoArquivo(this.arquivoPreview);
    };
    reader.readAsDataURL(file);
  }


  onAudioSelected(event: any, tipo: 'pergunta' | 'resposta') {
    const file: File = event.target.files[0];
    if (!file) return;

    const MAX_SIZE_BYTES = 120000;
    this.maxSizeInKB2 = MAX_SIZE_BYTES / 1000;
    if (file.size > MAX_SIZE_BYTES) {
      alert(`O arquivo de áudio é muito grande. O limite máximo é de ${MAX_SIZE_BYTES / 1000} KB.`);

      this.mostrarAlertArquivoAudioGrande = true;

      setTimeout(() => {
        this.mostrarAlertArquivoAudioGrande = false;
      }, 5000);

      event.target.value = null;

      if (tipo === 'pergunta') this.audioPergunta = '';
      else this.audioResposta = '';

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
    this.midiaAuxiliar = '';
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
