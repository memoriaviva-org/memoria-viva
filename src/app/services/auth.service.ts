import { Injectable } from '@angular/core';
import { NotificacaoService } from '../services/notificacao.service';
import {
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  User,
  signInWithPopup
} from '@angular/fire/auth';
import { take } from 'rxjs/operators';


import { FacebookAuthProvider, signInWithCredential, OAuthProvider } from 'firebase/auth';

import { Timestamp } from 'firebase/firestore';


import {
  Firestore,
  doc,
  setDoc,
  getDoc
} from '@angular/fire/firestore';

import { Observable, firstValueFrom  } from 'rxjs';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private notificacaoService: NotificacaoService
  )  {
  }

  // Login com email e senha
  async login(email: string, senha: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, senha);

    if (cred.user) {
      await this.notificacaoService.solicitarPermissao();
      await this.notificacaoService.agendarBoasVindas();
      await this.notificacaoService.agendarNotificacaoPeriodica();
      await this.notificacaoService.cancelarInatividade();
      await this.notificacaoService.agendarNotificacaoInatividade();
    }

    return cred;
  }

  // Cadastro de usuário
  async register(email: string, senha: string, nome: string, dataNasc: Date) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, senha);

    if (userCredential.user) {
      // Atualiza o displayName
      await updateProfile(userCredential.user, { displayName: nome });

      // Salva os dados no Firestore
      const uid = userCredential.user.uid;
      await setDoc(doc(this.firestore, `users/${uid}`), {
        nome,
        email,
        dataNasc: Timestamp.fromDate(dataNasc)
      }, { merge: true });
    }

    return userCredential;
  }

  // Logout
  logout() {
    return signOut(this.auth);
  }

  // Login com Google
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.auth, provider);

    if (cred.user) {
      // VERIFICA SE JÁ TEM DADOS NO FIRESTORE
      const userData = await this.getUserData(cred.user.uid);
      
      // SE NÃO TEM DADOS, CRIA DOCUMENTO BÁSICO SEM dataNasc
      if (!userData) {
        await setDoc(doc(this.firestore, `users/${cred.user.uid}`), {
          nome: cred.user.displayName || '',
          email: cred.user.email || '',
          foto: cred.user.photoURL || '',
          provider: 'google',
          dataCriacao: Timestamp.fromDate(new Date())
          // dataNasc NÃO é definido aqui - será preenchido no modal
        }, { merge: true });
      }

      await this.notificacaoService.solicitarPermissao();
      await this.notificacaoService.agendarBoasVindas();
      await this.notificacaoService.agendarNotificacaoPeriodica();
      await this.notificacaoService.cancelarInatividade();
      await this.notificacaoService.agendarNotificacaoInatividade();
    }

    return cred;
  }


  // Método alternativo mais simples usando signInWithPopup diretamente
  async loginWithFacebookSimple(): Promise<any> {
    try {
      const provider = new FacebookAuthProvider();
      provider.addScope('email');
      provider.addScope('public_profile');
      
      const userCredential = await signInWithPopup(this.auth, provider);

      if (userCredential.user) {
        // VERIFICA SE JÁ TEM DADOS NO FIRESTORE
        const userData = await this.getUserData(userCredential.user.uid);
        
        // SE NÃO TEM DADOS, CRIA DOCUMENTO BÁSICO SEM dataNasc
        if (!userData) {
          await setDoc(doc(this.firestore, `users/${userCredential.user.uid}`), {
            nome: userCredential.user.displayName || '',
            email: userCredential.user.email || '',
            foto: userCredential.user.photoURL || '',
            provider: 'facebook',
            dataCriacao: Timestamp.fromDate(new Date())
            // dataNasc NÃO é definido aqui - será preenchido no modal
          }, { merge: true });
        }

        await this.notificacaoService.solicitarPermissao();
        await this.notificacaoService.agendarBoasVindas();
        await this.notificacaoService.agendarNotificacaoPeriodica();
        await this.notificacaoService.cancelarInatividade();
        await this.notificacaoService.agendarNotificacaoInatividade();
      }

      return userCredential;
    } catch (error: any) {
      console.error('Facebook login error:', error);
      throw this.handleFirebaseAuthError(error);
    }
  }

  // Handler para erros de autenticação
  private handleFirebaseAuthError(error: any): Error {
    let errorMessage = 'Erro ao fazer login. Tente novamente.';
    
    switch (error.code) {
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'Já existe uma conta com o mesmo e-mail mas com método de login diferente.';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Popup bloqueado pelo navegador. Permita popups para este site.';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Popup fechado pelo usuário.';
        break;
      case 'auth/unauthorized-domain':
        errorMessage = 'Domínio não autorizado para login.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Operação não permitida. Verifique as configurações do Firebase.';
        break;
    }
    
    return new Error(errorMessage);
  }

  // Observable do usuário atual
  getCurrentUser(): Observable<User | null> {
    return user(this.auth);
  }

  // NOVO MÉTODO: Para pegar o usuário atual uma vez (resolve o problema do toPromise)
  getCurrentUserOnce(): Promise<User | null> {
    return new Promise((resolve) => {
      this.getCurrentUser().pipe(take(1)).subscribe({
        next: (user) => resolve(user),
        error: () => resolve(null)
      });
    });
  }

  // Buscar dados do usuário no Firestore
  async getUserData(uid: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  }

  // Resetar senha
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
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
      }
      return { success: false, message: errorMessage };
    }
  }

  // Atualizar nome e data de nascimento do usuário - CORRIGIDO
  async updateUserData(nome: string, dataNasc: Date) {
    // USE O NOVO MÉTODO AQUI TAMBÉM
    const user = await this.getCurrentUserOnce();
    if (!user) throw new Error('Usuário não autenticado.');

    const userRef = doc(this.firestore, `users/${user.uid}`);

    await setDoc(userRef, {
      nome,
      dataNasc: Timestamp.fromDate(dataNasc)
    }, { merge: true });

    await updateProfile(user, { displayName: nome });
  }

  // Atualizar email do usuário
  async updateUserEmail(newEmail: string, password?: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    if (password) {
      const credential = EmailAuthProvider.credential(currentUser.email || '', password);
      await reauthenticateWithCredential(currentUser, credential);
    }

    await updateEmail(currentUser, newEmail);
  }
}