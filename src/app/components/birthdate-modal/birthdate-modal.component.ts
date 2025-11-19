import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
  IonIcon,
  ModalController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, checkmarkCircleOutline, warningOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-birthdate-modal',
  templateUrl: './birthdate-modal.component.html',
  styleUrls: ['./birthdate-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonSpinner,
    IonIcon
  ]
})
export class BirthdateModalComponent {
  dataNascimento: string = '';
  isSaving = false;
  errorMessage = '';

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private userDataService: UserDataService,
    private loadingController: LoadingController
  ) {
    addIcons({
      calendarOutline,
      checkmarkCircleOutline,
      warningOutline,
      lockClosedOutline
    });
  }

  get maxDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  get minDate(): string {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100);
    return minDate.toISOString().split('T')[0];
  }

  async saveBirthDate() {
    if (!this.dataNascimento) {
      this.errorMessage = 'Por favor, selecione uma data de nascimento.';
      return;
    }

    const birthDate = new Date(this.dataNascimento);
    const today = new Date();

    if (birthDate > today) {
      this.errorMessage = 'A data de nascimento não pode ser futura.';
      return;
    }

    // Calcular idade mínima (13 anos)
    const minAgeDate = new Date();
    minAgeDate.setFullYear(today.getFullYear() - 13);

    if (birthDate > minAgeDate) {
      this.errorMessage = 'Você deve ter pelo menos 13 anos para usar o app.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const loading = await this.loadingController.create({
      message: 'Salvando...',
      spinner: 'crescent'
    });

    await loading.present();

    try {
      const user = await this.authService.getCurrentUser().toPromise();
      if (user) {
        await this.authService.updateUserData(
          user.displayName || 'Usuário',
          birthDate
        );

        this.userDataService.setBirthDateStatus(true);

        await loading.dismiss();
        this.modalController.dismiss({ success: true });
      }
    } catch (error: any) {
      await loading.dismiss();
      this.errorMessage = 'Erro ao salvar dados. Tente novamente.';
      console.error('Erro ao salvar data de nascimento:', error);
    } finally {
      this.isSaving = false;
    }
  }

  closeModal() {
    this.modalController.dismiss({ success: false });
  }

  onDateChange() {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
}
