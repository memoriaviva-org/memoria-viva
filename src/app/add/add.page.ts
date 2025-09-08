import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


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


  mostrarConfirmacao = false;
  mostrarMensagemSucesso = false;

  // Dados do formulário
  diaSemana: string = '';
  titulo: string = '';
  horario: string = '';

  // Mídia
  arquivoSelecionado: File | null = null;
  fotoSelecionadaUrl: string = ''; // preview local
  midiaUrlFinal: string = '';      // url depois do upload

  carregando = false;

  constructor(private firestore: AngularFirestore) {}

  mostrarAlertaConfirmacao() {
    this.mostrarConfirmacao = true;
  }

  // Quando o usuário escolhe uma mídia
handleFileInput(event: any) {
  const file: File = event.target.files[0];
  if (file && this.tipoValido(file.name)) {
    this.arquivoSelecionado = file;
    this.fotoSelecionadaUrl = this.midiaUrlFinal = URL.createObjectURL(file);
  } else {
    alert('Tipo de arquivo não suportado.');
  }
}

tipoValido(nomeArquivo: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|mp4|mov|webm|avi)$/i.test(nomeArquivo);
}


  // Verifica se é imagem
  ehImagem(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }

  // Verifica se é vídeo
  ehVideo(url: string): boolean {
    return /\.(mp4|mov|webm|avi)$/i.test(url);
  }

  // ⚡ Faz upload no Firebase Storage e retorna a URL
  async salvarNoFirebaseStorage(): Promise<string> {
    if (!this.arquivoSelecionado) throw new Error('Nenhum arquivo selecionado');

    const storage = getStorage();
    const nomeArquivo = `${Date.now()}-${this.arquivoSelecionado.name}`;
    const storageRef = ref(storage, `midia/${nomeArquivo}`);

    // Faz upload
    await uploadBytes(storageRef, this.arquivoSelecionado);

    // Retorna URL pública
    return await getDownloadURL(storageRef);
  }

  // ⚡ Salva os dados no Firestore
  async salvarNoFirestore() {
  try {
    this.carregando = true;  // começa o loading

    if (this.arquivoSelecionado) {
        this.midiaUrlFinal = await this.salvarNoFirebaseStorage();
        this.fotoSelecionadaUrl = this.midiaUrlFinal;
    }

    const dados = {
      diaSemana: this.diaSemana,
      titulo: this.titulo,
      horario: this.horario,
      midiaUrl: this.midiaUrlFinal || '',
      criadoEm: new Date()
    };

    await this.firestore.collection('meu-dia').add(dados);

    alert('Dados salvos com sucesso!');
    this.resetarFormulario();
  } catch (erro) {
    console.error('Erro ao salvar:', erro);
    alert('Erro ao salvar. Tente novamente.');
  } finally {
    this.carregando = false;  // termina o loading
  }
}

  // ⚡ Limpa campos depois de salvar
  resetarFormulario() {
    this.diaSemana = '';
    this.titulo = '';
    this.horario = '';
    this.arquivoSelecionado = null;
    this.fotoSelecionadaUrl = '';
    this.midiaUrlFinal = '';
  }


}
