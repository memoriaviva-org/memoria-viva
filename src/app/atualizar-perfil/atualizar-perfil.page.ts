import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-atualizar-perfil',
  templateUrl: './atualizar-perfil.page.html',
  styleUrls: ['./atualizar-perfil.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
})
export class AtualizarPerfilPage implements OnInit {
  nome: string = '';
  email: string = '';
  idade: number = 0;

  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(async user => {
      if (user) {
        await user.reload();
        this.nome = user.displayName ?? 'Usuário';
        this.email = user.email ?? 'Email não disponível';
        this.idade = this.idade ?? 'Idade não disponível'; 
      } else {
        this.nome = 'Não autenticado';
        this.email = 'Email não disponível';
        this.idade = 0;
      }
    });
  }

  async atualizarDados() {
  try {
    await this.authService.updateUserData(this.nome, this.idade);

    const toast = await this.toastController.create({
      message: 'Dados atualizados com sucesso!',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  } catch (error) {
    const toast = await this.toastController.create({
      message: 'Erro ao atualizar dados.',
      duration: 2000,
      color: 'danger'
    });
    await toast.present();
    console.error('Erro ao atualizar dados:', error);
  }
}

}