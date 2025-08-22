import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

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

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }

  getCurrentUser() {
    return this.afAuth.authState;
  }
}

