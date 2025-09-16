import { Component, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase.config';

declare var Vlibras: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements AfterViewInit {

  constructor(
    private router: Router,
  ) {
    initializeApp(firebaseConfig); // inicializa o Firebase
  }

  ngAfterViewInit() {
    if (typeof Vlibras !== 'undefined') {
      new Vlibras.Widget('https://vlibras.gov.br/app');
    } else {
      console.warn('VLibras não carregado ainda');
    }
  }

  async loginGoogle() {
    try {
      const result = await FirebaseAuthentication.signInWithGoogle();
      console.log('Usuário logado:', result);
      this.router.navigateByUrl('/principal');
    } catch (error: any) {
      console.error('Erro no login:', error);
    }
  }
}
