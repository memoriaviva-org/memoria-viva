import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ContatoService, Contato } from '../../services/contato.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

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

  contatoId: string | null = null;
  modoEdicao = false;

  constructor(
    private contatoService: ContatoService,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  async salvarContato() {
    if (!this.nome || !this.telefone) {
      this.showToast('Nome e telefone são obrigatórios');
      return;
    }

    const contato: Contato = {
      nome: this.nome,
      relacao: this.relacao,
      telefone: this.telefone,
      endereco: this.endereco,
      fotoUrl: this.fotoUrl,
      audioUrl: this.audioUrl
    };

    try {
      if (this.modoEdicao && this.contatoId) {
        // Atualiza contato existente
        contato.id = this.contatoId;  // <-- garantir que id está definido
        await this.contatoService.updateContato(contato);
      } else {
        // Adiciona novo contato
        await this.contatoService.addContato(contato);
      }
      this.router.navigateByUrl('/contatos');
    } catch (err) {
      console.error(err);
      this.showToast('Erro ao salvar contato');
    }
  }

  // Função para deletar o contato
  async deletarContato() {
    if (!this.contatoId) {
      this.showToast('Contato não encontrado');
      return;
    }

    try {
      await this.contatoService.deleteContato(this.contatoId);
      this.router.navigateByUrl('/contatos');  
    } catch (err) {
      console.error(err);
      this.showToast('Erro ao deletar contato');
    }
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.arquivoSelecionado = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.fotoUrl = reader.result as string;
      };
      reader.readAsDataURL(this.arquivoSelecionado);
    }
  }

  onAudioSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.audioSelecionado = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.audioUrl = reader.result as string;
      };
      reader.readAsDataURL(this.audioSelecionado);
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      if (params['editar'] === 'true' && params['id']) {
        this.modoEdicao = true;
        this.contatoId = params['id'];
        const contato = await this.contatoService.getContatoById(this.contatoId!);
        if (contato) {
          // Preencher os campos
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

  mostrarJanela = false;

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

  maskPhone(event: any) {
    const input = event.target;
    let value: string = input.value.replace(/\D/g, ''); // Só números

    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    if (value.length <= 10) {
      if (value.length > 6) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,4})/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/^(\d{0,2})/, '($1');
      }
    } else {
      if (value.length > 7) {
        value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/^(\d{0,2})/, '($1');
      }
    }

    input.value = value;
    this.telefone = value; // Atualiza a variável com o valor formatado
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
