import { Component } from '@angular/core';
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
export class HomePage {

  constructor(
    private router: Router,
  ) {
    initializeApp(firebaseConfig); // inicializa o Firebase
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
