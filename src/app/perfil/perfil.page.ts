// import { firebase } from 'firebase/compat/app';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
})


export class PerfilPage implements OnInit {
  mostrarJanela = false

  nome: string = '';
  email: string = '';
  idade: number = 0;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController
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

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  voltar() {
    this.navCtrl.back();
  }

}
