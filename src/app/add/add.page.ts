import { Component, OnInit } from '@angular/core';
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

  mostrarJanela = false;
  mostrarMensagemSucesso = false;
  mostrarConfirmacao = false;

  titulo: string = '';
  diaSemana: string = '';
  horario: string = '';

  carregando = false;

  constructor(
    private registroService: RegistroService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async salvarRegistro() {
    const item: MeuDia = {
      titulo: this.titulo,
      diaSemana: this.diaSemana,
      horario: Number(this.horario)
    };

    try {
      await this.registroService.addItem(item);
      this.router.navigateByUrl('/meu-dia-registros');
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  }

  limparFormulario() {
    this.titulo = '';
    this.diaSemana = '';
    this.horario = '';
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
}


