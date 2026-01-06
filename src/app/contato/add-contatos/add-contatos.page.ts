import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ContatoService, Contato } from '../../services/contato.service';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AudioPreferenceService } from '../../services/audio-preference.service';

@Component({
  selector: 'app-add-contatos',
  templateUrl: './add-contatos.page.html',
  styleUrls: ['./add-contatos.page.scss'],
  standalone: false
})
export class AddContatosPage implements OnInit {
  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;

  nome = '';
  relacao = '';
  telefone = '';
  endereco = '';
  fotoUrl = '';
  audioUrl = '';

  arquivoSelecionado: File | null = null;
  audioSelecionado: File | null = null;

  mostrarMensagemSucesso = false;
  mostrarConfirmacao = false;

  mostrarAlertCamposObrigatorios = false;
  mostrarAlertSalvarErro = false;
  mostrarAlertContatoNaoEncontrado = false;
  mostrarAlertDeletarErro = false;
  mostrarAlertArquivoInvalido = false;
  mostrarAlertAudioInvalido = false;

  contatoId: string | null = null;
  modoEdicao = false;
  mostrarJanela = false;

  private readonly MAX_FILE_SIZE_MB = 5;
  private readonly IMAGE_TYPES = ['image/jpeg', 'image/png'];
  private readonly AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a'];

  constructor(
    private contatoService: ContatoService,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private audioPref: AudioPreferenceService
  ) {}

  // === Segurança e validação ===

  private sanitizeInput(value: string): string {
    return value.replace(/[<>]/g, '').trim(); // evita injeções básicas
  }

  private validatePhone(value: string): boolean {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
  }

  private validateFile(file: File, allowedTypes: string[]): boolean {
    const validType = allowedTypes.includes(file.type);
    const validSize = file.size <= this.MAX_FILE_SIZE_MB * 1024 * 1024;
    return validType && validSize;
  }

  // === Salvar contato ===

  async salvarContato() {
    if (!this.validarCampos()) {
      this.mostrarAlertCamposObrigatorios = true;

      setTimeout(() => {
        this.mostrarAlertCamposObrigatorios = false;
      }, 3500);

      return;
    }

    const contato: Contato = {
      nome: this.sanitizeInput(this.nome),
      relacao: this.sanitizeInput(this.relacao),
      telefone: this.sanitizeInput(this.telefone),
      endereco: this.sanitizeInput(this.endereco),
      fotoUrl: this.fotoUrl,
      audioUrl: this.audioUrl
    };

    try {
      if (this.modoEdicao && this.contatoId) {
        contato.id = this.contatoId;
        await this.contatoService.updateContato(contato);
      } else {
        await this.contatoService.addContato(contato);
      }
      this.router.navigateByUrl('/contatos');
    } catch {
      this.mostrarAlertSalvarErro = true;

      setTimeout(() => {
        this.mostrarAlertCamposObrigatorios = false;
      }, 4000);
    }
  }

  private validarCampos(): boolean {
  return (
    this.nome.trim() !== '' &&
    this.relacao.trim() !== '' &&
    this.telefone.trim() !== '' &&
    this.endereco.trim() !== '' &&
    this.fotoUrl.trim() !== '' &&
    this.audioUrl.trim() !== ''
  );
}


  // === Deletar contato ===

  async deletarContato(): Promise<void> {
    if (!this.contatoId) {
      this.mostrarAlertContatoNaoEncontrado = true;

      setTimeout(() => {
        this.mostrarAlertCamposObrigatorios = false;
      }, 4000);

      return;
    }

    try {
      await this.contatoService.deleteContato(this.contatoId);
      this.router.navigateByUrl('/contatos');
    } catch (err) {
      console.error('Erro ao deletar contato:', err);
      this.mostrarAlertDeletarErro = true;

      setTimeout(() => {
        this.mostrarAlertDeletarErro = false;
      }, 3500);
    }
  }

  // === Upload de imagem ===

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!this.validateFile(file, this.IMAGE_TYPES)) {
      this.mostrarAlertArquivoInvalido = true;

      setTimeout(() => {
        this.mostrarAlertArquivoInvalido = false;
      }, 4000);

      return;
    }

    this.arquivoSelecionado = file;
    const reader = new FileReader();
    reader.onload = () => (this.fotoUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  // === Upload seguro de áudio ===

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!this.validateFile(file, this.AUDIO_TYPES)) {
      this.mostrarAlertAudioInvalido = true;

      setTimeout(() => {
        this.mostrarAlertAudioInvalido = false;
      }, 4000)

      return;
    }

    this.audioSelecionado = file;
    const reader = new FileReader();
    reader.onload = () => (this.audioUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  // === Inicialização ===

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      if (params['editar'] === 'true' && params['id']) {
        this.modoEdicao = true;
        this.contatoId = params['id'] as string; // força tipo string

        const contato = await this.contatoService.getContatoById(this.contatoId!); // ou usa "!" para garantir não nulo
        if (contato) {
          this.nome = contato.nome;
          this.relacao = contato.relacao;
          this.telefone = contato.telefone;
          this.endereco = contato.endereco ?? '';
          this.fotoUrl = contato.fotoUrl ?? '';
          this.audioUrl = contato.audioUrl ?? '';
        }
      }
    });
  }

  async ngAfterViewInit() {
    await this.audioPref.autoPlayIfEnabled(this.audioPlayer);
  }
  // === UI auxiliares ===

  mostrarJanelaMais(): void {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais(): void {
    this.mostrarJanela = false;
  }

  mostrarAlertaConfirmacao(): void {
    this.mostrarConfirmacao = true;
  }

  naoExcluir(): void {
    this.mostrarConfirmacao = false;
  }

  async showToast(msg: string): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: 'medium',
      position: 'bottom'
    });
    await toast.present();
  }

  // === Máscara segura de telefone ===

  maskPhone(event: any): void {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    value = value.length <= 10
      ? value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
      : value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');

    input.value = value;
    this.telefone = value;
  }

  // === Reprodução segura de áudio ===

  toggleAudio(event: Event): void {
    const button = event.currentTarget as HTMLElement;
    const audio = this.audioPlayer.nativeElement;

    const src = this.modoEdicao
      ? '../../assets/audio/AudioAtualizarContato.mp3'
      : '../../assets/audio/AudioAdicionarContato.mp3'; 
      
    audio.src = src;
    audio.load();

    if (audio.paused) {
      button.style.display = 'none';
      audio.style.display = 'block';
      audio.play().catch(() => this.showToast('Erro ao reproduzir áudio.'));
    } else {
      audio.pause();
    }

    audio.onended = () => {
      audio.style.display = 'none';
      button.style.display = 'inline-flex';
    };
  }
}
