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
      
      if (currentRoute.includes('/audio-config')) {
        return true;
      }

      if (data?.audioConfigured) {
        return true;
      }

      this.router.navigate(['/video']);
      return false;
    } catch (error) {
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