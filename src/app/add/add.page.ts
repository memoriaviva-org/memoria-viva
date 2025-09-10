import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddPage {

  mostrarJanela = false;

  // Dados do formulário
  diaSemana: string = '';
  titulo: string = '';
  horario: string = '';

  // Mídia
  arquivoSelecionado: File | null = null;
  fotoSelecionadaUrl: string = ''; // preview local (imagem ou vídeo)
  midiaUrlFinal: string = '';      // url depois do upload

  maxSizeMB = 10;
  carregando = false;

  constructor(private firestore: AngularFirestore, private toastController: ToastController) {}

  async onFileSelected(event: any) {
    const file: File = event.target.files[0]; // pega só 1 arquivo

    if (!file) {
      return; // se o usuário cancelar seleção
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > this.maxSizeMB) {
      await this.showToast(`O arquivo "${file.name}" é muito grande (${sizeMB.toFixed(2)} MB). Limite: ${this.maxSizeMB} MB.`);
      event.target.value = ''; // limpa seleção para forçar reenvio correto
      return;
    }

    this.arquivoSelecionado = file;

    // Gerar preview para imagens e vídeos
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoSelecionadaUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.fotoSelecionadaUrl = ''; // não gera preview para áudio
    }

    console.log('Arquivo válido:', file);
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
}
