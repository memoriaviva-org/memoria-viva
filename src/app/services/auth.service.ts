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

  // --- DETECÇÃO DE PLATAFORMA ---
  private isIosPwa(): boolean {
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = (window.navigator as any).standalone === true;
    return isIos && isStandalone;
  }

  // --- LÓGICA DE PÓS-LOGIN (Firestore + Notificações) ---
  private async finalizarConfiguracaoLogin(user: User, provider: string = 'senha') {
    if (!user) return;

    const userData = await this.getUserData(user.uid);
    
    // Se não tem dados, cria documento básico
    if (!userData) {
      await setDoc(doc(this.firestore, `users/${user.uid}`), {
        nome: user.displayName || '',
        email: user.email || '',
        foto: user.photoURL || '',
        provider: provider,
        dataCriacao: Timestamp.fromDate(new Date())
      }, { merge: true });
    }

    // Executa fluxo de notificações
    await this.notificacaoService.solicitarPermissao();
    await this.notificacaoService.agendarBoasVindas();
    await this.notificacaoService.agendarNotificacaoPeriodica();
    await this.notificacaoService.cancelarInatividade();
    await this.notificacaoService.agendarNotificacaoInatividade();
  }

  // --- MÉTODOS DE AUTENTICAÇÃO ---

  async verificarResultadoRedirect() {
    try {
      const result = await getRedirectResult(this.auth);
      if (result?.user) {
        await this.finalizarConfiguracaoLogin(result.user, result.providerId || 'social');
      }
    } catch (error) {
      console.error("Erro no retorno do login:", error);
    }
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    if (this.isIosPwa()) {
      return await signInWithRedirect(this.auth, provider);
    } else {
      const cred = await signInWithPopup(this.auth, provider);
      await this.finalizarConfiguracaoLogin(cred.user, 'google');
      return cred;
    }
  }

  async loginWithFacebookSimple() {
    const provider = new FacebookAuthProvider();
    provider.addScope('email');
    provider.addScope('public_profile');

    if (this.isIosPwa()) {
      return await signInWithRedirect(this.auth, provider);
    } else {
      try {
        const cred = await signInWithPopup(this.auth, provider);
        await this.finalizarConfiguracaoLogin(cred.user, 'facebook');
        return cred;
      } catch (error: any) {
        throw this.handleFirebaseAuthError(error);
      }
    }
  }

  async login(email: string, senha: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, senha);
    await this.finalizarConfiguracaoLogin(cred.user);
    return cred;
  }

  async register(email: string, senha: string, nome: string, dataNasc: Date) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, senha);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: nome });
      
      // Aqui garantimos que o dataNasc do registro original seja salvo
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

  // --- MÉTODOS DE MANUTENÇÃO E PERFIL ---

  // RECOLOCADO: O método que tinha sumido
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
    if (!user) throw new Error('Usuário não autenticado.');

    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, {
      nome,
      dataNasc: Timestamp.fromDate(dataNasc)
    }, { merge: true });

    await updateProfile(user, { displayName: nome });
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { success: true, message: 'Um link para redefinir sua senha foi enviado ao seu e-mail.' };
    } catch (error: any) {
      let errorMessage = 'Ocorreu um erro ao redefinir a senha.';
      switch (error.code) {
        case 'auth/invalid-email': errorMessage = 'O e-mail informado é inválido.'; break;
        case 'auth/user-not-found': errorMessage = 'Nenhum usuário encontrado com esse e-mail.'; break;
        case 'auth/too-many-requests': errorMessage = 'Muitas tentativas. Aguarde um pouco.'; break;
        case 'auth/network-request-failed': errorMessage = 'Falha de conexão.'; break;
      }
      return { success: false, message: errorMessage };
    }
  }

  // --- AUXILIARES ---

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser(): Observable<User | null> {
    return user(this.auth);
  }

  getCurrentUserOnce(): Promise<User | null> {
    return new Promise((resolve) => {
      this.getCurrentUser().pipe(take(1)).subscribe({
        next: (u) => resolve(u),
        error: () => resolve(null)
      });
    });
  }

  async getUserData(uid: string) {
    const userSnap = await getDoc(doc(this.firestore, `users/${uid}`));
    return userSnap.exists() ? userSnap.data() : null;
  }

  private handleFirebaseAuthError(error: any): Error {
    let errorMessage = 'Erro ao fazer login. Tente novamente.';
    switch (error.code) {
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'Já existe uma conta com este e-mail usando outro método de login.';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Popup bloqueado pelo navegador. Permita popups.';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Popup fechado pelo usuário.';
        break;
    }
    return new Error(errorMessage);
  }
}