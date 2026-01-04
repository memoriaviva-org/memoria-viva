import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NotificacaoService } from '../services/notificacao.service';

import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
  signInWithCredential
} from '@angular/fire/auth';

import {
  GoogleAuthProvider,
  FacebookAuthProvider
} from '@angular/fire/auth';

import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  Timestamp
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { user } from '@angular/fire/auth';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private notificacaoService: NotificacaoService,
    private platform: Platform
  ) {}

  // ---------- PLATAFORMA ----------
  private isNative(): boolean {
    return this.platform.is('capacitor');
  }

  // ---------- PÓS LOGIN ----------
  private async finalizarConfiguracaoLogin(
    user: User,
    provider: string = 'senha'
  ) {
    const userData = await this.getUserData(user.uid);

    if (!userData) {
      await setDoc(doc(this.firestore, `users/${user.uid}`), {
        nome: user.displayName || '',
        email: user.email || '',
        foto: user.photoURL || '',
        provider,
        dataCriacao: Timestamp.fromDate(new Date())
      }, { merge: true });
    }

    await this.notificacaoService.solicitarPermissao();
    await this.notificacaoService.agendarBoasVindas();
    await this.notificacaoService.agendarNotificacaoPeriodica();
    await this.notificacaoService.cancelarInatividade();
    await this.notificacaoService.agendarNotificacaoInatividade();
  }

  // ---------- GOOGLE (APK) ----------
  async loginWithGoogle() {
    if (!this.isNative()) {
      throw new Error('Login Google disponível apenas no app');
    }

    const result = await FirebaseAuthentication.signInWithGoogle();

    const credential = GoogleAuthProvider.credential(
      result.credential?.idToken
    );

    const cred = await signInWithCredential(this.auth, credential);
    await this.finalizarConfiguracaoLogin(cred.user, 'google');

    return cred;
  }

  // ---------- FACEBOOK (APK) ----------
  async loginWithFacebook() {
    if (!this.isNative()) {
      throw new Error('Login Facebook disponível apenas no app');
    }

    const result = await FirebaseAuthentication.signInWithFacebook();

    const accessToken = result.credential?.accessToken;
    if (!accessToken) {
      throw new Error('Token de acesso do Facebook não obtido');
    }

    const credential = FacebookAuthProvider.credential(accessToken);

    const cred = await signInWithCredential(this.auth, credential);
    await this.finalizarConfiguracaoLogin(cred.user, 'facebook');

    return cred;
  }

  // ---------- EMAIL LOGIN ----------
  async login(email: string, senha: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, senha);
    await this.finalizarConfiguracaoLogin(cred.user);
    return cred;
  }

  // ---------- REGISTER ----------
  async register(
    email: string,
    senha: string,
    nome: string,
    dataNasc: Date
  ) {
    const cred = await createUserWithEmailAndPassword(
      this.auth,
      email,
      senha
    );

    await updateProfile(cred.user, { displayName: nome });

    await setDoc(doc(this.firestore, `users/${cred.user.uid}`), {
      nome,
      email,
      dataNasc: Timestamp.fromDate(dataNasc),
      dataCriacao: Timestamp.fromDate(new Date())
    }, { merge: true });

    await this.finalizarConfiguracaoLogin(cred.user);
    return cred;
  }

  // ---------- PERFIL ----------
  async updateUserEmail(newEmail: string, password?: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    if (password) {
      const credential = EmailAuthProvider.credential(
        currentUser.email || '',
        password
      );
      await reauthenticateWithCredential(currentUser, credential);
    }

    await updateEmail(currentUser, newEmail);
  }

  async updateUserData(nome: string, dataNasc: Date) {
    const user = await this.getCurrentUserOnce();
    if (!user) throw new Error('Usuário não autenticado');

    await setDoc(doc(this.firestore, `users/${user.uid}`), {
      nome,
      dataNasc: Timestamp.fromDate(dataNasc)
    }, { merge: true });

    await updateProfile(user, { displayName: nome });
  }

  // ---------- RESET ----------
async resetPassword(email: string) {
  await sendPasswordResetEmail(this.auth, email);

  return {
    success: true,
    message: 'E-mail de redefinição enviado com sucesso'
  };
}

  // ---------- AUX ----------
  logout() {
    return signOut(this.auth);
  }

  getCurrentUser(): Observable<User | null> {
    return user(this.auth);
  }

  getCurrentUserOnce(): Promise<User | null> {
    return new Promise(resolve => {
      this.getCurrentUser().pipe(take(1)).subscribe(u => resolve(u));
    });
  }

  async getUserData(uid: string) {
    const snap = await getDoc(doc(this.firestore, `users/${uid}`));
    return snap.exists() ? snap.data() : null;
  }
}
