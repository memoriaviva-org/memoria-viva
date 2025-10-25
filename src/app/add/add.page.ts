import { TipoMidia } from './../services/registro.service';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RegistroService, MeuDia } from '../services/registro.service';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
  standalone: false
})
export class AddPage implements OnInit {

@ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;


  mostrarJanela = false;
  mostrarMensagemSucesso = false;
  mostrarConfirmacao = false;
  mostrarAlertErroRegistro = false;
  mostrarAlertID = false;
  mostrarAlertSucessoAtualizar = false;
  mostrarAlertErroAtualizar = false;
  mostrarAlertErroExcluir = false;

  titulo: string = '';
  diaSemana: string = '';
  horario: string = '';
  tipoMidia: TipoMidia | null = null;

  arquivoSelecionado: File | null = null;
  fotoSelecionadaUrl: string | null = null;

  carregando = false;

  modoEdicao = false;
  registroId: string | null = null;
  registroOriginal: MeuDia | null = null;

  constructor(
    private registroService: RegistroService,
    private router: Router,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {
    const dias = [
      'Domingo',
      'Segunda-Feira',
      'Terça-Feira',
      'Quarta-Feira',
      'Quinta-Feira',
      'Sexta-Feira',
      'Sábado'
    ];
    const hoje = new Date().getDay();
    this.diaSemana = dias[hoje];
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['editar'] === 'true' && params['id']) {
        this.modoEdicao = true;
        this.registroId = params['id'];
        this.carregarRegistroParaEdicao();
      }
    });
  }

  carregarRegistroParaEdicao() {
    if (!this.registroId) return;

    this.registroService.getRegistroPorId(this.registroId).subscribe(registro => {
      if (registro) {
        this.registroOriginal = registro;
        this.titulo = registro.titulo;
        this.diaSemana = registro.diaSemana;
        this.horario = registro.horario;
        this.tipoMidia = registro.tipoMidia;
        this.fotoSelecionadaUrl = registro.midiaUrl || null;

        console.log('Registro carregado para edição:', registro);
        console.log('URL da mídia:', this.fotoSelecionadaUrl);
        console.log('Tipo de mídia:', this.tipoMidia);
      }
    });
  }

    private validarCampos(): boolean {
    return (
      this.titulo.trim() !== '' &&
      this.diaSemana.trim() !== '' &&
      this.horario.trim() !== '' &&
      (this.fotoSelecionadaUrl !== null || this.arquivoSelecionado !== null)
    );
  }
  private sanitizeInput(input: string): string {
    const temp = document.createElement('div');
    temp.textContent = input.trim();
    return temp.innerHTML;
  }


  async salvarRegistro() {
    if (!this.validarCampos()) {
      this.showToast('Preencha todos os campos obrigatórios.');
      return;
    }

    if (this.modoEdicao) {
      await this.atualizarRegistro();
    } else {
      await this.criarNovoRegistro();
    }
  }


  async criarNovoRegistro() {
    // Determinar tipo de mídia baseado no arquivo selecionado
    this.determinarTipoMidia();

    const item: MeuDia = {
      titulo: this.titulo,
      diaSemana: this.diaSemana,
      horario: this.horario,
      midiaUrl: this.fotoSelecionadaUrl || '',
      tipoMidia: this.tipoMidia
    };

    try {
      await this.registroService.addItem(item);
      this.router.navigateByUrl('/meu-dia-registros');
    } catch (error) {
      console.error('Erro ao adicionar item:', error);

      this.mostrarAlertErroRegistro = true;

      setTimeout(() => {
        this.mostrarAlertErroRegistro = false;
      }, 3000);
    }
  }

  async atualizarRegistro() {
    if (!this.registroId) {
      this.mostrarAlertID = true;

      setTimeout(() => {
        this.mostrarAlertID = false;
      }, 3000);

      return;
    }

    // Se um novo arquivo foi selecionado, usar o novo tipo de mídia
    // Se não, manter o tipo de mídia original
    if (this.arquivoSelecionado) {
      this.determinarTipoMidia();
    } else {
      // Manter o tipo de mídia original se nenhum novo arquivo foi selecionado
      this.tipoMidia = this.registroOriginal?.tipoMidia || null;
    }

    const itemAtualizado: MeuDia = {
      id: this.registroId,
      titulo: this.titulo,
      diaSemana: this.diaSemana,
      horario: this.horario,
      midiaUrl: this.fotoSelecionadaUrl || '',
      tipoMidia: this.tipoMidia
    };

    try {
      await this.registroService.updateItem(itemAtualizado);

      this.mostrarAlertSucessoAtualizar = true;

      await this.delay(3000);

      this.mostrarAlertSucessoAtualizar = false;

      this.router.navigateByUrl('/meu-dia-registros');

    } catch (error) {
      console.error('Erro ao atualizar item:', error);

      this.mostrarAlertErroAtualizar = true;

      setTimeout(() => {
        this.mostrarAlertErroAtualizar = false;
      }, 3000);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // NOVO: Função para determinar o tipo de mídia
  private determinarTipoMidia() {
    if (this.arquivoSelecionado) {
      if (this.arquivoSelecionado.type.startsWith('image/')) {
        this.tipoMidia = 'imagem';
      } else if (this.arquivoSelecionado.type.startsWith('video/')) {
        this.tipoMidia = 'video';
      } else if (this.arquivoSelecionado.type.startsWith('audio/')) {
        this.tipoMidia = 'audio';
      }
    } else {
      // Se não há arquivo selecionado, manter o tipo atual ou definir como null
      this.tipoMidia = this.tipoMidia || null;
    }
  }

  async excluirRegistro() {
    if (!this.registroId) return;

    try {
      await this.registroService.deleteItem(this.registroId);
      this.mostrarConfirmacao = false;
      this.mostrarMensagemSucesso = true;
      this.router.navigateByUrl('/meu-dia-registros');

      setTimeout(() => {
        this.mostrarMensagemSucesso = false;
        this.router.navigateByUrl('/meu-dia-registros');
      }, 2000);
    } catch (error) {
      console.error('Erro ao excluir registro:', error);

      this.mostrarAlertErroExcluir = false;

      setTimeout(() => {
        this.mostrarAlertErroExcluir = false;
      }, 3000);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const maxSizeMB = 10;
    const allowedTypes = ['image/', 'video/'];

    if (!allowedTypes.some(type => file.type.startsWith(type))) {
      this.showToast('Tipo de arquivo inválido.');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      this.showToast('Arquivo muito grande. Limite: 10MB.');
      return;
    }

    this.arquivoSelecionado = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.fotoSelecionadaUrl = reader.result as string;
      this.determinarTipoMidia();
    };
    reader.readAsDataURL(file);
  }


  limparFormulario() {
    this.titulo = '';
    this.diaSemana = '';
    this.horario = '';
    this.tipoMidia = null;
    this.arquivoSelecionado = null;
    this.fotoSelecionadaUrl = null;
  }

  async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    });
    toast.present();

    const shadow = toast.shadowRoot;
    if (!shadow) return;

    const toastWrapper = shadow.querySelector('.toast-wrapper.toast-bottom.toast-layout-baseline') as HTMLElement | null;
    const container = shadow.querySelector('.toast-container');
    const content = shadow.querySelector('.toast-content');
    const message = shadow.querySelector('.toast-message');

    container?.classList.add('custom-toast-container');
    content?.classList.add('custom-toast-content');
    message?.classList.add('custom-toast-message');
    container?.setAttribute('style',
      'font-size: 16px; color: #d00000'
    );

    if (toastWrapper) {
      toastWrapper.style.top = '80%';
      toastWrapper.style.borderRadius = '8px';
      toastWrapper.style.height = '60px';
      toastWrapper.style.marginTop = '0px'
      toastWrapper.style.width = '75%';
      toastWrapper.style.backgroundColor = '#ffecec';
      toastWrapper.style.borderLeft = '6px solid #ff3b30';
    }
    await toast.present();
  }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  mostrarAlertaConfirmacao() {
    this.mostrarConfirmacao = true;
  }

  naoExcluir() {
    this.mostrarConfirmacao = false;
  }

  toggleAudio(event: Event) {
    const button = event.currentTarget as HTMLElement;
    const audio = this.audioPlayer.nativeElement;

    const src = this.modoEdicao
        ? 'assets/audio/audio-teste.m4a'
        : 'assets/audio/audio-pequeno.mp3';

    audio.src = src;
    audio.load();

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
