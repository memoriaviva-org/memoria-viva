import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  // Login com Google
  async loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
      return result;
    } catch (error) {
      console.error('Erro ao autenticar com Google:', error);
      throw error;
    }
  }

  // Cadastro com nome
  async register(email: string, password: string, nome?: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (user && nome) {
      await user.updateProfile({ displayName: nome });
      await user.reload();
    }

    return userCredential;
  }

  // Login com email/senha
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Logout
  logout() {
    return this.afAuth.signOut();
  }

  // Usuário atual (observable)
  getCurrentUser() {
    return this.afAuth.authState;
  }

  // Resetar senha
  async resetPassword(email: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      return { success: true, message: 'Um link para redefinir sua senha foi enviado ao seu e-mail.' };
    } catch (error: any) {
      let errorMessage = 'Ocorreu um erro ao redefinir a senha.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'O e-mail informado é inválido.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Nenhum usuário encontrado com esse e-mail.';
          break;
        case 'auth/missing-email':
          errorMessage = 'Por favor, informe um e-mail.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Falha de conexão. Verifique sua internet.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas realizadas. Aguarde um pouco.';
          break;
        default:
          if (error.message) errorMessage = error.message;
      }
      return { success: false, message: errorMessage };
    }
  }

  // Atualizar nome + idade no Firestore
  async updateUserData(nome: string, idade: number) {
    const currentUser = await this.afAuth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    await currentUser.updateProfile({ displayName: nome });

    const uid = currentUser.uid;
    return this.firestore.collection('users').doc(uid).set({
      nome,
      idade,
      email: currentUser.email
    }, { merge: true });
  }

  // Atualizar email do usuário
  async updateUserEmail(newEmail: string, password?: string) {
    const currentUser = await this.afAuth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      // Reautenticação se senha for passada
      if (password) {
        const credential = firebase.auth.EmailAuthProvider.credential(
          currentUser.email || '',
          password
        );
        await currentUser.reauthenticateWithCredential(credential);
      }

      // Atualiza email no Firebase Auth
      await currentUser.updateEmail(newEmail);

      // Atualiza também no Firestore
      const uid = currentUser.uid;
      await this.firestore.collection('users').doc(uid).set({
        email: newEmail
      }, { merge: true });

      return { success: true, message: 'Email atualizado com sucesso!' };
    } catch (error: any) {
      let errorMessage = 'Erro ao atualizar o email.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'O email informado é inválido.';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Para atualizar o email, faça login novamente.';
          break;
        default:
          if (error.message) errorMessage = error.message;
      }
      return { success: false, message: errorMessage };
    }
  }
}
