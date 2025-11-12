import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AudioPreferenceService } from '../services/audio-preference.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PerfilPage implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarJanela = false;

  nome: string = '';
  email: string = '';
  idade: string = '';
  dataNasc: Date | null = null;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private audioPref: AudioPreferenceService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(async user => {
      if (user) {
        await user.reload();
        this.nome = user.displayName ?? 'Usuário';
        this.email = user.email ?? 'Email não disponível';

        // Busca dados do Firestore
        const dados = await this.authService.getUserData(user.uid);
        if (dados && dados['dataNasc']) {
          // Firestore Timestamp -> Date
          const dataFirestore = dados['dataNasc'].toDate
            ? dados['dataNasc'].toDate()
            : new Date(dados['dataNasc']);

          this.dataNasc = dataFirestore;
          this.idade = this.calcularIdade(dataFirestore).toString();
        } else {
          this.idade = 'Idade não disponível';
        }
      } else {
        this.nome = 'Não autenticado';
        this.email = 'Email não disponível';
        this.idade = '0';
      }
    });
  }

    async ngAfterViewInit() {
    await this.audioPref.autoPlayIfEnabled(this.audioPlayer);
  }

  private calcularIdade(dataNasc: Date): number {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const m = hoje.getMonth() - dataNasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }
    return idade;
  }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  voltar() {
    this.navCtrl.back();
  }

  
  toggleAudio() {
    this.audioPref.toggleAudio(this.audioPlayer);
  }
}
