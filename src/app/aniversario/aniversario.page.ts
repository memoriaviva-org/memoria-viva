// src/app/aniversario/aniversario.page.ts
import { Component, ViewChild, ElementRef } from '@angular/core';
import { 
  LoadingController 
} from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data.service';
import { AudioPreferenceService } from '../services/audio-preference.service';

@Component({
  selector: 'app-aniversario',
  templateUrl: './aniversario.page.html',
  styleUrls: ['./aniversario.page.scss'],
  standalone: false
})
export class AniversarioPage {
  dataNascimento: string = '';
  isSaving = false;
  errorMessage = '';

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(
    private authService: AuthService,
    private userDataService: UserDataService,
    private loadingController: LoadingController,
    private router: Router,
    private audioPref: AudioPreferenceService
  ) {}

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

  async salvarAniversario() {
    if (!this.dataNascimento) {
      this.errorMessage = 'Por favor, selecione sua data de aniversário.';
      return;
    }

    const aniversario = new Date(this.dataNascimento);
    const hoje = new Date();

    if (aniversario > hoje) {
      this.errorMessage = 'A data de aniversário não pode ser futura.';
      return;
    }

    // Calcular idade mínima (13 anos)
    const dataMinima = new Date();
    dataMinima.setFullYear(hoje.getFullYear() - 13);

    if (aniversario > dataMinima) {
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
        const user = await this.authService.getCurrentUserOnce();      
        if (user) {
        await this.authService.updateUserData(
          user.displayName || 'Usuário',
          aniversario
        );

       
      this.userDataService.setBirthDateStatus(true);
      await loading.dismiss();
      this.router.navigate(['/principal']);
    } else {
      await loading.dismiss();
      this.errorMessage = 'Usuário não encontrado. Faça login novamente.';
    }
  } catch (error: any) {
      await loading.dismiss();
      this.errorMessage = 'Erro ao salvar dados. Tente novamente.';
      console.error('Erro ao salvar aniversário:', error);
    } finally {
      this.isSaving = false;
    }
  }

  onDateChange() {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
  
  toggleAudio() {
    this.audioPref.toggleAudio(this.audioPlayer);
  }
}