import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage {

constructor(private afAuth: AngularFireAuth, private router: Router) {}

  async loginGoogle() {
  try {
    const result = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    console.log('Usuário logado:', result);
    this.router.navigateByUrl('/principal');
  } catch (error) {
    console.error('Erro no login:', error);
  }
}
}
