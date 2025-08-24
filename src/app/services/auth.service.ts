import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  // Login com Google
  async loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
      return result; // retorna o usuário logado
    } catch (error) {
      console.error('Erro ao autenticar com Google:', error);
      throw error;
    }
  }

  // Cadastro com nome
  async register(email: string, password: string, nome?: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);

    const user = userCredential.user; // pode ser null
    if (user && nome) {
      await user.updateProfile({
        displayName: nome
      });
    }

    return userCredential;
  }

  // Login com e-mail/senha
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Logout
  logout() {
    return this.afAuth.signOut();
  }

  // Usuário atual
  getCurrentUser() {
    return this.afAuth.authState;
  }
}
