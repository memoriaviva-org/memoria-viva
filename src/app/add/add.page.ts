import { TipoMidia } from './../services/registro.service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { RegistroService, MeuDia } from '../services/registro.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
  standalone: false
})
export class AddPage {

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

  constructor(
    private registroService: RegistroService,
    private router: Router,
    private toastController: ToastController
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
    const hoje = new Date().getDay(); // 0 = Domingo ... 6 = Sábado
    this.diaSemana = dias[hoje];
  }

  async salvarRegistro() {
    if (this.arquivoSelecionado) {
      if (this.arquivoSelecionado.type.startsWith('image/')) this.tipoMidia = 'imagem';
      else if (this.arquivoSelecionado.type.startsWith('video/')) this.tipoMidia = 'video';
      else if (this.arquivoSelecionado.type.startsWith('audio/')) this.tipoMidia = 'audio';
    } else {
      this.tipoMidia = null;
    }

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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.arquivoSelecionado = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.fotoSelecionadaUrl = reader.result as string;
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
        // Esconde botão e mostra player
        button.style.display = 'none';
        audio.style.display = 'block';
        audio.play();
      } else {
        audio.pause();
      }

        // Quando terminar, esconde player e volta botão
        audio.onended = () => {
        audio.style.display = 'none';
        button.style.display = 'inline-flex'; // volta o ion-button
      };
    }
}
