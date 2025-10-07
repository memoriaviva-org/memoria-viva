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

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarJanela = false;
  mostrarMensagemSucesso = false;
  mostrarConfirmacao = false;

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

  async salvarRegistro() {
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
      this.showToast('Erro ao salvar registro');
    }
  }

  async atualizarRegistro() {
    if (!this.registroId) {
      this.showToast('ID do registro não encontrado');
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
      this.showToast('Registro atualizado com sucesso!');
      this.router.navigateByUrl('/meu-dia-registros');
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      this.showToast('Erro ao atualizar registro');
    }
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

      setTimeout(() => {
        this.mostrarMensagemSucesso = false;
        this.router.navigateByUrl('/meu-dia-registros');
      }, 2000);
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
      this.showToast('Erro ao excluir registro');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.arquivoSelecionado = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.fotoSelecionadaUrl = reader.result as string;
        // Determinar tipo de mídia quando um novo arquivo é selecionado
        this.determinarTipoMidia();
      };
      reader.readAsDataURL(this.arquivoSelecionado);
    }
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
