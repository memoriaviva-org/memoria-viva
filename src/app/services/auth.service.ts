import { Injectable, inject } from '@angular/core';
import { Platform } from '@ionic/angular';

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
  signInWithRedirect,
  getRedirectResult,
  user as authUser,
  signInWithPopup
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  setDoc,
  getDoc
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private platform = inject(Platform);
  private authenticate = inject(Auth);

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  // Login com email e senha
  login(email: string, senha: string) {
    return signInWithEmailAndPassword(this.auth, email, senha);
  }

  // Cadastro de usuário
  async register(email: string, senha: string, nome: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, senha);

    if (userCredential.user) {
      // Atualiza o displayName
      await updateProfile(userCredential.user, { displayName: nome });

      // Salva os dados no Firestore
      const uid = userCredential.user.uid;
      await setDoc(doc(this.firestore, `users/${uid}`), {
        nome,
        email
      }, { merge: true });
    }

    return userCredential;
  }

  // Logout
  logout() {
    return signOut(this.auth);
  }

 async loginWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();

  if (this.platform.is('android') || this.platform.is('ios')) {
    console.log('📱 Mobile: redirect Google');
    await signInWithRedirect(this.auth, provider);
  } else {
    console.log('💻 Web: popup Google');
    const result = await signInWithPopup(this.auth, provider);
    if (result?.user) {
      await this.saveUserToFirestore(result.user);
    }
  }
}

// Retorna o usuário autenticado após redirect
async handleAuthRedirect(): Promise<User | null> {
  try {
    const result = await getRedirectResult(this.auth);
    if (result?.user) {
      await this.saveUserToFirestore(result.user);
      console.log('✅ Usuário autenticado via redirect:', result.user.email);
      return result.user;
    }
    return null;
  } catch (error) {
    console.error('Erro no redirect:', error);
    return null;
  }
}


  private async checkCurrentUser(): Promise<boolean> {
    const user = this.auth.currentUser;
    if (user) {
      console.log('✅ Usuário já está autenticado:', user.email);
      return true;
    }
    return false;
  }
  /**
   * Salva/Atualiza usuário no Firestore
   */
  private async saveUserToFirestore(user: User): Promise<void> {
    try {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date(),
        provider: 'google'
      }, { merge: true });
      
      console.log('Usuário salvo no Firestore:', user.uid);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      // Não lança erro para não quebrar o login
    }
  }



  // Observable do usuário atual
  getCurrentUser(): Observable<User | null> {
    return authUser(this.auth);
  }

  // Buscar dados do usuário no Firestore
async getUserData(uid: string) {
  // userRef e getDoc agora usam this.firestore, que é injetado
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

  // Atualizar nome e idade do usuário
  async updateUserData(nome: string, idade: number) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    await updateProfile(currentUser, { displayName: nome });

    const uid = currentUser.uid;
    return setDoc(doc(this.firestore, `users/${uid}`), {
      nome,
      idade,
      email: currentUser.email
    }, { merge: true });
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

    // Atualiza também no Firestore
    const uid = currentUser.uid;
    await setDoc(doc(this.firestore, `users/${uid}`), { email: newEmail }, { merge: true });

    return { success: true, message: 'Email atualizado com sucesso!' };
  }
}
