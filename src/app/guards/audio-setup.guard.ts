import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

interface UserData {
  audioConfigured?: boolean;
  id?: string;
}

@Injectable({ providedIn: 'root' })
export class AudioSetupGuard implements CanActivate {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // audio-setup.guard.ts
async canActivate(): Promise<boolean> {
  const user = await this.getCurrentUser();
  
  if (!user) {
    this.router.navigate(['/login']);
    return false;
  }

  try {
    const ref = doc(this.firestore, `users/${user.uid}`);
    const data = await firstValueFrom(docData(ref)) as UserData;

    const currentRoute = this.router.url;
    
    // Permite acesso à configuração de áudio
    if (currentRoute.includes('/audio-config')) {
      return true;
    }

    // Se não tem audio configurado, vai para o vídeo/config
    if (!data?.audioConfigured) {
      this.router.navigate(['/video']);
      return false;
    }

    // Se tem audio configurado, permite acesso
    return true;
  } catch (error) {
    console.error('Erro no guard:', error);
    this.router.navigate(['/video']);
    return false;
  }
}

  private getCurrentUser(): Promise<any> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
}