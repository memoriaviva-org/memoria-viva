import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Flashcard, FlashcardService } from '../services/flashcard.service';

@Component({
  selector: 'app-criar-flashcard',
  templateUrl: './criar-flashcard.page.html',
  styleUrls: ['./criar-flashcard.page.scss'],
  standalone: false
})
export class CriarFlashcardPage {

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarJanela = false;

  titulo = '';
  pergunta = '';
  resposta = '';
  categoriaSelecionada = '';

  // base64
  midiaAuxiliar?: string;
  audioPergunta?: string;
  audioResposta?: string;

   // Arquivos e previews
  arquivoSelecionado?: File;
  tipoArquivo?: string; // 'image', 'video', 'audio'
  arquivoPreview?: string; // base64 para imagem/video/audio


  constructor(private flashcardService: FlashcardService, private router: Router, private route: ActivatedRoute) {}

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
    } else { audio.pause(); }

    audio.onended = () => {
      audio.style.display = 'none';
      button.style.display = 'inline-flex';
    };
  }

  selecionarArquivo(event: any, tipo: 'midia' | 'audioPergunta' | 'audioResposta') {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (tipo === 'midia') this.midiaAuxiliar = base64;
      if (tipo === 'audioPergunta') this.audioPergunta = base64;
      if (tipo === 'audioResposta') this.audioResposta = base64;
    };
    reader.readAsDataURL(file); // converte para base64
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.arquivoSelecionado = file;

    // Detecta o tipo
    if (file.type.startsWith('image/')) this.tipoArquivo = 'image';
    else if (file.type.startsWith('video/')) this.tipoArquivo = 'video';
    else if (file.type.startsWith('audio/')) this.tipoArquivo = 'audio';
    else this.tipoArquivo = undefined;

    // Cria preview
    const reader = new FileReader();
    reader.onload = () => this.arquivoPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  onAudioSelected(event: any, tipo: 'pergunta' | 'resposta') {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (tipo === 'pergunta') this.audioPergunta = base64;
      else this.audioResposta = base64;
    };
    reader.readAsDataURL(file);
  }

  async salvarFlashcard() {
  if (!this.titulo || !this.audioPergunta || !this.audioResposta || !this.categoriaSelecionada) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }

  // Cria o objeto do flashcard
  const flashcard: Flashcard = {
    titulo: this.titulo,
    pergunta: this.pergunta || '',   // evita undefined
    resposta: this.resposta || '',   // evita undefined
    categoria: this.categoriaSelecionada,
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
    console.log('Título:', this.titulo);
    console.log('Categoria:', this.categoriaSelecionada);
    console.log('Arquivo:', this.arquivoSelecionado);

    this.router.navigate(['/flashcards']);
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar flashcard.');
  }
}
}
