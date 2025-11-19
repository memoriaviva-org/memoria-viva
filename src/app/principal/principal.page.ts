import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AudioPreferenceService } from '../services/audio-preference.service';
import { UserDataService } from '../services/user-data.service';
import { BirthdateModalComponent } from '../components/birthdate-modal/birthdate-modal.component';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: false
})
export class PrincipalPage implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  mostrarJanela = false;
  nome: string = '';
  private birthDateModal: any = null;
  private modalShown = false;

  constructor(
    private authService: AuthService,
    private audioPref: AudioPreferenceService,
    private userDataService: UserDataService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    console.log('PrincipalPage - ngOnInit iniciado');

    this.authService.getCurrentUser().subscribe(async user => {
      if (user) {
        console.log('PrincipalPage - Usuário detectado:', user.uid);
        await user.reload();
        this.nome = user.displayName ?? 'Usuário';

        await this.checkAndShowBirthdateModal(user.uid);

      } else {
        console.log('PrincipalPage - Nenhum usuário autenticado');
        this.nome = 'Não autenticado';
      }
    });
  }

  private async checkAndShowBirthdateModal(uid: string) {
    if (this.modalShown) {
      console.log('Modal já foi mostrado, ignorando...');
      return;
    }

    try {
      console.log('Verificando data de nascimento para usuário:', uid);
      const hasBirthDate = await this.userDataService.checkUserBirthDate(uid);
      console.log('Resultado da verificação:', hasBirthDate);

      if (!hasBirthDate) {
        console.log('Mostrando modal de data de nascimento...');
        await this.showBirthDateModal();
        this.modalShown = true;
      } else {
        console.log('Usuário já tem data de nascimento cadastrada');
      }
    } catch (error) {
      console.error('Erro ao verificar data de nascimento:', error);
    }
  }

  private async showBirthDateModal() {
    if (this.birthDateModal) {
      console.log('Modal já está aberto');
      return;
    }

    console.log('Criando modal...');

    try {
      this.birthDateModal = await this.modalController.create({
        component: BirthdateModalComponent,
        cssClass: 'birthdate-modal',
        backdropDismiss: false, // ✅ Apenas esta propriedade para impedir fechar
        // ❌ REMOVER: swipeToClose: false - não é uma propriedade válida
        componentProps: {}
      });

      console.log('Modal criado, apresentando...');
      await this.birthDateModal.present();
      console.log('Modal apresentado com sucesso');

      // ✅ Quando o modal é fechado
      const { data } = await this.birthDateModal.onDidDismiss();
      this.birthDateModal = null;
      this.modalShown = false;

      console.log('Modal fechado com dados:', data);

      if (data?.success) {
        console.log('Data de nascimento salva com sucesso!');
        // Recarrega os dados do usuário se necessário
        const user = await this.authService.getCurrentUser().pipe(take(1)).toPromise();
        if (user) {
          await this.userDataService.checkUserBirthDate(user.uid);
        }
      }

    } catch (error) {
      console.error('Erro ao mostrar modal:', error);
      this.birthDateModal = null;
      this.modalShown = false;
    }
  }

  ngAfterViewInit() {
    console.log('PrincipalPage - ngAfterViewInit');
    this.audioPref.autoPlayIfEnabled(this.audioPlayer);
  }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  toggleAudio() {
    this.audioPref.toggleAudio(this.audioPlayer);
  }
}
