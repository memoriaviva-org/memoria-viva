import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistroService } from '../services/registro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddPage {

  mostrarConfirmacao = false;
  mostrarMensagemSucesso = false;

  mostrarJanela = false;

  // Dados do formulário
  diaSemana: string = '';
  titulo: string = '';
  horario: string = '';

  // variáveis no component
  arquivoSelecionado: File | null = null;
  fotoSelecionadaUrl: string = '';
  carregando = false;
  
  constructor(
    private registroService: RegistroService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async salvarRegistro() {
    if (!this.titulo || !this.titulo.trim() || !this.diaSemana || !this.diaSemana.trim() || !this.horario || !this.horario.trim()) {
      this.showToast('Por favor, preencha todos os campos');
      return;
    }


    this.carregando = true;

    try {
      await this.registroService.salvarRegistro(this.titulo, this.diaSemana, this.horario);
      this.mostrarMensagemSucesso = true;
      this.limparFormulario();
      // Se quiser redirecionar:
      // this.router.navigate(['/home']);
    } catch (error) {
      console.error(error);
      this.showToast('Erro ao salvar registro. Tente novamente.');
    } finally {
      this.carregando = false;
      setTimeout(() => this.mostrarMensagemSucesso = false, 3000);
    }
  }

  limparFormulario() {
    this.titulo = '';
    this.diaSemana = '';
    this.horario = '';
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom',
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
}
