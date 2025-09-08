import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  password: string = ''; // só se precisar reautenticar para mudar email

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(async user => {
      if (user) {
        await user.reload();
        this.nome = user.displayName ?? '';
        this.email = user.email ?? '';
        // idade vem do Firestore :(
      } else {
        this.nome = '';
        this.email = '';
        this.idade = 0;
      }
    });
  }

  async atualizarDados() {
    try {
      // Atualiza nome e idade no Firestore
      await this.authService.updateUserData(this.nome, this.idade);

      // Atualiza email no Firebase Auth e Firestore
      if (this.email) {
        const res = await this.authService.updateUserEmail(this.email, this.password);
        if (!res.success) throw new Error(res.message);
      }

      const toast = await this.toastController.create({
        message: 'Dados atualizados com sucesso!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } catch (error: any) {
      const toast = await this.toastController.create({
        message: error.message || 'Erro ao atualizar dados.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      console.error('Erro ao atualizar dados:', error);
    }
  }

  async logout() {
    await this.authService.logout();

    const toast = await this.toastController.create({
      message: 'Você saiu da conta.',
      duration: 2000,
      color: 'medium'
    });
    await toast.present();

    this.router.navigateByUrl('/home');
  }
}
