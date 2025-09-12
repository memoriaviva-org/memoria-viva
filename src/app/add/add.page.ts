import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { RegistroService, Registro } from '../services/registro.service';
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
  private toastController: ToastController,  
  private registroService: RegistroService,
  private router: Router) {}

  // Função chamada no input file
async onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (!file) return;

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > 10) { // limite de 10MB
    alert(`O arquivo "${file.name}" é muito grande (${sizeMB.toFixed(2)} MB).`);
    event.target.value = '';
    return;
  }

  this.arquivoSelecionado = file;

  // preview de imagem ou vídeo
  if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
    const reader = new FileReader();
    reader.onload = (e: any) => this.fotoSelecionadaUrl = e.target.result;
    reader.readAsDataURL(file);
  } else {
    this.fotoSelecionadaUrl = '';
  }
}

// Função de upload
async uploadArquivo() {
  if (!this.arquivoSelecionado) {
    alert('Selecione um arquivo primeiro.');
    return;
  }

  const formData = new FormData();
  formData.append('file', this.arquivoSelecionado);

  this.carregando = true;
  try {
    const response = await fetch('https://f59f54ced25c.ngrok-free.app/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Erro no upload');

    const data = await response.json();
    console.log('Upload concluído:', data);

    // Adiciona no serviço para que a página de registros possa mostrar
    const novoRegistro: Registro = {
      titulo: this.titulo,
      horario: this.horario,
      arquivoUrl: `https://f59f54ced25c.ngrok-free.app/files/${data.file.filename}`
    };
    this.registroService.adicionarRegistro(novoRegistro);

    alert('Upload concluído com sucesso!');

    // Limpa o formulário
    this.titulo = '';
    this.horario = '';
    this.arquivoSelecionado = null;
    this.fotoSelecionadaUrl = '';

    this.router.navigate(['/meu-dia-registros']);

  } catch (error) {
    console.error(error);
    alert('Falha no upload.');
  } finally {
    this.carregando = false;
  }
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

  mostrarAlertaConfirmacao() {
    this.mostrarConfirmacao = true;
  }

  naoExcluir() {
    this.mostrarConfirmacao = false;
  }
}
