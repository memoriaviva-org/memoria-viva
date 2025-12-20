import { Injectable } from '@angular/core';
import { NotificacaoService } from '../services/notificacao.service';
import {
  Auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  User,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  user
} from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { Timestamp, Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private notificacaoService: NotificacaoService
  ) {
    this.verificarResultadoRedirect();
  }

  // -------- PLATAFORMA --------
  private isIosPwa(): boolean {
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone === true;
    return isIos && isStandalone;
  }

  // -------- PÓS LOGIN --------
  private async finalizarConfiguracaoLogin(user: User, provider: string = 'senha') {
    if (!user) return;

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

  // -------- REDIRECT --------
  async verificarResultadoRedirect() {
    try {
      const result = await getRedirectResult(this.auth);
      if (result?.user) {
        await this.finalizarConfiguracaoLogin(result.user, result.providerId || 'social');
      }
    } catch (error) {
      console.error('Erro no redirect:', error);
    }
  }

  // -------- GOOGLE --------
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    if (this.isIosPwa()) {
      return signInWithRedirect(this.auth, provider);
    }

    const cred = await signInWithPopup(this.auth, provider);
    await this.finalizarConfiguracaoLogin(cred.user, 'google');
    return cred;
  }

  // -------- FACEBOOK (mantendo nome esperado) --------
  async loginWithFacebookSimple() {
    return this.loginWithFacebook();
  }

  async loginWithFacebook() {
    const provider = new FacebookAuthProvider();
    provider.addScope('email');

    if (this.isIosPwa()) {
      return signInWithRedirect(this.auth, provider);
    }

    const cred = await signInWithPopup(this.auth, provider);
    await this.finalizarConfiguracaoLogin(cred.user, 'facebook');
    return cred;
  }

  // -------- EMAIL LOGIN --------
  async login(email: string, senha: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, senha);
    await this.finalizarConfiguracaoLogin(cred.user);
    return cred;
  }

  // -------- EMAIL REGISTER --------
  async register(email: string, senha: string, nome: string, dataNasc: Date) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, senha);

    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: nome });

      await setDoc(doc(this.firestore, `users/${userCredential.user.uid}`), {
        nome,
        email,
        dataNasc: Timestamp.fromDate(dataNasc),
        dataCriacao: Timestamp.fromDate(new Date())
      }, { merge: true });

      await this.finalizarConfiguracaoLogin(userCredential.user);
    }

    return userCredential;
  }

  // -------- PERFIL --------
  async updateUserEmail(newEmail: string, password?: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    if (password) {
      const credential = EmailAuthProvider.credential(currentUser.email || '', password);
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

  // -------- RESET SENHA --------
 async resetPassword(email: string) {
  await sendPasswordResetEmail(this.auth, email);
  return {
    success: true,
    message: 'E-mail de redefinição enviado com sucesso'
  };
}

  // -------- AUX --------
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

  // ✅ MÉTODO QUE AS TELAS ESPERAM
  async getUserData(uid: string) {
    const snap = await getDoc(doc(this.firestore, `users/${uid}`));
    return snap.exists() ? snap.data() : null;
  }
}
