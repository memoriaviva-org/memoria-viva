import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase.config';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage {

  constructor() {
    initializeApp(firebaseConfig); // inicializa o Firebase
  }

  async loginGoogle() {
    try {
      const result = await FirebaseAuthentication.signInWithGoogle();
      console.log('Usuário logado:', result);
    } catch (error: any) {
      console.error('Erro no login:', error);
    }
  }
}
