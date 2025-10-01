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

  tituloFlashcard = '';
  categoriaSelecionada = '';
  curiosidade = '';

  // base64
  midiaAuxiliar?: string;
  audioPergunta?: string;
  audioResposta?: string;

  // Arquivos e previews
  arquivoSelecionado?: File;
  tipoArquivo?: string; // 'image', 'video', 'audio'
  arquivoPreview?: string; // base64 para imagem/video/audio

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
    });
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

  // --- MÍDIA AUXILIAR (IMAGEM/VÍDEO/ÁUDIO) ---
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    // Limite de tamanho rigoroso para Mídia Auxiliar (150 KB)
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

    // Detecta o tipo
    if (file.type.startsWith('image/')) this.tipoArquivo = 'image';
    else if (file.type.startsWith('video/')) this.tipoArquivo = 'video';
    else if (file.type.startsWith('audio/')) this.tipoArquivo = 'audio';
    else this.tipoArquivo = undefined;

    // Cria preview e armazena o Base64 final
    const reader = new FileReader();
    reader.onload = () => {
        this.arquivoPreview = reader.result as string;
        this.midiaAuxiliar = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // --- ÁUDIOS DE PERGUNTA/RESPOSTA ---
  onAudioSelected(event: any, tipo: 'pergunta' | 'resposta') {
    const file: File = event.target.files[0];
    if (!file) return;

    // Limite de tamanho mais rigoroso para Áudios (120 KB)
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

  async salvarFlashcard() {
    if (!this.tituloFlashcard || !this.audioPergunta || !this.audioResposta || !this.categoriaSelecionada) {
      alert('Preencha todos os campos obrigatórios (Título, Categoria, Áudio da Pergunta e Áudio da Resposta)!');
      return;
    }

    // Cria o objeto do flashcard com curiosidade
    const flashcard: Flashcard = {
      tituloFlashcard: this.tituloFlashcard,
      categoriaFlashcard: this.categoriaSelecionada,
      curiosidade: this.curiosidade || undefined,
      audioPergunta: this.audioPergunta,
      audioResposta: this.audioResposta
    };

    // Só adiciona midiaAuxiliar se houver
    if (this.midiaAuxiliar) {
      flashcard.midiaAuxiliar = this.midiaAuxiliar;
    }

    try {
      await this.flashcardService.addFlashcard(flashcard);
      alert('Flashcard salvo com sucesso!');

      this.router.navigate(['/gerenciar-flashcards']);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar flashcard. O tamanho combinado da mídia é muito grande para o Firestore.');
    }
  }

  voltar() {
    this.router.navigate(['/categorias']);
  }

  // Limpar mídia auxiliar
  limparMidiaAuxiliar() {
    this.midiaAuxiliar = undefined;
    this.arquivoSelecionado = undefined;
    this.tipoArquivo = undefined;
    this.arquivoPreview = undefined;
  }

  // Limpar áudio
  limparAudio(tipo: 'pergunta' | 'resposta') {
    if (tipo === 'pergunta') {
      this.audioPergunta = undefined;
    } else {
      this.audioResposta = undefined;
    }
  }
}